// via: https://github.com/Open-Attestation/ethers-contract-hooks
import { Contract, ContractTransaction } from "ethers";
import { useCallback, useState } from "react";
import { ContractReceipt } from "@ethersproject/contracts";

/*
export const TestHook = ({ contract }: { contract: DocumentStore }): ReactElement => {
  const { state, send, events, receipt, transaction, transactionHash, errorMessage } = useContractFunctionHook(
    contract,
    "issue"
  );
  const [hash, setHash] = useState("0x3e912831190e8fab93f35f16ba29598389cba9a681b2c22f49d1ec2701f15cd0");
  const handleTransaction = (): void => {
    send(hash);
  };
  return (
    <div>
      <input value={hash} onChange={(e) => setHash(e.target.value)} style={{ width: "100%" }} />
      <button onClick={handleTransaction}>Issue Merkle Root</button>
      <h2>Summary</h2>
      <p>Transaction State: {state}</p>
      <p>Transaction Hash: {transactionHash}</p>
      <p>Error: {errorMessage}</p>
      <h2>Transaction</h2>
      <pre>{JSON.stringify(transaction, null, 2)}</pre>
      <h2>Receipt</h2>
      <pre>{JSON.stringify(receipt, null, 2)}</pre>
      <h2>Events</h2>
      <pre>{JSON.stringify(events, null, 2)}</pre>
    </div>
  );
};
*/

export type ContractFunctionState =
  | "UNINITIALIZED"
  | "INITIALIZED"
  | "PENDING_CONFIRMATION"
  | "CONFIRMED"
  | "ERROR";
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export function useContractInteraction<
  T extends Contract,
  S extends keyof T["functions"]
>(
  contract?: T,
  method?: S
): {
  call: T["functions"][S];
  send: T["functions"][S];
  reset: () => void;
  state: ContractFunctionState;
  receipt?: ContractReceipt;
  transaction?: ContractTransaction;
  error?: Error;
  value?: UnwrapPromise<ReturnType<T["functions"][S]>>;
  events?: ContractReceipt["events"];
  transactionHash?: string;
  errorMessage?: string;
} {
  const [state, setState] = useState<ContractFunctionState>("UNINITIALIZED");
  const [receipt, setReceipt] = useState<ContractReceipt>();
  const [transaction, setTransaction] = useState<ContractTransaction>();
  const [error, setError] = useState<Error>();
  const [value, setValue] =
    useState<UnwrapPromise<ReturnType<T["functions"][S]>>>();

  // Reset state is added to allow the same hook to be used for multiple transactions although
  // it is highly unrecommended.
  const resetState = (): void => {
    setState("UNINITIALIZED");
    setReceipt(undefined);
    setTransaction(undefined);
    setError(undefined);
    setValue(undefined);
  };

  const sendFn = (async (...params: any[]) => {
    if (!contract || !method) {
      setState("ERROR");
      setError(new Error("Contract or method is not specified"));
      return;
    }
    resetState();
    const contractMethod = contract.functions[method as string];
    const deferredTx = contractMethod(...params);
    setState("INITIALIZED");
    try {
      const transaction: ContractTransaction = await deferredTx;
      setState("PENDING_CONFIRMATION");
      setTransaction(transaction);
      const receipt = await transaction.wait();
      setState("CONFIRMED");
      setReceipt(receipt);
    } catch (e) {
      setError(e);
      setState("ERROR");
    }
  }) as T["functions"][S];

  const callFn = (async (...params: any[]) => {
    if (!contract || !method) {
      setState("ERROR");
      setError(new Error("Contract or method is not specified"));
      return;
    }
    resetState();
    const contractMethod = contract.functions[method as string];
    const deferredTx = contractMethod(...params);
    setState("INITIALIZED");
    try {
      const response = await deferredTx;
      setState("CONFIRMED");
      setValue(response);
    } catch (e) {
      setError(e);
      setState("ERROR");
    }
  }) as T["functions"][S];

  const transactionHash = transaction?.hash;
  const events = receipt?.events;
  const errorMessage = error?.message;

  const send = useCallback(sendFn, [contract, method]);
  const call = useCallback(callFn, [contract, method]);
  const reset = useCallback(resetState, [contract, method]);

  return {
    state,
    call,
    events,
    send,
    receipt,
    transaction,
    transactionHash,
    errorMessage,
    error,
    value,
    reset,
  };
}

import { Web3Provider } from "@ethersproject/providers";
import { useEffect, useState } from "react";
import {
  getSoulsContract,
  getWizardsContract,
} from "../contracts/ForgottenRunesWizardsCultContract";
import { BigNumber } from "ethers";

const useMyNfts = (provider: Web3Provider) => {
  const [myWizards, setMyWizards] = useState<BigNumber[]>();
  const [wizardsContract, setWizardsContract] = useState<string>();

  const [mySouls, setMySouls] = useState<BigNumber[]>();
  const [soulsContract, setSoulsContract] = useState<string>();

  useEffect(() => {
    if (!provider) return;

    async function run() {
      if (!provider) return;
      const address = await provider.getSigner().getAddress();

      //TODO: Promise.all(..)
      const wizardsContract = await getWizardsContract({ provider });
      setWizardsContract(wizardsContract.address);
      setMyWizards(await wizardsContract.tokensOfOwner(address));

      const soulsContract = await getSoulsContract({ provider });
      setSoulsContract(soulsContract.address);
      setMySouls(await soulsContract.tokensOfOwner(address));
    }

    run();
  }, [provider]);

  return { wizardsContract, myWizards, soulsContract, mySouls };
};

export default useMyNfts;

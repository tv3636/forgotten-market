import { Web3Provider } from "@ethersproject/providers";
import { useEffect, useState } from "react";
import { getMyNfts } from "../contracts/ForgottenRunesWizardsCultContract";

const useMyNfts = (provider: Web3Provider) => {
  const [myNfts, setMyNfts] = useState<{ [key: string]: any[] }>();

  useEffect(() => {
    if (!provider) return;

    async function run() {
      const nfts = await getMyNfts(provider);
      setMyNfts(nfts);
    }

    run();
  }, [provider]);

  return myNfts;
};

export default useMyNfts;

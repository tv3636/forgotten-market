import { Web3Provider } from "@ethersproject/providers";
import { useEffect, useState } from "react";
import {
  getSoulsContract,
  getWizardsContract,
} from "../contracts/ForgottenRunesWizardsCultContract";
import { BigNumber } from "ethers";
import { httpifyUrl } from "../lib/nftUtilis";

export const useFetchDataFromTokenUri = (tokenUri: string, tokenId: number) => {
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState<{ [key: string]: any }>();
  const [image, setImage] = useState<string>();

  useEffect(() => {
    if (!tokenUri || !tokenId) return;

    async function fetchMetadata() {
      const httpTokenURI = await httpifyUrl(tokenUri, tokenId.toString());

      const response = await fetch(httpTokenURI);
      const metadata: any = await response.json();

      setMetadata(metadata);

      if (response.status === 404) {
        setLoading(false);
        throw new Error(`Can't find tokenURI for ${httpTokenURI}`);
      }

      if (metadata.image) {
        setImage(await httpifyUrl(metadata.image, tokenId.toString()));
      }

      setLoading(false);
    }

    fetchMetadata();
  }, [tokenUri, tokenId]);

  return { loading, metadata, image };
};

export const useMyNfts = (provider: Web3Provider) => {
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

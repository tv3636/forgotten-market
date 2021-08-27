import * as React from "react";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import useProvider, { getProvider } from "../hooks/useProvider";
import { getERC721Contract } from "../contracts/ERC721Contract";
import Image from "next/image";
import { ethers } from "ethers";

// move to lib/nftUtils.ts
export async function httpifyUrl(url: string, tokenId: string) {
  url = url.replace(/0x\{id\}/, tokenId); // OpenSea
  if (url.match(/^http/)) {
    return url;
  } else if (url.match(/^ipfs/)) {
    return url.replace(/^ipfs:\/\//, "https://cloudflare-ipfs.com/");
  } else {
    return url;
  }
}

const storefrontABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "uri",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];

const erc721MetadataCache: { [key: string]: any } = {};
export async function fetchERC721TokenMetadataCached({
  contractAddress,
  tokenId,
  provider
}: {
  contractAddress: string;
  tokenId: string;
  provider: any;
}) {
  //
  const cacheKey = `${contractAddress}:::${tokenId}`;
  if (erc721MetadataCache[cacheKey]) {
    return erc721MetadataCache[cacheKey];
  }
  const promise = fetchERC721TokenMetadata({
    contractAddress,
    tokenId,
    provider
  });

  promise.catch((err) => {
    console.log("err: ", err);
    delete erc721MetadataCache[cacheKey];
  });

  return (erc721MetadataCache[cacheKey] = promise);
}

export async function fetchERC721TokenMetadata({
  contractAddress,
  tokenId,
  provider
}: {
  contractAddress: string;
  tokenId: string;
  provider: any;
}) {
  let tokenURI = null;
  // const cacheKey = `${contractAddress}:::${tokenId}`;
  // if (
  //   erc721MetadataCache[cacheKey] &&
  //   erc721MetadataCache[cacheKey][0] &&
  //   erc721MetadataCache[cacheKey][1]
  // ) {
  //   return erc721MetadataCache[cacheKey];
  // }

  // try fetching regular ERC721, but if it doesn't work, then try OpenSea's weird-ass way directly
  try {
    const contract = getERC721Contract({ contractAddress, provider });
    tokenURI = await contract.tokenURI(tokenId);
  } catch (err) {
    const contract = new ethers.Contract(
      contractAddress,
      storefrontABI,
      provider
    );
    tokenURI = await contract.uri(tokenId);
    if (!tokenURI) {
      throw err;
    }
  }
  const httpTokenURI = await httpifyUrl(tokenURI, tokenId);
  const response = await fetch(httpTokenURI);
  const metadata: any = await response.json();

  if (response.status === 404) {
    throw new Error(`Can't find tokenURI for ${httpTokenURI}`);
  }

  let image = null;
  if (metadata.image) {
    image = await httpifyUrl(metadata.image, tokenId);
  }

  // erc721MetadataCache[cacheKey] = [metadata, image];
  return [metadata, image];
}

type Props = {
  contractAddress: string;
  tokenId: string;
  pixelArt?: boolean;
};

const NFTDisplayElement = styled.div``;

export const ResponsiveMaybePixelImg = styled.img<{ pixelArt?: boolean }>`
  width: 100%;
  height: auto;
  image-rendering: ${(props) => (props.pixelArt ? "pixelated" : "auto")};
  border-radius: 3px;
  overflow: hidden;
`;

const LoadingElement = styled.div`
  color: rgba(255, 255, 255, 0.5);
  margin: 1em 0em;
`;

const ErrorMessage = styled.div`
  color: red;
`;

type ResolvedNFTData = {
  metadata?: any;
  image?: string;
};

export function useNFTInfo({
  contractAddress,
  tokenId
}: {
  contractAddress?: string | null;
  tokenId?: string | null;
}): {
  loading: boolean;
  nftData: ResolvedNFTData;
  error: string | null;
} {
  const [loading, setLoading] = useState(false);
  const [nftData, setNftData] = useState<ResolvedNFTData>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      setLoading(true);
      if (!contractAddress) {
        return;
      }
      if (tokenId == null || tokenId == undefined) {
        return;
      }
      console.log("fetching data", contractAddress, tokenId);

      try {
        const provider = getProvider();
        const [metadata, image] = await fetchERC721TokenMetadataCached({
          contractAddress,
          tokenId,
          provider
        });
        setNftData({ metadata, image });
        setError(null);
      } catch (err) {
        console.log("err: ", err);
        setError(err.message);
      }
      setLoading(false);
    }

    run();
  }, [contractAddress, tokenId]);

  return { loading, nftData, error };
}

export default function NFTDisplay({
  contractAddress,
  tokenId,
  pixelArt
}: Props) {
  // TODO this needs some caching as it's being called way way too often.
  const { loading, nftData, error } = useNFTInfo({ contractAddress, tokenId });

  return (
    <NFTDisplayElement>
      {loading && <LoadingElement>Loading... {contractAddress}</LoadingElement>}
      {nftData.image && (
        <ResponsiveMaybePixelImg
          src={nftData.image}
          alt={nftData?.metadata?.name}
          pixelArt={pixelArt}
        />
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </NFTDisplayElement>
  );
}

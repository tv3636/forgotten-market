import * as React from "react";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import useProvider from "../hooks/useProvider";
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

  let image = null;
  if (metadata.image) {
    image = await httpifyUrl(metadata.image, tokenId);
  }

  return [metadata, image];
}

type Props = {
  contractAddress: string;
  tokenId: string;
};

const NFTDisplayElement = styled.div``;

export const ResponsivePixelImg = styled.img`
  width: 100%;
  height: auto;
  image-rendering: pixelated;
  border-radius: 3px;
  overflow: hidden;
`;

const LoadingElement = styled.div`
  color: rgba(255, 255, 255, 0.5);
  margin: 1em 0em;
`;

type ResolvedNFTData = {
  metadata?: any;
  image?: string;
};

export default function NFTDisplay({ contractAddress, tokenId }: Props) {
  const provider = useProvider();
  const [loading, setLoading] = useState(false);
  const [nftData, setNftData] = useState<ResolvedNFTData>({});

  useEffect(() => {
    async function run() {
      setLoading(true);
      const [metadata, image] = await fetchERC721TokenMetadata({
        contractAddress,
        tokenId,
        provider
      });
      setNftData({ metadata, image });
      setLoading(false);
    }
    run();
  }, [contractAddress, tokenId]);

  // if you have a contractId and tokenId,
  // then fetch the erc721 contract (todo what about eip1155?)
  // then pull the tokenURI
  // then pull the IPFS stuff from cloudflare
  // the embed the image

  return (
    <NFTDisplayElement>
      {loading && <LoadingElement>Loading... {contractAddress}</LoadingElement>}
      {nftData.image && (
        <ResponsivePixelImg src={nftData.image} alt={nftData?.metadata?.name} />
      )}
    </NFTDisplayElement>
  );
}

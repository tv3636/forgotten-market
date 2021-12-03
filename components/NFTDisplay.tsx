import * as React from "react";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { getProvider } from "../hooks/useProvider";
import { getERC721Contract } from "../contracts/ERC721Contract";
import { ethers } from "ethers";
import { httpifyUrl } from "../lib/nftUtilis";
import { Flex, Text } from "rebass";
import { useFetchDataFromTokenUri } from "../hooks/useMyNfts";
import { SocialItem } from "./Lore/BookOfLoreControls";
import { ResponsivePixelImg } from "./ResponsivePixelImg";
import {
  WizardFrame,
  WizardImage,
  WizardImageContainer,
  WizardName,
} from "./WizardCard";
import truncateEthAddress from "truncate-eth-address";

const storefrontABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "uri",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const erc721MetadataCache: { [key: string]: any } = {};
export async function fetchERC721TokenMetadataCached({
  contractAddress,
  tokenId,
  provider,
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
    provider,
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
  provider,
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
  tokenId,
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
      if (tokenId == undefined) {
        return;
      }
      console.log("fetching data", contractAddress, tokenId);

      try {
        const provider = getProvider();
        const [metadata, image] = await fetchERC721TokenMetadataCached({
          contractAddress,
          tokenId,
          provider,
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
  pixelArt,
}: Props) {
  console.log(`${contractAddress} - ${tokenId}`);
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

const NFTGrid = styled.div`
  padding: 16px;
  display: grid;
  grid-auto-columns: 1fr 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 16px 16px;
`;

const NftItem = ({
  tokenId,
  tokenUri,
  collection,
}: {
  collection: string;
  tokenId: number;
  tokenUri: string;
}) => {
  const { loading, metadata, image } = useFetchDataFromTokenUri(
    tokenUri,
    tokenId
  );
  return (
    <Flex flexDirection={"column"} alignItems={"center"}>
      <WizardFrame className="wizardFrame">
        <WizardName>
          {loading && <Text color={"greay"}>Loading...</Text>}
          {!loading && (
            <h3>
              {metadata?.name} (#{tokenId})
            </h3>
          )}
        </WizardName>
        {!loading && (
          <WizardImageContainer>
            <WizardImage
              src={
                collection === "wizards"
                  ? `https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-${tokenId}.png`
                  : image
              }
            />
          </WizardImageContainer>
        )}
      </WizardFrame>
      <Flex flexDirection={"row"}>
        <SocialItem>
          <a
            href={`/scenes/gm/${tokenId}`}
            className="icon-link gm"
            target="_blank"
          >
            <ResponsivePixelImg
              src="/static/img/icons/gm.png"
              className="gm-img"
            />
          </a>
        </SocialItem>
        {collection === "wizards" && (
          <SocialItem>
            <a
              href={`/api/art/wizards/${tokenId}.zip`}
              className="icon-link"
              target="_blank"
            >
              <ResponsivePixelImg src="/static/img/icons/social_download_default_w.png" />
            </a>
          </SocialItem>
        )}
        <SocialItem>
          <a href={`/lore/wizards/${tokenId}/0`} className="icon-link">
            <ResponsivePixelImg src="/static/img/icons/social_link_default.png" />
          </a>
        </SocialItem>
      </Flex>
      {/*{error && <ErrorMessage>{error}</ErrorMessage>}*/}
    </Flex>
  );
};

export const HoldingsGrid = ({
  address,
  tokenData,
}: {
  address: string;
  tokenData: any;
}) => {
  return (
    <Flex p={4} flexDirection={"column"} alignItems={"center"}>
      <h2 style={{ color: "#fbff86" }}>
        Holdings of {truncateEthAddress(address)}
      </h2>
      <SocialItem></SocialItem>
      <h2>Wizards</h2>
      {tokenData.wizards.length === 0 && (
        <h3 style={{ textAlign: "center" }}>
          <i>No wizards found</i>
          <br />
          <br />
          ¯\_(ツ)_/¯
        </h3>
      )}
      <NFTGrid>
        {tokenData.wizards.map((item: any[]) => (
          <NftItem
            key={`wizards-${item[0]}`}
            collection={"wizards"}
            tokenId={item[0] as number}
            tokenUri={item[1] as string}
          />
        ))}
      </NFTGrid>
      <h2>Souls</h2>
      {tokenData.souls.length === 0 && (
        <h3 style={{ textAlign: "center" }}>
          <i>No souls found</i>
          <br />
          <br />
          ¯\_(ツ)_/¯
        </h3>
      )}
      <NFTGrid>
        {tokenData.souls.map((item: any[]) => (
          <NftItem
            key={`souls-${item[0]}`}
            collection={"souls"}
            tokenId={item[0] as number}
            tokenUri={item[1] as string}
          />
        ))}
      </NFTGrid>
    </Flex>
  );
};

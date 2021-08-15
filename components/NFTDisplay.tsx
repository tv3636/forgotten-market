import * as React from "react";
import { useState } from "react";
import styled from "@emotion/styled";

type Props = {
  contractId: string;
  tokenId: string;
};

const NFTDisplayElement = styled.div``;

export default function NFTDisplay({ contractId, tokenId }: Props) {
  // if you have a contractId and tokenId,
  // then fetch the erc721 contract (todo what about eip1155?)
  // then pull the tokenURI
  // then pull the IPFS stuff from cloudflare
  // the embed the image

  return (
    <NFTDisplayElement>
      Displaying: {contractId} {tokenId}
    </NFTDisplayElement>
  );
}

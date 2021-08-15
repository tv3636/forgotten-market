import * as React from "react";
import { useState } from "react";
import styled from "@emotion/styled";

type Props = {
  contractId: string;
  tokenId: string;
};

const NFTDisplayElement = styled.div``;

export default function NFTDisplay({ contractId, tokenId }: Props) {
  return (
    <NFTDisplayElement>
      Displaying: {contractId} {tokenId}
    </NFTDisplayElement>
  );
}

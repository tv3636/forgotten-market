import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { API_BASE_URL, Status } from "./marketplaceConstants";
import { useEthers } from "@usedapp/core";
import { acceptOffer } from "./marketplaceHelpers";

const chainId = Number(process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID);

const OverlayWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #00000085;
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: flex-start;

  transition-property: background-color;
  transition-duration: 2s;
`;

const Overlay = styled.div`
  width: 60vw;
  height: 60vh;
  background-color: var(--black); 

  border: dashed;
  border-radius: 15px;
  border-color: var(--mediumGray);

  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
`;

const Title = styled.div`
  margin: 10px;
  font-family: Alagard;
  font-size: 18px;
  color: var(--white);

  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
`;


export default function AcceptOffer({
  contract,
  tokenId,
  setModal,
}: {
  contract: string;
  tokenId: string;
  setModal: any;
}) {
  const { library, account } = useEthers();
  const signer = library?.getSigner();
  const [status, setStatus] = useState(Status.LOADING);

  const query: Parameters<typeof acceptOffer>[3] = {
    tokenId,
    contract,
    side: 'buy',
  };
  
  acceptOffer(API_BASE_URL, chainId, library, signer, query, setStatus);
  setModal(false);

  return (
    <OverlayWrapper>
      { Status.PROCESSING ? 
        <Overlay>
          <img src={"/static/img/marketplace/hourglass.gif"} height={250} width={250} />
          <Title style={{marginTop: "20px"}}>Transaction processing...</Title>
        </Overlay> : 
        <Overlay>
          <Title style={{marginTop: "20px"}}>Accepting offer for (#{tokenId})...</Title>
        </Overlay>
      }
    </OverlayWrapper>
  )
}

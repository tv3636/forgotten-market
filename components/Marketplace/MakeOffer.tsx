import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { API_BASE_URL, CONTRACTS, Status } from "./marketplaceConstants";
import { BigNumber, Signer, Contract, ContractTransaction, ethers, constants } from "ethers";
import { useEthers } from "@usedapp/core";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import InfoTooltip from "../../components/Marketplace/InfoToolTip";
import { Weth } from '@reservoir0x/sdk/dist/common/helpers'
import { calculateOffer, getWeth, makeOffer } from "./marketplaceHelpers";

const chainId = Number(process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID);

const OverlayWrapper = styled.div`
  position: absolute;
  width: 90vw;
  height: 90vh;
  background-color: #00000085;
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: flex-start;
`;

const Overlay = styled.div`
  width: 60vw;
  height: 60vh;

  max-width: 800px;
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

const TokenImage = styled.img`
  border: 2px dashed var(--darkGray);

  @media only screen and (max-width: 600px) {
    max-width: 200px;
    max-height: 200px;
  }
`;

const ListPrice = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;

  color: var(--white);
`;

const PriceInput = styled.input`
  background: var(--darkGray);
  border: dashed;
  padding: 10px;
  color: var(--lightGray);
  border-radius: 10px;
  border-color: var(--mediumGray);

  font-family: 'Roboto Mono';
  text-align: center;

  :hover {
    background: var(--mediumGray);
    border-color: var(--lightGray);
    color: var(--white);
  }

  :focus {
    background: var(--mediumGray);
    border-color: var(--lightGray);
    color: var(--white);
  }
`;

const Expiration = styled.div`
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

const Description = styled.div`
margin: 10px;
font-family: Alagard;
font-size: 18px;
color: var(--white);

display: flex;
justify-content: center;
align-content: center;
align-items: center;
`;

const ButtonImage = styled.img`
  margin-top: var(--sp3);
  height: var(--sp3);
  image-rendering: pixelated;

  :active {
    position: relative;
    top: 2px;
  }

  :hover {
    cursor: pointer;
  }
`;


export default function MakeOffer({
  contract,
  tokenId,
  name,
  setModal,
  isCollectionWide,
}: {
  contract: string;
  tokenId: string;
  name: string;
  setModal: any;
  isCollectionWide: boolean;
}) {
  const { library, account } = useEthers();
  const signer = library?.getSigner();
  const [offerPrice, setOfferPrice] = useState('');
  const [expiration, setExpiration] = useState(
    new Date(
      new Date().getFullYear(), 
      new Date().getMonth(), 
      new Date().getDate() + 7)
    
  );
  const [calculations, setCalculations] = useState<
    ReturnType<typeof calculateOffer>
  >({
    fee: constants.Zero,
    total: constants.Zero,
    missingEth: constants.Zero,
    missingWeth: constants.Zero,
    error: null,
    warning: null,
  })
  const [weth, setWeth] = useState<{
    weth: Weth
    balance: BigNumber
  } | null>(null)
  const [ethBalance, setEthBalance] = useState<any>(null);
  const [status, setStatus] = useState(Status.USER_INPUT);

  useEffect(() => {
    async function loadWeth() {
      if (signer) {
        var thisAddress = await signer?.getAddress();
        var balance = await library?.getBalance(thisAddress);
        setEthBalance(balance);
        const weth = await getWeth(chainId as 1 | 4, library, signer)
        if (weth) {
          setWeth(weth)
        }
      }
    }
    loadWeth()
  }, []);

  useEffect(() => {
    if (!isNaN(Number(offerPrice))) {
      const userInput = ethers.utils.parseEther(
        offerPrice === '' ? '0' : offerPrice
      )
      console.log(weth);
      console.log(ethBalance);
      if (weth?.balance && ethBalance) {
        const calculations = calculateOffer(
          userInput,
          ethBalance,
          weth.balance,
          250
        )
        setCalculations(calculations)
      }
    }
  }, [offerPrice])

  async function doOffer(event: any) {
    event.preventDefault();

    if (!offerPrice || isNaN(Number(offerPrice)) || Number(offerPrice) < 0) {
      console.log('invalid price'); 
      
      // TODO - error in UI
    } else {
      const maker = await signer?.getAddress();
      let query: Parameters<typeof makeOffer>[5] = {
        maker: maker ?? '',
        side: 'buy',
        price: calculations.total.toString(),
        fee: '250',
        feeRecipient: '0xd584fe736e5aad97c437c579e884d15b17a54a51',
        expirationTime: (Date.parse(expiration.toString()) / 1000).toString()
      }

      if (isCollectionWide) {
        query.collection = CONTRACTS[contract].collection
      } else {
        query.contract = contract
        query.tokenId = tokenId
      }

      console.log(query);
      console.log(calculations);
      await makeOffer(
        chainId, 
        library, 
        ethers.utils.parseEther(offerPrice), 
        API_BASE_URL, 
        signer, 
        query, 
        calculations.missingWeth, 
        setStatus
      )
    }
  }

  function clickOut(event: any) {
    console.log(event.target.id);
    if (event.target.id == 'wrapper') {
      setModal(false);
    }
  }

  return (
    <OverlayWrapper id="wrapper" onClick={(e) => clickOut(e)}>
      { Status.USER_INPUT ? 
      <Overlay id="modal">
        {isCollectionWide ? <Title style={{marginBottom: "40px"}}>Submitting a collection offer for {name}</Title> : 
          <Title style={{marginBottom: "40px"}}>Submitting an offer for {name} (#{tokenId})</Title>}
        {!isCollectionWide && <TokenImage src={CONTRACTS[contract].image_url + tokenId + ".png"} height={250} width={250} />}
          <ListPrice>
            <Title>Price</Title>
            <form onSubmit={(e) => { doOffer(e) }}>
              <PriceInput type="text" style={{marginBottom: '20px'}} value={offerPrice} onChange={(e)=> setOfferPrice(e.target.value)}></PriceInput>
            </form>
          </ListPrice>
          <Expiration>
            <Title>
              <div style={{marginRight: '10px', marginBottom: '5px'}}>Offer Expires</div>
              <InfoTooltip tooltip={'An offer can no longer be accepted after its expiration. To invalidate an offer before its expiration, you will need to manually cancel the offer.'}/>
            </Title>
            <Flatpickr
              data-enable-time
              value={expiration}
              onChange={([date]) => {
                setExpiration(date);
              }}
              options={{
                "disable": [
                  function(date) {
                    return date < new Date();
                  }
                ]
            }}
            />
          </Expiration>
          <ButtonImage
          src={"/static/img/marketplace/offer.png"}
          onMouseOver={(e) =>
            (e.currentTarget.src = "/static/img/marketplace/offer_hover.png")
          }
          onMouseOut={(e) =>
            (e.currentTarget.src = "/static/img/marketplace/offer.png")
          }
          onClick={(e) => { doOffer(e) }}
        />
      </Overlay> : Status.WRAPPING ?
      <Overlay>
        <img src={"/static/img/marketplace/hourglass.gif"} height={250} width={250} />
        <Title style={{marginBottom: "40px"}}>Wrapping ETH to make offer...</Title>
      </Overlay> :
      <Overlay>
      <Title style={{marginBottom: "40px"}}>Wrap ETH to proceed with offer</Title>
    </Overlay>
    }
    </OverlayWrapper>
  )
}

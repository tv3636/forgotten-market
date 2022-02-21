import styled from '@emotion/styled';
import { Weth } from '@reservoir0x/sdk/dist/common/helpers';
import { useEthers } from '@usedapp/core';
import { BigNumber, constants, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { API_BASE_URL, CONTRACTS, OrderPaths, OrderURLs, ORDER_TYPE, Status } from './marketplaceConstants';
import executeSteps, { 
  calculateOffer, 
  getWeth, 
} from './marketplaceHelpers';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import InfoTooltip from "../../components/Marketplace/InfoToolTip";
import MarketConnect from "../../components/Marketplace/MarketConnect";
import setParams from '../../lib/params';

const chainId = Number(process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID);
const fee = process.env.NEXT_PUBLIC_REACT_APP_FEE ?? '0';
const feeRecipient = process.env.NEXT_PUBLIC_REACT_APP_FEE_RECIPIENT ?? '0x6EAb2d42FEf9aad0036Bc145b5F451799e3FB3F7';

const OverlayWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #00000085;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: flex-start;

  transition-property: background-color;
  transition-duration: 2s;
`;

const Overlay = styled.div`
  width: 60vw;
  max-width: 1000px;
  height: auto;
  min-height: 500px;
  padding: 40px;
  background-color: var(--black);

  border: dashed;
  border-radius: 15px;
  border-color: var(--mediumGray);

  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: 600px) {
    width: 90vw;
  }
`;

const Section = styled.div`
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

const Title = styled.div`
  margin: 10px;
  font-family: Alagard;
  font-size: 18px;
  color: var(--white);

  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  text-align: center;

  @media only screen and (max-width: 600px) {
    font-size: 15px;
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

  transition: all 100ms;
`;

const Expiration = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
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
  text-align: center;
`;

const ButtonImage = styled.img`
  margin-top: var(--sp3);
  height: var(--sp3);
  image-rendering: pixelated;
  height: 35px;

  :active {
    position: relative;
    top: 2px;
  }

  :hover {
    cursor: pointer;
  }
`;

const IconImage = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 5px;

  @media only screen and (max-width: 600px) {
    width: 15px;
    height: 15px;
  }

  :hover {
    opacity: 0.7;
    cursor: pointer;
  }

  transition: all 100ms;
`;

function TransactionProcessing({ hash }: { hash: string }) {
  return (
    <a href={`https://etherscan.io/tx/${hash}`} target='_blank' style={{textDecoration: 'none', color: 'var(--white)'}}>
      <Title style={{marginTop: "20px"}}>
        View transaction on Etherscan
        <IconImage src="/static/img/marketplace/share.png"/>
      </Title>
    </a>
  )
}

function Approval({ 
  txn,
  title,
  description,
}: { 
  txn: string | null;
  title: string;
  description: string;
}) {
  return (
    <Overlay>
      <img src={"/static/img/marketplace/hourglass.gif"} height={250} width={250} />
      <Title>{title}</Title>
      <Description>{description}</Description>
      { txn && <TransactionProcessing hash={txn}/> }
    </Overlay>
  )
}

export default function Order({
  action,
  contract,
  tokenId,
  name,
  hash,
  offerHash,
  setModal,
  collectionWide
}: {
  action: ORDER_TYPE;
  contract: string;
  tokenId: string;
  name: string;
  hash: string | null;
  offerHash: string | null;
  setModal: (modal: boolean) => void;
  collectionWide: boolean;
}) {
  const { library, account } = useEthers();
  const signer = library?.getSigner();
  const [status, setStatus] = useState<Status>(Status.LOADING);
  const [txn, setTxn] = useState('');
  const [price, setPrice] = useState('');
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
  const url = new URL(OrderURLs[action], API_BASE_URL);

  if (chainId != library?.network.chainId) {
    if (library?.network.chainId) {
      return (
        <OverlayWrapper id="wrapper" onClick={(e) => clickOut(e)}>
        <Overlay>
          <Title>Wrong Network - Please connect to Mainnet to continue</Title>
        </Overlay>
      </OverlayWrapper>
      )
    } else {
      return (
        <OverlayWrapper id="wrapper" onClick={(e) => clickOut(e)}>
          <Overlay>
            <MarketConnect/>
          </Overlay>
        </OverlayWrapper>
      )
    }
  }

  async function execute(
    url: URL, 
    signer: any,
  ) {
    await executeSteps(url, signer, setTxn, setStatus, (execute: any) => {
      console.log(execute);
      if (execute) {
        for (var step of execute) {
          if (step.status == 'incomplete') {
            console.log(step);

            switch(step.action) {
              case 'Wrapping ETH':
                setStatus(Status.WRAPPING);
                setTxn('');
                break;

              case 'Signing order':
                setStatus(Status.USER_INPUT);
                break;

              case 'Relaying order':
              case 'Authorize offer':
              case 'Submit listing':
                setStatus(Status.SIGNING);
                break;

              case 'Approving WETH':
              case 'Approve WETH contract':
                setStatus(Status.APPROVING_WETH);
                setTxn('');
                break;
              
              case 'Approving token':
              case 'Approve NFT contract':
                setStatus(Status.APPROVING_TOKEN);
                setTxn('');
                break;

              case 'Proxy registration':
              case 'Initialize wallet':
                setStatus(Status.PROXY_APPROVAL);
                setTxn('');
                break;

              case 'Accept offer':
                setStatus(Status.PROCESSING);
                setTxn('');
                break;
            }

            break;
          } else {
            if (step.action == 'Confirmation') {
              setStatus(Status.SUCCESS);
              setTxn('');
              break;
            }
          }
        }
      }
    });
  }

  async function run() {
    let query: OrderPaths[typeof action];

    switch(action) {
      case ORDER_TYPE.BUY:
        query = {
          contract,
          tokenId,
          taker: await signer?.getAddress() ?? '',
        }
        setParams(url, query);
        await execute(url, signer);

        setModal(false);
        break;

      case ORDER_TYPE.SELL:
        setStatus(Status.USER_INPUT);
        break;

      case ORDER_TYPE.OFFER:
        setStatus(Status.USER_INPUT);
        break;

      case ORDER_TYPE.ACCEPT_OFFER:
         query = {
          tokenId,
          contract,
          taker: await signer?.getAddress() ?? '',
        }

        setParams(url, query);
        await execute(url, signer);

        setModal(false);
        break;

      case ORDER_TYPE.CANCEL_LISTING:
        query = {
          hash: hash ?? '',
          maker: account ?? '',
        }
        setParams(url, query);
        await execute(url, signer);

        setModal(false);
        break;

      case ORDER_TYPE.CANCEL_OFFER:
        query = {
          hash: offerHash ?? '',
          maker: account ?? '',
        }
        setParams(url, query);
        await execute(url, signer);

        setModal(false);
        break;
    }
  }

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

    if (action == ORDER_TYPE.OFFER) {
      loadWeth()
    } 

    run();
  }, []);

  useEffect(() => {
    if (!isNaN(Number(price))) {
      const userInput = ethers.utils.parseEther(
        price === '' ? '0' : price
      )

      if (weth?.balance && ethBalance) {
        const calculations = calculateOffer(userInput, ethBalance, weth.balance, Number(CONTRACTS[contract].fee));
        setCalculations(calculations)
      }
    }
  }, [price]);

  // Kick off listing for sale or making offer
  //
  async function submitAction(event: any) {
    event.preventDefault();
    if (!price || isNaN(Number(price)) || Number(price) < 0) {
      console.log('invalid price'); 
      // TODO - error in UI
    } else {
      // TODO - add fee/fee recipient
      let query: any = {
        maker: account ?? '',
        price: action == ORDER_TYPE.SELL ? 
          ethers.utils.parseEther(price).toString() :
          calculations.total.toString(),
        expirationTime: (Date.parse(expiration.toString()) / 1000).toString(),
        disableRoyalties: true,
        fee: CONTRACTS[contract].fee,
        feeRecipient: CONTRACTS[contract].feeRecipient
      }

      if (collectionWide) {
        query.collection = CONTRACTS[contract].collection
      } else {
        query.contract = contract
        query.tokenId = tokenId
      }

      setParams(url, query);
      await execute(url, signer);
      
      setModal(false);
    }
  }

  function clickOut(event: any) {
    if (event.target.id == 'wrapper') {
      setModal(false);
    }
  }

  var imageUrl = CONTRACTS[contract].display == 'Wizards' ? 
    CONTRACTS[contract].image_url + tokenId + '/' + tokenId + '.png' : 
    CONTRACTS[contract].image_url + tokenId + ".png";

  if (status == Status.APPROVING_TOKEN) {
    return (
      <OverlayWrapper id="wrapper" onClick={(e) => clickOut(e)}>
        <Approval 
          txn={txn} 
          title={'Setting approval...'} 
          description={'This is a required one-time approval to allow trading tokens from this contract'}
        />
      </OverlayWrapper>
    )
  }

  if (status == Status.PROXY_APPROVAL) {
    return (
      <OverlayWrapper id="wrapper" onClick={(e) => clickOut(e)}>
        <Approval 
          txn={txn} 
          title={'Registering proxy...'} 
          description={'This is a required one-time registration to enable this address to trade tokens'}
        />
      </OverlayWrapper>
    )
  }

  if (status == Status.APPROVING_WETH) {
    return (
      <OverlayWrapper id="wrapper" onClick={(e) => clickOut(e)}>
        <Approval 
          txn={txn} 
          title={'Approve WETH to continue with offer...'} 
          description={'A one-time approval is needed to enable making WETH offers'}
        />
      </OverlayWrapper>
    )
  }

  if (status == Status.USER_INPUT || (status == Status.LOADING && (action == ORDER_TYPE.OFFER || action == ORDER_TYPE.SELL))) {
    return (
      <OverlayWrapper id="wrapper" onClick={(e) => clickOut(e)}>
        <Overlay id="modal">
          { collectionWide && 
            <img 
              src={`/static/img/marketplace/${CONTRACTS[contract].display.toLowerCase()}-banner.png`} 
              width={'100%'} 
              height={'20%'}
              style={{marginBottom: '40px'}}
            />
          }
          { collectionWide ? 
            <Title style={{marginBottom: "40px", fontSize: "24px"}}>Submitting a collection offer for {name}</Title> : 
            <Title style={{marginBottom: "40px", fontSize: "24px"}}>
              { action == ORDER_TYPE.OFFER ? 
                `Submitting an offer for ${name} (#${tokenId})` :
                `Listing ${name} (#${tokenId}) for sale`
              }
            </Title>
          }
          { !collectionWide && <TokenImage src={imageUrl} height={250} width={250} /> }
          <ListPrice>
            <Title style={{marginTop: "35px"}}>Price</Title>
            <form onSubmit={(e) => { submitAction(e) }}>
              <PriceInput type="number" style={{marginBottom: '20px'}} value={price} onChange={(e)=> setPrice(e.target.value)}></PriceInput>
            </form>
          </ListPrice>
          <Expiration>
            <Title>
              <div style={{marginRight: '10px', marginBottom: '5px'}}>Offer Expires</div>
              <InfoTooltip 
                tooltip={
                  action == ORDER_TYPE.OFFER ?
                  'An offer can no longer be accepted after its expiration. To invalidate an offer before its expiration, you will need to manually cancel the offer.' :
                  'A listing can no longer be filled after its expiration. Invalidating a listing before its expiration requires manual cancellation'
                }
              />
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
            src={`/static/img/marketplace/${ action == ORDER_TYPE.OFFER ? 'offer' : 'sell' }.png`}
            onMouseOver={(e) =>
              (e.currentTarget.src = `/static/img/marketplace/${ action == ORDER_TYPE.OFFER ? 'offer' : 'sell' }_hover.png`)
            }
            onMouseOut={(e) =>
              (e.currentTarget.src = `/static/img/marketplace/${ action == ORDER_TYPE.OFFER ? 'offer' : 'sell' }.png`)
            }
            onClick={(e) => { submitAction(e) }}
          /> 
        </Overlay> 
      </OverlayWrapper>
    )
  }

  if (action == ORDER_TYPE.BUY) {
    return (
      <OverlayWrapper id="wrapper" onClick={(e) => clickOut(e)}>
      <Overlay>
        { status == Status.LOADING ?
        <Section>
          { txn ? 
            <img src={"/static/img/marketplace/hourglass.gif"} height={250} width={250} /> : 
            <TokenImage src={imageUrl} height={250} width={250} /> 
          }
        { txn ? 
          <Title style={{marginTop: "20px"}}>Transaction processing...</Title> : 
          <Title style={{marginTop: "20px"}}>Purchasing {name} (#{tokenId})...</Title>
        }
        { txn && <TransactionProcessing hash={txn}/> }
      </Section>
         : status == Status.SUCCESS ? 
        <Section>
          <img src={"/static/img/marketplace/magicdust.gif"} height={250} width={250} />
          <Title style={{marginTop: "20px"}}>{name} (#{tokenId})</Title>
          <Title style={{marginTop: "20px"}}>Purchase successful!</Title>
        </Section> : 
        <Section>
          <Title style={{marginTop: "20px"}}>Failed to purchase. Please ensure you have sufficient funds</Title>
        </Section> 
        }
      </Overlay> 
    </OverlayWrapper>
    );
  }

  if (action == ORDER_TYPE.SELL) {
    return (
    <OverlayWrapper id="wrapper" onClick={(e) => clickOut(e)}>
      <Overlay>
        <img src={"/static/img/marketplace/loading_card.gif"} height={250} width={250} />
        { status == Status.SIGNING && 
          <Title style={{marginTop: "20px"}}>Submitting listing for {price}...</Title>
        }
      </Overlay>
    </OverlayWrapper>
    );
  }

  if (action == ORDER_TYPE.OFFER) {
    return (
      <OverlayWrapper id="wrapper" onClick={(e) => clickOut(e)}>
        { status == Status.WRAPPING ?
        <Overlay>
          <img src={"/static/img/marketplace/hourglass.gif"} height={250} width={250} />
          <Title style={{marginBottom: "40px"}}>Wrapping ETH to make offer...</Title>
          { txn && <TransactionProcessing hash={txn}/> }
        </Overlay> 
        :
        <Overlay>
          <img src={"/static/img/marketplace/loading_card.gif"} height={250} width={250} />
          <Title style={{marginBottom: "40px"}}>Sign to submit {collectionWide ? 'collection' : null} offer for {price} WETH</Title>
        </Overlay>
    }
    </OverlayWrapper>
    );
  }

  if (action == ORDER_TYPE.ACCEPT_OFFER) {
    return (
    <OverlayWrapper id="wrapper" onClick={(e) => clickOut(e)}>
      <Overlay>
          <img src={"/static/img/marketplace/magicdust.gif"} height={250} width={250} />
          <Title style={{marginTop: "20px", fontSize: "24px"}}>Accepting offer for {name} (#{tokenId})...</Title>
          { txn && <TransactionProcessing hash={txn}/>}
      </Overlay> 
    </OverlayWrapper>
    );
  }

  if (action == ORDER_TYPE.CANCEL_LISTING || action == ORDER_TYPE.CANCEL_OFFER) {
    return ( 
    <OverlayWrapper id="wrapper" onClick={(e) => clickOut(e)}>
      <Overlay>
        <img src={"/static/img/marketplace/hourglass.gif"} height={250} width={250} />
        <Title>{ action == ORDER_TYPE.CANCEL_LISTING ? 'Canceling listing...' : 'Canceling offer...'}</Title>
        { txn && <TransactionProcessing hash={txn}/> }
      </Overlay>
    </OverlayWrapper>
    );
  }

  return null
}

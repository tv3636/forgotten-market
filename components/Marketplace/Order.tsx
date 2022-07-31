import styled from '@emotion/styled';
import { useEthers } from '@usedapp/core';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { API_BASE_URL, OrderPaths, OrderURLs, ORDER_TYPE } from './marketplaceConstants';
import { getContract } from './marketplaceHelpers';
import InfoTooltip from "../../components/Marketplace/InfoToolTip";
import MarketConnect from "../../components/Marketplace/MarketConnect";
import SetExpiration from './SetExpiration';
import setParams from '../../lib/params';
import SetPrice from './SetPrice';
import ActionHeader from './ActionHeader';
import GenericButton from './GenericButton';
import { Execute, executeSteps } from '@reservoir0x/client-sdk';

const chainId = Number(process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID);

const OverlayWrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #00000085;
  z-index: 20;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: flex-start;
  overflow: hidden;

  transition-property: background-color;
  transition-duration: 2s;
`;

const Overlay = styled.div`
  max-width: 1000px;
  width: 60vw;
  height: auto;
  min-height: 500px;
  max-height: 85vh;
  padding: var(--sp3) var(--sp4);
  margin-top: var(--sp4);
  background-color: var(--black);
  overflow: scroll;
  overflow-x: hidden;

  border-image-source: url(/static/img/moduleframe.png);
  border-image-slice: 30 35;
  border-image-width: var(--frameSize);
  border-style: solid;
  border-image-repeat: round;

  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;

  overflow: scroll;

  @media only screen and (max-width: 600px) {
    width: 90vw;
  }
`;

export const TokenImage = styled.img`
  border: 2px dashed var(--darkGray);

  @media only screen and (max-width: 600px) {
    max-width: 200px;
    max-height: 200px;
  }
`;

export const Title = styled.div`
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

const Form = styled.form`
  margin-top: 10px;
  margin-bottom: 25px;
  font-family: Alagard;
  color: var(--white);
  font-size: 17px;

  @media only screen and (max-width: 600px) {
    font-size: 15px;
  }

`;

const BannerImage = styled.img`
  width: 100%;
  height: 248px;
  margin-bottom: 40px;
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

function Animation({ name }: { name: string }) {
  return <img src={`/static/img/marketplace/${name}.gif`} height={250} width={250} />
}

function PriceExplained({
  action,
  amount,
  tooltip
}:{
  action: ORDER_TYPE;
  amount: string;
  tooltip: string;
}) {
  return (
    <Description style={{marginLeft: '12%', marginTop: '15px'}}>
      <div style={{marginRight: 'var(--sp-3)', fontSize: '15px'}}>
        {`You receive ${amount} ${action == ORDER_TYPE.ACCEPT_OFFER ? `WETH` : `ETH`}`}
      </div>
      <InfoTooltip tooltip={tooltip} />
    </Description>
  )
}

function OverlayContent({ 
  kind,
  tokenImage,
  showConfirmation,
  collectionWide,
  contract,
}: { 
  kind: 'transaction' | 'request' | 'signature' | 'confirmation';
  tokenImage: string;
  showConfirmation: boolean;
  collectionWide: boolean;
  contract: string;
}) {
  switch (kind) {
    case 'transaction':
      return <Animation name={'hourglass'} />

    case 'request':
      return <Animation name={'loading_card'} />

    case 'signature':
      if (collectionWide) {
        return <BannerImage src={`/static/img/marketplace/${getContract(contract).display.toLowerCase()}-banner.png`} />
      } else {
        return <TokenImage src={tokenImage} height={'auto'} width={250} />
      }

    case 'confirmation':
      return showConfirmation ? <Animation name={'magicdust'} />: <Animation name={'hourglass'} />
  }
}

function OrderContent({
  action,
  contract,
  tokenId,
  name,
  hash,
  offerHash,
  setModal,
  collectionWide,
  trait,
  traitValue,
  expectedPrice,
}: {
  action: ORDER_TYPE;
  contract: string;
  tokenId: string;
  name: string;
  hash: string;
  offerHash: string;
  setModal: (modal: boolean) => void;
  collectionWide: boolean;
  trait: string;
  traitValue: string;
  expectedPrice: number;
}) {
  const { library, account } = useEthers();
  const signer = library?.getSigner();
  const [step, setStep] = useState<any>(null);
  const [steps, setSteps] = useState<Execute['steps']>();
  const [txn, setTxn] = useState('');
  const [price, setPrice] = useState('');
  const [showError, setShowError] = useState<any>(null);
  const [listOS, setListOS] = useState(false);
  const [listLR, setListLR] = useState(false);
  const [expiration, setExpiration] = useState(
    new Date(
      new Date().getFullYear(), 
      new Date().getMonth(), 
      new Date().getDate() + 7)
  );

  const url = new URL(OrderURLs[action], API_BASE_URL);
  const contractDict = getContract(contract);

  if (chainId != library?.network.chainId) {
    if (library?.network.chainId) {
      return (
        <Overlay>
          <Title>Wrong Network - Please connect to Mainnet to continue</Title>
        </Overlay>
      )
    } else {
      return (
        <Overlay>
          <MarketConnect/>
        </Overlay>
      )
    }
  }

  async function execute(url: URL, signer: any, expectedPrice?: number) {
    try {
      await executeSteps(url, signer, setSteps, undefined, expectedPrice);
    } catch (e) {
      // Metamask rejection or other failure
      setModal(false);
    }
  }

  useEffect(() => { 
    console.log(steps);

    if (steps) {
      for (var step of steps) {
        if (step.status == 'incomplete') {

          setTxn('');
          setStep(step);
          break;
        } else {
          if (step == steps[steps.length - 1]) {
            setStep(step);
            break;
          }
        }
      }
    }
  }, [steps]);

  useEffect(() => {
    async function run() {
      let query: OrderPaths[typeof action];
  
      switch(action) {
        case ORDER_TYPE.BUY:
          query = {
            token: `${contract}:${tokenId}`,
            taker: await signer?.getAddress() ?? '',
          }
          setParams(url, query);
          await execute(url, signer, expectedPrice);
  
          setTimeout(() => {setModal(false)}, 2000);
          break;
  
        case ORDER_TYPE.ACCEPT_OFFER:
           query = {
            token: `${contract}:${tokenId}`,
            taker: await signer?.getAddress() ?? '',
          }
  
          setParams(url, query);
          await execute(url, signer, expectedPrice);
  
          setModal(false);
          break;
  
        case ORDER_TYPE.CANCEL_LISTING:
          query = {
            id: hash,
            maker: account ?? '',
          }
          setParams(url, query);
          await execute(url, signer);
  
          setModal(false);
          break;
  
        case ORDER_TYPE.CANCEL_OFFER:
          query = {
            id: offerHash,
            maker: account ?? '',
          }
          setParams(url, query);
          await execute(url, signer);
  
          setModal(false);
          break;
      }
    }

    run();
  }, []);

  // Kick off listing for sale or making offer
  //
  async function submitAction() {
    let query: any = {
      maker: account,
      weiPrice: ethers.utils.parseEther(price).toString(),
      expirationTime: (Date.parse(expiration.toString()) / 1000).toString(),
      automatedRoyalties: false,
      fee: contractDict.fee,
      feeRecipient: contractDict.feeRecipient,
      source: 'Forgotten Market',
      orderKind: 'seaport',
    }

    if (collectionWide) {
      query.collection = contract;
    } else {
      query.token = `${contract}:${tokenId}`;
    }

    if (trait) {
      query.attributeKey = trait;
      query.attributeValue = traitValue;
    }

    setParams(url, query);
    await execute(url, signer);

    if (listOS) {
      const os_url = new URL(OrderURLs[action], API_BASE_URL);
      let os_query: any = {
        token: `${contract}:${tokenId}`,
        maker: account,
        weiPrice: ethers.utils.parseEther(price).toString(),
        expirationTime: (Date.parse(expiration.toString()) / 1000).toString(),
        orderbook: 'opensea',
        orderKind: 'seaport',
      }
      
      setParams(os_url, os_query);
      await execute(os_url, signer);
    }

    if (listLR) {
      const lr_url = new URL(OrderURLs[action], API_BASE_URL);
      let lr_query: any = {
        token: `${contract}:${tokenId}`,
        maker: account,
        weiPrice: ethers.utils.parseEther(price).toString(),
        expirationTime: (Date.parse(expiration.toString()) / 1000).toString(),
        orderbook: 'looks-rare',
        orderKind: 'looks-rare'
      }
      
      setParams(lr_url, lr_query);
      await execute(lr_url, signer);
    }

    setModal(false);

  }

  // Replace some description messages, otherwise leave as is
  //
  function getDescription(action: string, description: string) {
    switch(action) {
      case 'Authorize listing':
        return `Listing ${name} for ${price} ETH`

      case 'Authorize offer':
        return `Offering ${price} WETH for ${name}`

      case 'Submit offer':
        return `Submitting offer to the order book`

      case 'Submit listing':
        return `Submitting listing to the order book`

      case 'Accept offer':
        return (
          <div>
            <div>{description}</div>
            <Description style={{marginTop: 'var(--sp2)'}}>
              <div style={{fontSize: '15px'}}>
                {`You receive ${expectedPrice} WETH after fees`}
              </div>
            </Description>          
          </div>
        )
    }

    return description
  }

  var imageUrl = contractDict.display == 'Wizards' ? 
    contractDict.image_url + tokenId + '/' + tokenId + '.png' : 
    contractDict.image_url + tokenId + ".png";

  if (!step) {
    if (action == ORDER_TYPE.OFFER || action == ORDER_TYPE.SELL) {
      return (
        <Overlay id="modal">
          <ActionHeader 
            collectionWide={collectionWide}
            contract={contract}
            tokenId={tokenId}
            name={name}
            imageUrl={imageUrl}
            action={action}
            trait={trait}
            traitValue={traitValue}
          />
          <SetPrice 
            price={price}
            setPrice={setPrice}
            submitAction={submitAction}
          />
          { action == ORDER_TYPE.SELL && 
            <PriceExplained 
              action={action}
              amount={(Number(price) - Number(price) * (Number(contractDict.fee) / 10000)).toString()}
              tooltip={'You will receive the amount shown here after fees are deducted.'}
            /> 
          }
          <SetExpiration
            action={action}
            expiration={expiration}
            setExpiration={setExpiration}
          />
          { action == ORDER_TYPE.SELL && 
            <Form>
              Post listing to OpenSea: <input type='checkbox' onClick={() => setListOS(!listOS)} /><br/><br/>
              Post listing to LooksRare: <input type='checkbox' onClick={() => setListLR(!listLR)} />
            </Form>
            
          }
          <GenericButton onClick={submitAction} text={'SUBMIT'}/>
        </Overlay> 
      )
    } else {
      return (
        <Overlay>
          <Animation name={'loading_card'} />
          { showError && <Description>{showError}</Description> }
        </Overlay>
      )
    }
  }

  return (
    <Overlay>
      <OverlayContent 
        kind={step.kind} 
        tokenImage={imageUrl} 
        showConfirmation={action == ORDER_TYPE.BUY}
        collectionWide={collectionWide}
        contract={contract}
      />
      <Title>{step.action}</Title>
      <Description>
        {getDescription(step.action, step.description)}
      </Description>
      { txn && <TransactionProcessing hash={txn}/> }
    </Overlay>
  )
}

interface OrderProps {
  action: ORDER_TYPE;
  contract: string;
  tokenId: string;
  name: string;
  hash: string;
  offerHash: string;
  setModal: (modal: boolean) => void;
  collectionWide: boolean;
  trait: string;
  traitValue: string;
  expectedPrice: number;
}

export default function Order(props: OrderProps) {

  function clickOut(event: any) {
    if (event.target.id == 'wrapper') {
      props.setModal(false);
    }
  }

  return (
    <OverlayWrapper id="wrapper" onClick={(e) => clickOut(e)}>
      <OrderContent { ... props}/>
    </OverlayWrapper>
  )
}

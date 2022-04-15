import styled from '@emotion/styled';
import { Weth } from '@reservoir0x/sdk/dist/common/helpers';
import { useEthers } from '@usedapp/core';
import { BigNumber, constants, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { API_BASE_URL, CONTRACTS, OrderPaths, OrderURLs, ORDER_TYPE } from './marketplaceConstants';
import executeSteps, { 
  calculateOffer, 
  getWeth,
} from './marketplaceHelpers';
import InfoTooltip from "../../components/Marketplace/InfoToolTip";
import MarketConnect from "../../components/Marketplace/MarketConnect";
import SetExpiration from './SetExpiration';
import setParams from '../../lib/params';
import SetPrice from './SetPrice';
import ActionHeader from './ActionHeader';

const chainId = Number(process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID);

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

const ButtonImage = styled.img`
  margin-top: var(--sp-1);
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

function ActionButton({ 
  actionType,
  submitAction
}: { 
  actionType: ORDER_TYPE;
  submitAction: any;
}) {
  return (
    <ButtonImage
      src={`/static/img/marketplace/${ actionType == ORDER_TYPE.OFFER ? 'offer' : 'sell' }.png`}
      onMouseOver={(e) =>
        (e.currentTarget.src = `/static/img/marketplace/${ actionType == ORDER_TYPE.OFFER ? 'offer' : 'sell' }_hover.png`)
      }
      onMouseOut={(e) =>
        (e.currentTarget.src = `/static/img/marketplace/${ actionType == ORDER_TYPE.OFFER ? 'offer' : 'sell' }.png`)
      }
      onClick={(e) => { submitAction(e) }}
    /> 
  )
}

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
    <Description style={{marginBottom: 'var(--sp1)', marginLeft: '12%', marginTop: '15px'}}>
      <div style={{marginRight: 'var(--sp-3)', fontSize: '15px'}}>
        {`You ${action == ORDER_TYPE.OFFER ? 
          `pay ${amount} WETH` : 
          `receive ${amount} ETH`}`
        }
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
}: { 
  kind: 'transaction' | 'request' | 'signature' | 'confirmation';
  tokenImage: string;
  showConfirmation: boolean;
  collectionWide: boolean;
}) {
  switch (kind) {
    case 'transaction':
      return <Animation name={'hourglass'} />

    case 'request':
      return <Animation name={'loading_card'} />

    case 'signature':
      if (collectionWide) {
        return null
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
}: {
  action: ORDER_TYPE;
  contract: string;
  tokenId: string;
  name: string;
  hash: string;
  offerHash: string;
  setModal: (modal: boolean) => void;
  collectionWide: boolean;
}) {
  const { library, account } = useEthers();
  const signer = library?.getSigner();
  const [step, setStep] = useState<any>(null);
  const [txn, setTxn] = useState('');
  const [price, setPrice] = useState('');
  const [showError, setShowError] = useState<any>(null);
  const [listOS, setListOS] = useState(false);
  const [expiration, setExpiration] = useState(
    new Date(
      new Date().getFullYear(), 
      new Date().getMonth(), 
      new Date().getDate() + 7)
  );
  const [calculations, setCalculations] = useState<ReturnType<typeof calculateOffer>>({
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

  async function execute(
    url: URL, 
    signer: any,
  ) {
    await executeSteps(url, signer, setTxn, setShowError, (execute: any) => {
      if (execute) {
        for (var step of execute) {
          if (step.status == 'incomplete') {

            setTxn('');
            setStep(step);
            break;

          } else {
            if (step == execute[execute.length - 1]) {
              setStep(step);
              break;
            }
          }
        }
      } 
    });
  }

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
          await execute(url, signer);
  
          setTimeout(() => {setModal(false)}, 2000);
          break;
  
        case ORDER_TYPE.ACCEPT_OFFER:
           query = {
            token: `${contract}:${tokenId}`,
            taker: await signer?.getAddress() ?? '',
          }
  
          setParams(url, query);
          await execute(url, signer);
  
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
    
    let query: any = {
      maker: account,
      weiPrice: action == ORDER_TYPE.SELL ? 
        ethers.utils.parseEther(price).toString() :
        calculations.total.toString(),
      expirationTime: (Date.parse(expiration.toString()) / 1000).toString(),
      automatedRoyalties: false,
      fee: CONTRACTS[contract].fee,
      feeRecipient: CONTRACTS[contract].feeRecipient,
    }

    if (collectionWide) {
      query.collection = contract;
    } else {
      query.token = `${contract}:${tokenId}`;
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
      }
      setParams(os_url, os_query);
      console.log(os_url);

      await execute(os_url, signer);
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
        return `Offering ${ethers.utils.formatEther(calculations.total)} WETH for ${name}`

      case 'Submit offer':
        return `Submitting offer to the order book`

      case 'Submit listing':
        return `Submitting listing to the order book`

      case 'Confirmation':
        return `Purchase successful!`
    }

    return description
  }

  var imageUrl = CONTRACTS[contract].display == 'Wizards' ? 
    CONTRACTS[contract].image_url + tokenId + '/' + tokenId + '.png' : 
    CONTRACTS[contract].image_url + tokenId + ".png";

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
          />
          
          <SetPrice 
            price={price}
            setPrice={setPrice}
            submitAction={submitAction}
          />
          <PriceExplained 
            action={action}
            amount={
              action == ORDER_TYPE.OFFER ?
                ethers.utils.formatEther(calculations.total) :
                (Number(price) - Number(price) * (Number(CONTRACTS[contract].fee) / 10000)).toString()
            }
            tooltip={
              action == ORDER_TYPE.OFFER ?
              'Offers are made to include fees. When an offer is accepted, the fees will be subtracted and the seller will receive the remaining value.' :
              'You will receive the amount shown here after fees are deducted.'
            }
          />
          <SetExpiration
            action={action}
            expiration={expiration}
            setExpiration={setExpiration}
          />
          { action == ORDER_TYPE.SELL && 
            <Form>
              Cross-post listing to OpenSea: <input type='checkbox' onClick={() => setListOS(!listOS)} />
            </Form>
          }
          <ActionButton actionType={action} submitAction={submitAction} />
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

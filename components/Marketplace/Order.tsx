import styled from '@emotion/styled';
import { Weth } from '@reservoir0x/sdk/dist/common/helpers';
import { useEthers } from '@usedapp/core';
import { BigNumber, constants, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { API_BASE_URL, CONTRACTS, OrderPaths, OrderType, Status } from './marketplaceConstants';
import { 
  acceptOffer, 
  calculateOffer, 
  cancelOrder, 
  canSend, 
  getProxy, 
  getWeth, 
  instantBuy, 
  listTokenForSell, 
  makeOffer 
} from './marketplaceHelpers';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import InfoTooltip from "../../components/Marketplace/InfoToolTip";
import MarketConnect from "../../components/Marketplace/MarketConnect";

const chainId = Number(process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID);
const fee = process.env.NEXT_PUBLIC_REACT_APP_FEE ?? '250';
const feeRecipient = process.env.NEXT_PUBLIC_REACT_APP_FEE_RECIPIENT ?? '0xd584fe736e5aad97c437c579e884d15b17a54a51';

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
  height: 60vh;
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

export default function Order({
  action,
  contract,
  tokenId,
  name,
  setModal,
  collectionWide
}: {
  action: OrderType;
  contract: string;
  tokenId: string;
  name: string;
  setModal: (modal: boolean) => void;
  collectionWide: boolean;
}) {
  const { library, account } = useEthers();
  const signer = library?.getSigner();
  const [status, setStatus] = useState<Status>(Status.LOADING);
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

  async function run() {
    let query: OrderPaths[typeof action];

    switch(action) {
      case OrderType.BUY:
        query = {
          contract,
          tokenId,
          side: 'sell',
        };

        await instantBuy(API_BASE_URL, chainId, signer, query, setStatus)
        setTimeout(
          () => setModal(false),
          5000
        );
        
        break;

      case OrderType.SELL:
        const wizContract = new ethers.Contract(contract, CONTRACTS[contract].ABI, library);
        const owner = await wizContract.ownerOf(tokenId);
        const proxy = await getProxy(library, owner, account ?? '', signer, chainId);

        if (!proxy) { 
          return false;
        } else {
          var canSendToken = await canSend(owner, wizContract, proxy, tokenId, signer, setStatus);
          if (!canSendToken) {
            return false;
          }
        }
        setStatus(Status.USER_INPUT);
        
        break;

      case OrderType.ACCEPT_OFFER:
        query = {
          contract,
          tokenId,
          side: 'buy',
        };
        console.log(status);
        await acceptOffer(API_BASE_URL, chainId, library, signer, query, setStatus);
        setModal(false);
        break;

      case OrderType.CANCEL_LISTING:
        query = {
          contract,
          tokenId,
          side: 'sell',
        };

        await cancelOrder(API_BASE_URL, chainId, signer, query);
        setModal(false);
        break;

      case OrderType.CANCEL_OFFER:
        query = {
          contract,
          tokenId,
          side: 'buy',
        };

        await cancelOrder(API_BASE_URL, chainId, signer, query);
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

    if (action == OrderType.OFFER) {
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
        const calculations = calculateOffer(userInput, ethBalance, weth.balance, Number(fee));
        setCalculations(calculations)
      }
    }
  }, [price]);

  async function doSale(event: any) {
    event.preventDefault();
    if (!price || isNaN(Number(price)) || Number(price) < 0) {
      console.log('invalid price'); 
      // TODO - error in UI
    } else {
      const query = {
        contract,
        maker: account ?? '',
        side: 'sell',
        price: ethers.utils.parseEther(price).toString(),
        fee: fee,
        feeRecipient: feeRecipient,
        tokenId: tokenId,
        expirationTime: (Date.parse(expiration.toString()) / 1000).toString(),
      };
      if (await listTokenForSell(chainId, signer, query)) {
        // Listing successful, hide modal
        setModal(false);
      } else {
        // TODO - error in UI, listing failed
        setModal(false);
      }
    }
  }

  async function doOffer(event: any) {
    event.preventDefault();

    if (!price || isNaN(Number(price)) || Number(price) < 0) {
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

      if (collectionWide) {
        query.collection = CONTRACTS[contract].collection
      } else {
        query.contract = contract
        query.tokenId = tokenId
      }

      await makeOffer(
        chainId, 
        library, 
        ethers.utils.parseEther(price), 
        API_BASE_URL, 
        signer, 
        query, 
        calculations.missingWeth, 
        setStatus
      );

      setModal(false);
    }
  }

  function clickOut(event: any) {
    if (event.target.id == 'wrapper') {
      setModal(false);
    }
  }

  var imageUrl = CONTRACTS[contract].display == 'Wizards' ? CONTRACTS[contract].image_url + tokenId + '/' + tokenId + '.png' : CONTRACTS[contract].image_url + tokenId + ".png";

  if (action == OrderType.BUY) {
    return (
      <OverlayWrapper id="wrapper" onClick={(e) => clickOut(e)}>
      <Overlay>
        { status == Status.PROCESSING ? 
        <Section>
          <img src={"/static/img/marketplace/hourglass.gif"} height={250} width={250} />
          <Title style={{marginTop: "20px"}}>Purchasing {name} (#{tokenId})</Title>
          <Title style={{marginTop: "20px"}}>Transaction processing...</Title>
        </Section> : status == Status.SUCCESS ? 
        <Section>
          <img src={"/static/img/marketplace/magicdust.gif"} height={250} width={250} />
          <Title style={{marginTop: "20px"}}>{name} (#{tokenId})</Title>
          <Title style={{marginTop: "20px"}}>Purchase successful!</Title>
        </Section> : status == Status.FAILURE ?
        <Section>
          <Title style={{marginTop: "20px"}}>Failed to purchase. Please ensure you have sufficient funds</Title>
        </Section> :
         <Section>
         <TokenImage src={imageUrl} height={250} width={250} />
         <Title style={{marginTop: "20px"}}>Purchasing {name} (#{tokenId})...</Title>
       </Section>
        }
      </Overlay> 
    </OverlayWrapper>
    );
  }

  if (action == OrderType.SELL) {
    return (
    <OverlayWrapper id="wrapper" onClick={(e) => clickOut(e)}>
      { status == Status.USER_INPUT ? <Overlay>
        <Title style={{marginBottom: "40px", fontSize: "24px"}}>Listing {name} (#{tokenId}) for sale</Title>
        <TokenImage src={imageUrl} height={250} width={250} />
          <ListPrice>
            <Title style={{marginTop: "30px"}}>Price</Title>
            <form onSubmit={(e) => { doSale(e) }}>
              <PriceInput type="number" style={{marginBottom: '20px'}} value={price} onChange={(e)=> setPrice(e.target.value)}></PriceInput>
            </form>
          </ListPrice>
          <Expiration>
            <Title>
              <div style={{marginRight: '10px', marginBottom: '5px'}}>Listing Expires</div>
              <InfoTooltip tooltip={'A listing can no longer be filled after its expiration. Invalidating a listing before its expiration requires manual cancellation'}/>
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
          src={"/static/img/marketplace/sell.png"}
          onMouseOver={(e) =>
            (e.currentTarget.src = "/static/img/marketplace/sell_hover.png")
          }
          onMouseOut={(e) =>
            (e.currentTarget.src = "/static/img/marketplace/sell.png")
          }
          onClick={(e) => { doSale(e) }}
        />
      </Overlay> : status == Status.PROCESSING ?
        <Overlay>
          <img src={"/static/img/marketplace/hourglass.gif"} height={250} width={250} />
          <Title>Setting approval...</Title>
          <Description>This is a required one-time approval to allow trading tokens from this contract.</Description>
        </Overlay> :
        <Overlay><img src={"/static/img/marketplace/loading_card.gif"} height={250} width={250} /></Overlay>
      }
    </OverlayWrapper>
    );
  }

  if (action == OrderType.OFFER) {
    return (
      <OverlayWrapper id="wrapper" onClick={(e) => clickOut(e)}>
        { status == Status.LOADING ? 
        <Overlay id="modal">
          {collectionWide && <img src={`/static/img/marketplace/${CONTRACTS[contract].display.toLowerCase()}-banner.png`} width={'100%'} style={{marginBottom: '40px'}}/>}
          {collectionWide ? <Title style={{marginBottom: "40px", fontSize: "24px"}}>Submitting a collection offer for {name}</Title> : 
            <Title style={{marginBottom: "40px", fontSize: "24px"}}>Submitting an offer for {name} (#{tokenId})</Title>}
          {!collectionWide && <TokenImage src={imageUrl} height={250} width={250} />}
            <ListPrice>
              <Title style={{marginTop: "35px"}}>Price</Title>
              <form onSubmit={(e) => { doOffer(e) }}>
                <PriceInput type="number" style={{marginBottom: '20px'}} value={price} onChange={(e)=> setPrice(e.target.value)}></PriceInput>
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
        </Overlay> : status == Status.WRAPPING ?
        <Overlay>
          <img src={"/static/img/marketplace/hourglass.gif"} height={250} width={250} />
          <Title style={{marginBottom: "40px"}}>Wrapping ETH to make offer...</Title>
        </Overlay> :
        <Overlay>
        <Title style={{marginBottom: "40px"}}>Wrap ETH to proceed with offer</Title>
      </Overlay>
    }
    </OverlayWrapper>
    );
  }

  if (action == OrderType.ACCEPT_OFFER) {
    return (
    <OverlayWrapper id="wrapper" onClick={(e) => clickOut(e)}>
      { status == Status.PROCESSING ? 
        <Overlay>
          <img src={"/static/img/marketplace/hourglass.gif"} height={250} width={250} />
          <Title style={{marginTop: "20px"}}>Transaction processing...</Title>
        </Overlay> : 
        <Overlay>
          <img src={"/static/img/marketplace/magicdust.gif"} height={250} width={250} />
          <Title style={{marginTop: "20px", fontSize: "24px"}}>Accepting offer for {name} (#{tokenId})...</Title>
        </Overlay>
      }
    </OverlayWrapper>
    );
  }

  if (action == OrderType.CANCEL_LISTING || action == OrderType.CANCEL_OFFER) {
    return ( 
    <OverlayWrapper id="wrapper" onClick={(e) => clickOut(e)}>
      <Overlay>
        <img src={"/static/img/marketplace/hourglass.gif"} height={250} width={250} />
        <Title>{ action == OrderType.CANCEL_LISTING ? 'Canceling listing...' : 'Canceling offer...'}</Title>
      </Overlay>
    </OverlayWrapper>
    );
  }

  return null
}

import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { API_BASE_URL, CONTRACTS } from "./marketplaceConstants";
import { BigNumber, Signer, Contract, ContractTransaction, ethers, constants } from "ethers";
import { useEthers } from "@usedapp/core";
import { paths } from "../../interfaces/apiTypes";
import setParams from "../../lib/params";
import { WyvernV2 } from '@reservoir0x/sdk';
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import InfoTooltip from "../../components/Marketplace/InfoToolTip";
import { Weth } from '@reservoir0x/sdk/dist/common/helpers'
import { formatBN } from "../../lib/numbers";

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

/**
 *
 * @param userInput The user's ETH input value
 * @param signerEth The signer's ETH balance
 * @param signerWeth The signer's wETH balance
 * @param bps The royalty amount
 */
 function calculateOffer(
  userInput: BigNumber,
  signerEth: BigNumber,
  signerWeth: BigNumber,
  bps: number
) {
  let fee = userInput.mul(BigNumber.from(bps)).div(BigNumber.from('10000'))
  let total = userInput.add(fee)

  if (signerWeth.add(signerEth).lt(total)) {
    // The signer has insufficient balance
    const missingEth = total.sub(signerWeth.add(signerEth))
    const missingWeth = total.sub(signerWeth)
    return {
      fee,
      total,
      missingEth,
      missingWeth,
      error: `You have insufficient funds to place this bid.
      Increase your balance by ${formatBN(missingEth, 5)} ETH or ${formatBN(
        missingWeth,
        5
      )} wETH.`,
      warning: null,
    }
  } else if (signerWeth.lt(total)) {
    // The signer doesn't have enough wETH
    const missingWeth = total.sub(signerWeth)
    return {
      fee,
      total,
      missingEth: constants.Zero,
      missingWeth,
      error: null,
      warning: `${formatBN(missingWeth, 6)} will be wrapped
      to place your bid.`,
    }
  } else {
    return {
      fee,
      total,
      missingEth: constants.Zero,
      missingWeth: constants.Zero,
      error: null,
      warning: null,
    }
  }
}

/**
 * Get a wETH contract instance and the signers wETH balance
 * @param chainId The Ethereum chain ID (eg: 1 - Ethereum Mainnet,
 *  4 - Rinkeby Testnet)
 * @param provider An abstraction to access the blockchain data
 * @param signer An Ethereum signer object
 * @returns A wETH contract instance and the signers wETH balance
 */
async function getWeth(chainId: number, provider: any, signer: Signer) {
  const weth = new Weth(provider, chainId)
  const signerAddress = await signer.getAddress()

  try {
    const balance = BigNumber.from(await weth.getBalance(signerAddress))
    return { weth, balance }
  } catch (err) {
    console.error(err)
  }

  return null
}

/**
 * In order to fill any orders, the Wyvern Token Transfer
 * Proxy must have an allowance to spend signer's wETH that
 * is greater than, or equal to the order value. Use this function
 * to check if the signer meets this requirement.
 * @param chainId The Ethereum chain ID (eg: 1 - Ethereum Mainnet,
 *  4 - Rinkeby Testnet)
 * @param weth A wrapped ETH (wETH) contract instance
 * @param input The user input offer value in wETH
 * @param signer An Ethereum signer object
 * @returns `true` if all conditions to continue are met and `false`
 * otherwise
 */
async function hasWethAllowance(
  chainId: number,
  weth: Weth,
  input: BigNumber,
  signer: Signer
) {
  try {
    const tokenTransferProxy =
      chainId === 4
        ? '0x82d102457854c985221249f86659c9d6cf12aa72'
        : '0xe5c783ee536cf5e63e792988335c4255169be4e1'

    const signerAddress = await signer.getAddress()
    // Get the allowance the signer gave to the Wyvern Token Transfer Proxy
    const allowance = await weth.getAllowance(signerAddress, tokenTransferProxy)

    console.log('got allowance');

    if (input.gt(allowance)) {
      // If the allowance is not greater than or equal to the user's input,
      // approve the Token Transfer Proxy to spend the total supply of wETH
      let { wait } = (await weth.approve(
        signer,
        tokenTransferProxy,
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      )) as ContractTransaction

      console.log('approve token transfer proxy');

      // Wait for the transaction to be mined
      await wait()

      console.log('approve complete');
    }

    // The exchange has enough allowance
    return true
  } catch (err) {
    console.error(err)
  }

  return false
}

/**
 * Check if the signer has enough wETH to post the current
 * offer to buy a token. If necessary, wrap the missing signer's ETH
 * @param signer An Ethereum signer object
 * @param missingWeth Amount of wETH the signer is missing to
 * make the current offer
 * @param weth A wrapped ETH (wETH) contract instance
 * @returns `true` if the signer has enough wETH, `false` otherwise
 */
export async function checkUserBalance(
  signer: Signer,
  missingWeth: BigNumber,
  weth: Weth, 
  setWrapping: any
) {
  // The signer has enough wETH
  if (missingWeth.isZero()) return true

  setWrapping(true);
  console.log(ethers.utils.formatEther(missingWeth));

  try {
    // The signer doesn't have enough wETH
    // wrap the necessary ETH
    let { wait } = (await weth.deposit(
      signer,
      missingWeth
    )) as ContractTransaction

    // Wait for the transaction to be mined
    await wait()

    setWrapping(false);

    return true
  } catch (err) {
    setWrapping(false);
    console.error(err)
  }

  return false
}

/**
 * Post an offer to buy order to the Reservoir database
 * @param chainId The Ethereum chain ID (eg: 1 - Ethereum Mainnet,
 *  4 - Rinkeby Testnet)
 * @param apiBase The Reservoir's API base url
 * @param signer An Ethereum signer object
 * @param query The query object containing all order parameters
 * @returns The buy order if the order was successfully posted to Reservoir.
 * This order can be used to post an equivalent order to OpenSea.
 * Returns `null` otherwise
 */
async function postBuyOrder(
  chainId: number,
  apiBase: string,
  signer: Signer,
  query: paths['/orders/build']['get']['parameters']['query']
) {
  try {
    // Fetch order to Reservoir
    let url = new URL('/orders/build', apiBase)

    setParams(url, query)

    let res = await fetch(url.href)

    let { order } =
      (await res.json()) as paths['/orders/build']['get']['responses']['200']['schema']

    if (!order?.params) {
      throw new ReferenceError('Could not retrieve order params')
    }

    // Instatiate a Wyvern order
    const buyOrder = new WyvernV2.Order(chainId, order.params)

    // Sign the order before posting to Reservoir
    await buyOrder.sign(signer)

    // Post buy order to Reservoir
    let url2 = new URL('/orders', apiBase)

    await fetch(url2.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orders: [{ kind: 'wyvern-v2', data: buyOrder.params }],
      }),
    })

    return buyOrder
  } catch (err) {
    console.error(err)
  }

  return null
}

/**
 * Make an offer
 * @param chainId
 * @param provider
 * @param input
 * @param apiBase
 * @param signer
 * @param query
 * @param missingWeth
 */
async function makeOffer(
  chainId: number,
  provider: any,
  input: BigNumber,
  apiBase: string,
  signer: any,
  query: paths['/orders/build']['get']['parameters']['query'],
  missingWeth: BigNumber, 
  setWrapping: any
) {
  try {
    // Get a wETH instance
    const weth = await getWeth(chainId, provider, signer)

    if (!weth?.weth) throw new ReferenceError('wETH contract is undefined.')

    // Check the signer's allowance
    const isAllowanceOk = await hasWethAllowance(
      chainId,
      weth.weth,
      input,
      signer
    )

    if (!isAllowanceOk) throw new Error('Allowance is not ok')

    const isBalanceOk = await checkUserBalance(signer, missingWeth, weth.weth, setWrapping)

    if (!isBalanceOk) throw new Error('Balance is not ok')

    const buyOrder = await postBuyOrder(chainId, apiBase, signer, query)

    if (!buyOrder) throw new ReferenceError('Buy order is undefined')
    if (!query.tokenId) throw new ReferenceError('query.tokenId is undefined')
    if (!query.contract) throw new ReferenceError('query.contract is undefined')
  } catch (err) {
    console.error(err)
  }
}

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
  const [wrapping, setWrapping] = useState(false);

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
        setWrapping
      )
    }
  }

  return (
    <OverlayWrapper>
      { !wrapping ? 
      <Overlay>
        <Title style={{marginBottom: "40px"}}>Submitting an offer for {name} (#{tokenId})</Title>
        <TokenImage src={CONTRACTS[contract].image_url + tokenId + ".png"} height={250} width={250} />
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
      </Overlay> :
      <Overlay>
        <img src={"/static/img/marketplace/hourglass.gif"} height={250} width={250} />
        <Title style={{marginBottom: "40px"}}>Wrapping ETH to make offer...</Title>
      </Overlay>
    }
    </OverlayWrapper>
  )
}

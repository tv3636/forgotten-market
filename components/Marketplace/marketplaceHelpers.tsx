import { WyvernV2 } from "@reservoir0x/sdk";
import { Weth } from "@reservoir0x/sdk/dist/common/helpers";
import { BigNumber, constants, Contract, ContractTransaction, ethers, Signer } from "ethers";
import { Interface } from "ethers/lib/utils";
import { SocialItem } from "../../components/Lore/BookOfLoreControls";
import { ResponsivePixelImg } from "../../components/ResponsivePixelImg";
import { WYVERN_ABI } from "../../contracts/abis";
import { paths } from "../../interfaces/apiTypes";
import { formatBN } from "../../lib/numbers";
import setParams from "../../lib/params";
import { API_BASE_URL, CONTRACTS, Status } from "./marketplaceConstants";

const chainId = Number(process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID);

/**
 *
 * @param apiBase The Reservoir API base url
 * @param chainId The Ethereum chain ID (eg: 1 - Ethereum Mainnet, 4 - Rinkeby Testnet)
 * @param signer An Ethereum signer object
 * @param contract The contract address for the collection
 * @param setWaiting Function to update waiting state as needed
 * @returns `true` if the transaction was succesful, `false` otherwise
 */
 export async function instantBuy(
  apiBase: string,
  chainId: number,
  signer: any,
  query: paths['/orders/fill']['get']['parameters']['query'],
  setStatus: (status: Status) => void
) {
  try {
    // Fetch the best sell order for this token
    let url = new URL('/orders/fill', apiBase)

    setParams(url, query)

    const res = await fetch(url.href)

    const { order } =
      (await res.json()) as paths['/orders/fill']['get']['responses']['200']['schema']

    if (!order?.params) {
      throw new ReferenceError('Could not retrieve order params')
    }

    // Use SDK to create order object
    const sellOrder = new WyvernV2.Order(chainId, order.params)

    const signerAddress = await signer.getAddress()

    // Create a matching buy order
    const buyOrder = sellOrder.buildMatching(
      signerAddress,
      order.buildMatchingArgs
    )

    const exch = new WyvernV2.Exchange(chainId)

    // Execute order match
    const { wait } = await exch.match(signer, buyOrder, sellOrder)
    setStatus(Status.PROCESSING);

    // Wait for the transaction to be mined
    await wait()
    
    setStatus(Status.SUCCESS);
    return true
  } catch (err) {
    console.error(err);
    setStatus(Status.FAILURE);
  }

  return false
}

/**
 * Get a wETH contract instance and the signers wETH balance
 * @param chainId The Ethereum chain ID (eg: 1 - Ethereum Mainnet,
 *  4 - Rinkeby Testnet)
 * @param provider An abstraction to access the blockchain data
 * @param signer An Ethereum signer object
 * @returns A wETH contract instance and the signers wETH balance
 */
 export async function getWeth(chainId: number, provider: any, signer: Signer) {
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
  setStatus: (status: Status) => void,
) {
  // The signer has enough wETH
  if (missingWeth.isZero()) return true

  console.log(ethers.utils.formatEther(missingWeth));
  setStatus(Status.USER_INPUT);

  try {
    // The signer doesn't have enough wETH
    // wrap the necessary ETH
    let { wait } = (await weth.deposit(
      signer,
      missingWeth
    )) as ContractTransaction

    setStatus(Status.WRAPPING);

    // Wait for the transaction to be mined
    await wait()

    setStatus(Status.SUCCESS);

    return true
  } catch (err) {
    setStatus(Status.FAILURE);
    console.error(err)
  }

  return false
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
 export async function hasWethAllowance(
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
 *
 * @param userInput The user's ETH input value
 * @param signerEth The signer's ETH balance
 * @param signerWeth The signer's wETH balance
 * @param bps The royalty amount
 */
 export function calculateOffer(
  userInput: BigNumber,
  signerEth: BigNumber,
  signerWeth: BigNumber,
  bps: number
) {
  let fee = userInput.mul(BigNumber.from(bps)).div(BigNumber.from('10000'))

  let totalNum = Number(formatBN(userInput, 5)) / (1 - (bps / 10000));
  let total = ethers.utils.parseEther(totalNum.toString());

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

export async function makeOffer(
  chainId: number,
  provider: any,
  input: BigNumber,
  apiBase: string,
  signer: any,
  query: paths['/orders/build']['get']['parameters']['query'],
  missingWeth: BigNumber, 
  setStatus: (status: Status) => void,
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

    const isBalanceOk = await checkUserBalance(signer, missingWeth, weth.weth, setStatus)

    if (!isBalanceOk) throw new Error('Balance is not ok')

    const buyOrder = await postBuyOrder(chainId, apiBase, signer, query)

    if (!buyOrder) throw new ReferenceError('Buy order is undefined')
    if (!query.tokenId) throw new ReferenceError('query.tokenId is undefined')
    if (!query.contract) throw new ReferenceError('query.contract is undefined')
  } catch (err) {
    console.error(err)
    setStatus(Status.LOADING);
  }
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
 export async function postBuyOrder(
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

export async function cancelOrder(
  apiBase: string,
  chainId: number,
  signer: any,
  query: paths['/orders/fill']['get']['parameters']['query'],
) {
  try {
    // Get the order parameters from the Reservoir API
    const url = new URL('/orders/fill', apiBase)

    setParams(url, query)

    const res = await fetch(url.href)

    const { order } =
      (await res.json()) as paths['/orders/fill']['get']['responses']['200']['schema']

    if (!order?.params) {
      console.error('There was an error fetching the order to be cancelled.')
      return false
    }
    console.log(order);
    // Instantiate a Wyvern object from the order parameters
    // obatined from the API
    const sellOrder = new WyvernV2.Order(chainId, order.params)

    // Instantiate a Wyvern exchange object
    const exch = new WyvernV2.Exchange(chainId)

    // Execute cancellation
    const { wait } = await exch.cancel(signer, sellOrder)

    // Wait for transaction to be mined
    await wait()

    return true
  } catch (err) {
    console.log(err)
  }

  return false
}

async function getMatchingOrders(
  apiBase: string,
  chainId: number,
  signer: any,
  query: paths['/orders/fill']['get']['parameters']['query']
) {
  try {
    // Get the best offer for the token
    const url = new URL('/orders/fill', apiBase)

    setParams(url, query)

    // Get the best BUY order data
    const res = await fetch(url.href)

    const { order } =
      (await res.json()) as paths['/orders/fill']['get']['responses']['200']['schema']

    if (!order?.params) {
      throw new ReferenceError('Could not retrieve order params from the API')
    }

    // Use SDK to create order object
    const buyOrder = new WyvernV2.Order(chainId, order?.params)

    const signerAddress = await signer.getAddress()

    // Instatiate an matching SELL Order
    const sellOrder = buyOrder.buildMatching(
      signerAddress,
      order.buildMatchingArgs
    )

    return { buyOrder, sellOrder }
  } catch (err) {
    console.error(err)
  }
  return null
}

async function isProxyApproved(
  chainId: number,
  signer: any,
  tokenId: string,
  contract: string
) {
  const collectionContract = new Contract(
    contract,
    new Interface([
      'function ownerOf(uint256 tokenId) view returns (address)',
      'function getApproved(uint256 tokenId) view returns (address)',
      'function isApprovedForAll(address owner, address operator) view returns (bool)',
      'function setApprovalForAll(address operator, bool approved)',
    ])
  )

  const proxyRegistryContract = new Contract(
    chainId === 4
      ? '0xf57b2c51ded3a29e6891aba85459d600256cf317'
      : '0xa5409ec958c83c3f309868babaca7c86dcb077c1',
    new Interface([
      'function proxies(address) view returns (address)',
      'function registerProxy()',
    ])
  )

  try {
    const userProxy = await registerUserProxy(
      collectionContract,
      proxyRegistryContract,
      signer,
      tokenId
    )
    const proxyApproved = await checkProxyApproval(
      collectionContract,
      signer,
      userProxy,
      tokenId
    )

    return proxyApproved
  } catch (err) {
    console.error(err)
  }
  return false
}

async function registerUserProxy(
  collectionContract: Contract,
  proxyRegistryContract: Contract,
  signer: any,
  tokenId: string
) {
  try {
    // Make sure the signer is the owner of the listed token
    const owner = await collectionContract.connect(signer).ownerOf(tokenId)

    const signerAddress = await signer.getAddress()

    if (owner.toLowerCase() !== signerAddress.toLowerCase()) {
      throw new Error('The signer is not the token owner.')
    }

    // Retrieve user proxy
    const userProxy = await proxyRegistryContract
      .connect(signer)
      .proxies(signerAddress)

    if (userProxy === ethers.constants.AddressZero) {
      // If the user has no associated proxy, then register one
      let { wait } = (await proxyRegistryContract
        .connect(signer)
        .registerProxy()) as ContractTransaction

      // Wait for the transaction to get mined
      await wait()

      // Retrieve user proxy
      const userProxy = await proxyRegistryContract
        .connect(signer)
        .proxies(signerAddress)

      return userProxy
    } else {
      // The user already registered a proxy
      return userProxy
    }
  } catch (err) {
    console.error(err)
  }
  return null
}

async function checkProxyApproval(
  collectionContract: Contract,
  signer: any,
  userProxy: any,
  tokenId: string
) {
  try {
    const signerAddress = await signer.getAddress()
    // Check approval on the user proxy
    let isApproved = await collectionContract
      .connect(signer)
      .isApprovedForAll(signerAddress, userProxy)

    if (!isApproved) {
      const approvedAddress = await collectionContract
        .connect(signer)
        .getApproved(tokenId)
      isApproved = approvedAddress.toLowerCase() === signerAddress.toLowerCase()
    }

    if (!isApproved) {
      // Set the approval on the user proxy
      const { wait } = (await collectionContract
        .connect(signer)
        .setApprovalForAll(userProxy, true)) as ContractTransaction

      // Wait for the transaction to get mined
      await wait()
    }

    // Everything has executed successfully
    return true
  } catch (err) {
    console.error(err)
  }
  return false
}

/**
 *
 * @param apiBase The Reservoir API base url
 * @param chainId The Ethereum chain ID (eg: 1 - Ethereum Mainnet, 4 - Rinkeby Testnet)
 * @param signer An Ethereum signer object
 * @param contract The contract address for the collection
 * @param tokenId The token ID
 * @returns `true` if the transaction was succesful, `fasle` otherwise
 */
 export async function acceptOffer(
  apiBase: string,
  chainId: number,
  provider: any,
  signer: any,
  query: paths['/orders/fill']['get']['parameters']['query'],
  setStatus: (status: Status) => void,
) {
  try {
    const proxyApproved = await isProxyApproved(
      chainId,
      signer,
      query.tokenId,
      query.contract ?? ''
    )

    if (!proxyApproved) return false

    // Get a wETH instance
    const weth = await getWeth(chainId, provider, signer)

    if (!weth?.weth) throw new ReferenceError('wETH contract is undefined.')

    const orders = await getMatchingOrders(apiBase, chainId, signer, query)

    if (!orders) return false

    // Accepting offer flow includes sending WETH for royalty after receiving WETH, so check for proper WETH allowance
    var royalty = Number(ethers.utils.formatEther(orders.buyOrder.params.basePrice)) * (orders.buyOrder.params.takerRelayerFee / 10000);

    const isAllowanceOk = await hasWethAllowance(
      chainId,
      weth.weth,
      ethers.utils.parseEther(royalty.toFixed(9).toString()),
      signer
    )

    if (!isAllowanceOk) throw new Error('Allowance is not ok')

    const { buyOrder, sellOrder } = orders
    // Instantiate WyvernV2 Exchange contract object
    const exchange = new WyvernV2.Exchange(chainId)

    // Execute token sell
    let { wait } = await exchange.match(signer, buyOrder, sellOrder)
    setStatus(Status.PROCESSING);
    
    // Wait for transaction to be mined
    await wait()

    setStatus(Status.SUCCESS);

    return true
  } catch (err) {
    console.error(err)
  }
  return false
}

export async function getProxy(provider: any, owner: string, account: string, signer: any, chainId: number) {
  const proxyRegistryContract = new Contract(
    chainId === 4
      ? '0xf57b2c51ded3a29e6891aba85459d600256cf317'
      : '0xa5409ec958c83c3f309868babaca7c86dcb077c1',
    WYVERN_ABI,
    provider
  );
  
  if (owner.toLowerCase() !== account?.toLowerCase()) {
    console.error('Signer is not the token owner')
    return null
  } else {
    const userProxy = await proxyRegistryContract.proxies(owner)

    // Register proxy for wyvern exchange if it doesn't exist
    if (!userProxy) {
      let { wait } = (await proxyRegistryContract.connect(signer).registerProxy()) as ContractTransaction;
        
        // Wait for the transaction to get mined
        await wait();
        
        // Retrieve user proxy
        return await proxyRegistryContract.proxies(owner);
    }

    return userProxy;
  }
}

export async function canSend(
  owner: string, 
  collectionContract: any, 
  userProxy: string, 
  tokenId: string, 
  signer: any, 
  setStatus: (status: Status) => void,
  ) {
  // Check approval on the user proxy
  let isApproved = await collectionContract.connect(signer).isApprovedForAll(owner, userProxy)

  if (!isApproved) {
    const approvedAddress = await collectionContract.connect(signer).getApproved(tokenId)
    isApproved = approvedAddress.toLowerCase() === owner.toLowerCase()
  }
  try {
    if (isApproved) {
      // Set success
      return true
    } else {
      // Set the approval on the user proxy
      const { wait } = (await collectionContract.connect(signer).setApprovalForAll(userProxy, true)) as ContractTransaction
      setStatus(Status.PROCESSING);
      
      // Wait for the transaction to get mined
      await wait()

      return true
    }
  } catch (error) {
    console.error(error);
    return false
  }
}

export async function listTokenForSell(
  chainId: number,
  signer: any,
  query: any,
) {
  if (!signer || !query.tokenId || !query.contract) {
    console.debug({ signer, query })
    return
  }

  try {
    // Build a selling order
    let url = new URL('/orders/build', API_BASE_URL)

    setParams(url, query)

    let res = await fetch(url.href)

    let { order } =
      (await res.json()) as paths['/orders/build']['get']['responses']['200']['schema']

    if (!order?.params) {
      throw 'API ERROR: Could not retrieve order params'
    }

    // Use SDK to create order object
    const sellOrder = new WyvernV2.Order(chainId, order.params)

    // Sign selling order
    await sellOrder.sign(signer)

    console.log('signed');

    // Post order to the database
    let url2 = new URL('/orders', API_BASE_URL)

    await fetch(url2.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orders: [
          {
            kind: 'wyvern-v2',
            data: sellOrder.params,
          },
        ],
      }),
    })

    return true;

  } catch (error) {
    console.error(error)
    return false
  }
}


// Sort and count trait values
export function getOptions(traits: [any]) {
  var result: any[] = [];

  if (traits.length > 0 && isNaN(traits[0].value)) {
    traits.sort(function (first, second) {
      return second.count - first.count;
    });
  } else if (traits.length > 0) {
    traits.sort(function (first, second) {
      return second.value - first.value;
    });
  }

  for (var trait of traits) {
    let option: any = {};
    option.value = trait.value;
    option.label =
      trait.value + ( " (" + trait.count + ")");

    result.push(option);
  }
  return result;
}

// Format trait for Reservoir API call
function traitFormat(trait: string) {
  var out = "";
  for (var word of trait.split(' ')) {
    if (word == 'in') {
      out += word + " ";
    } else {
      out += word.charAt(0).toUpperCase() + word.slice(1) + " ";
    }
  }

  // Rinkeby fix
  if (chainId == 4 && ['Background ', 'Body ', 'Familiar ', 'Head ', 'Prop ', 'Rune '].includes(out)) {
    out = out.charAt(0).toLowerCase() + out.slice(1);
  }

  return out.slice(0, -1);
}

// Build API parameters from router parameters
export function getURLAttributes(query: any) {
  var url_string = "";
  for (var trait of Object.keys(query)) {
    if (trait != 'contractSlug') {
      var url_trait = traitFormat(trait).replace("#", "%23");
      url_string +=
        "&attributes[" +
        url_trait +
        "]=" +
        query[trait];
    }
  }

  return url_string;
}

// Social icons for each token
export function Icons({
  tokenId,
  contract,
}: {
  tokenId: number;
  contract: string;
}) {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "1vh" }}
    >
      <SocialItem>
        <a
          href={`https://forgottenrunes.com/scenes/gm/${tokenId}`}
          className="icon-link gm"
          target="_blank"
        >
          <ResponsivePixelImg
            src="/static/img/icons/gm.png"
            className="gm-img"
          />
        </a>
      </SocialItem>
      <SocialItem>
        <a href={`https://forgottenrunes.com/lockscreen?tokenSlug=${CONTRACTS[contract].display.toLowerCase()}&tokenId=${tokenId}`} className="icon-link" target="_blank">
          <ResponsivePixelImg src="/static/img/icons/social_phone_default.png" />
        </a>
      </SocialItem>
      {CONTRACTS[contract].collection == "forgottenruneswizardscult" && (
        <SocialItem>
          <a
            href={`https://forgottenrunes.com/api/art/${CONTRACTS[contract].display.toLowerCase()}/${tokenId}.zip`}
            className="icon-link"
            target="_blank"
          >
            <ResponsivePixelImg src="/static/img/icons/social_download_default_w.png" />
          </a>
        </SocialItem>
      )}
      <SocialItem>
        <a
          href={`https://forgottenrunes.com/lore/${CONTRACTS[contract].display.toLowerCase()}/${tokenId}/0`}
          className="icon-link"
          target="_blank"
        >
          <ResponsivePixelImg src="/static/img/icons/social_link_default.png" />
        </a>
      </SocialItem>
    </div>
  );
}

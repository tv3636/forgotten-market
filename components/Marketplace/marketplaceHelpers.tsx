import { WyvernV2 } from "@reservoir0x/sdk";
import { Weth } from "@reservoir0x/sdk/dist/common/helpers";
import { BigNumber, constants, Contract, ContractTransaction, ethers, Signer } from "ethers";
import { arrayify, Interface, splitSignature } from "ethers/lib/utils";
import { SocialItem } from "../../components/Lore/BookOfLoreControls";
import { ResponsivePixelImg } from "../../components/ResponsivePixelImg";
import { formatBN } from "../../lib/numbers";
import setParams from "../../lib/params";
import { CONTRACTS, Status } from "./marketplaceConstants";
import { pollUntilHasData, pollUntilOk } from '../../lib/pollApi';

const chainId = Number(process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID);

export type Execute = {
  steps?:
    | {
        action: string
        description: string
        status: 'complete' | 'incomplete'
        kind: 'transaction' | 'signature' | 'request' | 'confirmation'
        data?: any
        loading?: boolean
      }[]
    | undefined
  query?: { [x: string]: any }
  error?: string | undefined
}

/**
 * When attempting to perform actions, such as, selling a token or
 * buying a token, the user's account needs to meet certain requirements. For
 * example, if the user attempts to buy a token the Reservoir API checks if the
 * user has enough balance, before providing the transaction to be signed by
 * the user. This function executes all transactions, in order, to complete the
 * action.
 * @param url URL object with the endpoint to be called. Example: `/execute/buy`
 * @param signer Ethereum signer object provided by the browser
 * @returns The data field of the last element in the steps array
 */
export default async function executeSteps(
  url: any,
  signer: any,
  setTxn: (txn: string) => void,
  setStatus: (status: Status) => void,
  callback?: (steps: Execute) => any,
) {
  console.log(url);
  // Fetch the steps
  const res = await fetch(url.href)
  let json = (await res.json()) as Execute

  try {
    // Handle errors
    if (json.error) throw new Error(json.error)
    if (!json.steps) throw new ReferenceError('There are no steps.')

    // Return steps in callback, so progress can be displayed in UI
    if (callback) callback(json)

    for (let index = 0; index < json.steps.length; index++) {
      // Update UI for loading state
      json.steps[index].loading = true
      if (callback) callback(json)

      let { status, kind, data } = json.steps[index]
      if (status === 'incomplete') {
        // Append any extra params provided by API
        if (json.query) setParams(url, json.query)

        // If step is missing data, poll until it is ready
        if (!data) {
          json = (await pollUntilHasData(url, index)) as Execute
          if (!json.steps) throw new ReferenceError('There are no steps.')
          data = json.steps[index].data
        }

        // Handle each step based on it's kind
        switch (kind) {
          // Make an on-chain transaction
          case 'transaction': {
            const tx = await signer.sendTransaction(data)
            setTxn(tx.hash);
            await tx.wait()
            break
          }

          // Sign a message
          case 'signature': {
            // Request user signature
            const signature = await signer.signMessage(arrayify(data.message))
            // Split signature into r,s,v components
            const { r, s, v } = splitSignature(signature)
            // Include signature params in any future requests
            setParams(url, { r, s, v })
            break
          }

          // Post a signed order object to order book
          case 'request': {
            const postOrderUrl = new URL(data.endpoint, url.origin)
            await fetch(postOrderUrl.href, {
              method: data.method,
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data.body),
            })
            break
          }

          // Confirm that an on-chain tx has been picked up by indexer
          case 'confirmation': {
            const confirmationUrl: any = new URL(data.endpoint, url.origin)
            await pollUntilOk(confirmationUrl)
            break
          }
        }

        // Mark the step as complete
        json.steps[index].status = 'complete'
        json.steps[index].loading = false

        if (callback) callback(json)
      }
    }
    return true;
  } catch (error) {
    console.error(error);
    setStatus(Status.FAILURE);
    return false;
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
    if (trait != 'contractSlug' && trait != 'activity') {
      var url_trait = traitFormat(trait).replace("#", "%23");
      url_string +=
        "&attributes[" +
        url_trait +
        "]=" +
        query[trait].replaceAll(' ', '+');
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

export function LoadingCard({ height }: { height: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        height: height,
      }}
    >
      <img
        src="/static/img/marketplace/loading_card.gif"
        style={{ maxWidth: "200px" }}
      />
    </div>
  );
}

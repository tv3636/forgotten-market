import { TypedDataSigner } from '@ethersproject/abstract-signer';
import { Weth } from "@reservoir0x/sdk/dist/common/helpers";
import { BigNumber, constants, Signer } from "ethers";
import { arrayify, splitSignature } from "ethers/lib/utils";
import { ResponsivePixelImg } from "../../components/ResponsivePixelImg";
import { formatBN } from "../../lib/numbers";
import setParams from "../../lib/params";
import { CONTRACTS } from "./marketplaceConstants";
import { pollUntilHasData, pollUntilOk } from '../../lib/pollApi';
import styled from '@emotion/styled';

const SocialItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.4em;

  a:hover {
    opacity: 0.5;
    transition: all 100ms;
  }

  a:active {
    opacity: 0.3;
  }

  .gm-img {
    height: 30px;
    width: 33px;
  }
`;

const chainId = Number(process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID);

export type Execute = {
  steps?:
    | {
        action: string
        description: string
        status: 'complete' | 'incomplete'
        kind: 'transaction' | 'signature' | 'request' | 'confirmation'
        data?: any
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
 * @param setState Callback to update UI state has execution progresses
 * @returns The data field of the last element in the steps array
 */
export default async function executeSteps(
  url: any,
  signer: Signer,
  setTxn: (hash: string) => void,
  showError: (show: any) => void,
  setSteps: any,
  newJson?: Execute
) {
  try {
    let json = newJson

    if (!json) {
      const res = await fetch(url.href)
      json = (await res.json()) as Execute
    }

    // Update state on first call or recursion
    setSteps(json.steps?.map((step) => step))

    // Handle errors
    if (json.error) throw new Error(json.error)
    if (!json.steps) throw new ReferenceError('There are no steps.')

    const incompleteIndex = json.steps.findIndex(
      ({ status }) => status === 'incomplete'
    )

    // There are no more incomplete steps
    if (incompleteIndex === -1) return json

    let { kind, data } = json.steps[incompleteIndex]

    // Append any extra params provided by API
    if (json.query) setParams(url, json.query)

    // If step is missing data, poll until it is ready
    if (!data) {
      json = (await pollUntilHasData(url, incompleteIndex)) as Execute
      if (!json.steps) throw new ReferenceError('There are no steps.')
      data = json.steps[incompleteIndex].data
    }

    // Handle each step based on it's kind
    switch (kind) {
      // Make an on-chain transaction
      case 'transaction': {
        const tx = await signer.sendTransaction(data)
        console.log(tx.hash);
        setTxn(tx.hash)
        await tx.wait()
        break
      }

      // Sign a message
      case 'signature': {
        let signature: string | undefined

        // Request user signature
        if (data.signatureKind === 'eip191') {
          signature = await signer.signMessage(arrayify(data.message))
        } else if (data.signatureKind === 'eip712') {
          signature = await (signer as unknown as TypedDataSigner)._signTypedData(
            data.domain,
            data.types,
            data.value
          )
        }

        if (signature) {
          // Split signature into r,s,v components
          const { r, s, v } = splitSignature(signature)
          // Include signature params in any future requests
          setParams(url, { r, s, v })
        }

        break
      }

      // Post a signed order object to order book
      case 'request': {
        const postOrderUrl = new URL(data.endpoint, url.origin)
        try {
          await fetch(postOrderUrl.href, {
            method: data.method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data.body),
          })
        } catch (err) {
          throw err
        }
        break
      }

      // Confirm that an on-chain tx has been picked up by indexer
      case 'confirmation': {
        const confirmationUrl: any = new URL(data.endpoint, url.origin)
        await pollUntilOk(confirmationUrl)
        break
      }

      default:
        break
    }

    json.steps[incompleteIndex].status = 'complete'

    await executeSteps(url, signer, setTxn, showError, setSteps, json)

    return true

  } catch (e: any) {
    showError(e.toString());
    console.error(e);
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
  let bpsDivider = BigNumber.from('10000')
  let total = userInput.mul(bpsDivider).div(bpsDivider.sub(BigNumber.from(bps)))
  let fee = total.sub(userInput)

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

export const SoftLink = styled.a`
  text-decoration: none;
`;

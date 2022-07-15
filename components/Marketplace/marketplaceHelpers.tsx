import { TypedDataSigner } from '@ethersproject/abstract-signer';
import { Weth } from "@reservoir0x/sdk/dist/common/helpers";
import { BigNumber, constants, Signer } from "ethers";
import { arrayify, splitSignature } from "ethers/lib/utils";
import { ResponsivePixelImg } from "../../components/ResponsivePixelImg";
import { formatBN } from "../../lib/numbers";
import setParams from "../../lib/params";
import { COMMUNITY_CONTRACTS, CONTRACTS } from "./marketplaceConstants";
import { pollUntilHasData, pollUntilOk } from '../../lib/pollApi';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';

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
export function traitFormat(trait: string) {
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
    if (trait != 'contractSlug' && trait != 'activity' && trait != 'source') {
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
  let contracts = contract in CONTRACTS ? CONTRACTS : COMMUNITY_CONTRACTS;
  
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
        <a href={`https://forgottenrunes.com/lockscreen?tokenSlug=${contracts[contract].display.toLowerCase()}&tokenId=${tokenId}`} className="icon-link" target="_blank">
          <ResponsivePixelImg src="/static/img/icons/social_phone_default.png" />
        </a>
      </SocialItem>
      {contracts[contract].collection == "forgottenruneswizardscult" && (
        <SocialItem>
          <a
            href={`https://forgottenrunes.com/api/art/${contracts[contract].display.toLowerCase()}/${tokenId}.zip`}
            className="icon-link"
            target="_blank"
          >
            <ResponsivePixelImg src="/static/img/icons/social_download_default_w.png" />
          </a>
        </SocialItem>
      )}
      <SocialItem>
        <a
          href={`https://forgottenrunes.com/lore/${contracts[contract].display.toLowerCase()}/${tokenId}/0`}
          className="icon-link"
          target="_blank"
        >
          <ResponsivePixelImg src="/static/img/icons/social_link_default.png" />
        </a>
      </SocialItem>
    </div>
  );
}

export function LoadingCard({ 
  height,
  background,
}: { 
  height: string 
  background: boolean
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        height: height,
        backgroundImage: background ? 'url(/static/img/interior-dark.png)' : 'none',
      }}
    >
      <img
        src="/static/img/marketplace/loading_card.gif"
        style={{ maxWidth: "200px", transform: "translateY(-100%)", }}
      />
    </div>
  );
}

export const SoftLink = styled.a`
  text-decoration: none;
`;

export function numShorten(num: number) {
  return num >= 1000 ? `${(num / 1000).toPrecision(2)}k` : num;
}

/*
* Trait Offer Helpers
*/

// Determine if one trait is selected, enabling trait offer
export function isTraitOffer() {
  const router = useRouter();

  return Object.keys(router.query).length == (2 + Number('source' in router.query) + Number('activity' in router.query));
}

// Get trait selected for trait offer
export function getTrait() {
  const router = useRouter();

  for (const key in router.query) {
    if (!['contractSlug', 'source', 'activity'].includes(key)) {
      return traitFormat(key);
    }
  }

  return '';
}

// Get trait value selected for trait offer
export function getTraitValue() {
  const router = useRouter();

  for (const key in router.query) {
    if (!['contractSlug', 'source', 'activity'].includes(key)) {
      return String(router.query[key]);
    }
  }

  return '';
}

// Get trait value from trait pairs, given trait
export function getValue(attributes: any, trait: string) {
  for (var attribute of attributes) {
    if (attribute.key == trait) {
      return attribute.value;
    }
  }

  return '';
}


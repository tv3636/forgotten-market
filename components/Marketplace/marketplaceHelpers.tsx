import { Weth } from "@reservoir0x/sdk/dist/common/helpers";
import { BigNumber, Signer } from "ethers";
import { COMMUNITY_CONTRACTS, CONTRACTS, NON_TRAITS } from "./marketplaceConstants";
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { hydratePageDataFromMetadata } from "../Lore/markdownUtils";

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

    // Fix for Babies collection
    option.label = option.label.replaceAll('_', ' ');

    result.push(option);
  }
  return result;
}

// Format trait for Reservoir API call
export function traitFormat(trait: string, collection: string) {
  var out = "";
  for (var word of trait.split(' ')) {
    if (word == 'in') {
      out += word + " ";
    } else {
      out += word.charAt(0).toUpperCase() + word.slice(1) + " ";
    }
  }

  // Rinkeby fix / Babies collection fix
  if (
      chainId == 4 && ['Background ', 'Body ', 'Familiar ', 'Head ', 'Prop ', 'Rune '].includes(out) || 
      collection == 'Babies'
    ) {
    out = out.charAt(0).toLowerCase() + out.slice(1);
  }

  return out.slice(0, -1);
}

// Build API parameters from router parameters
export function getURLAttributes(query: any, collection: string) {
  var url_string = "";
  for (var trait of Object.keys(query)) {
    if (trait != 'contractSlug' && trait != 'activity' && trait != 'source') {
      var url_trait = traitFormat(trait, collection).replace("#", "%23");

      if (Array.isArray(query[trait])) {
        for (var selection of query[trait]) {
          console.log(selection);
          url_string += "&attributes[" + url_trait + "]=" + selection.replaceAll(' ', '+');
        }
      } else {
        url_string += "&attributes[" + url_trait + "]=" + query[trait].replaceAll(' ', '+');
      }
    }
  }

  return url_string;
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

  if (getTraitCount() == 1) {
    for (var trait of Object.keys(router.query)) {
      if (!NON_TRAITS.includes(trait) 
        && ((Array.isArray(router.query[trait]) && router.query[trait].length == 1)
        || !Array.isArray(router.query[trait]))) {
        return true;
      }
    }

    return false;
  }
}

// Get count of selected traits in query
export function getTraitCount() {
  const router = useRouter();

  return Object.keys(router.query).length 
    - NON_TRAITS.reduce((prev, current) => {return prev + Number(current in router.query)}, 0);
}

// Get trait selected for trait offer
export function getTrait() {
  const router = useRouter();

  for (const key in router.query) {
    if (!['contractSlug', 'source', 'activity'].includes(key)) {
      return traitFormat(key, String(router.query.contractSlug));
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

export function getContract(contract: string) {
  return contract in CONTRACTS ? CONTRACTS[contract] : COMMUNITY_CONTRACTS[contract];
}

// Get display bid value (price before fees)
export function getDisplayBid(bid: number, contract: string) {
  let feePercent = (10000 - Number(getContract(contract).fee)) / 10000;
  return bid / feePercent;
}

export async function getPages(lore: any, tokenId: any) {
  if (lore.length > 0) {
    var newPages = [];
    for (var lorePage of lore) {
      var thisPage = await hydratePageDataFromMetadata(
        lorePage.loreMetadataURI,
        lorePage.createdAt,
        lorePage.creator,
        tokenId
      );

      if (lorePage.nsfw) {
        newPages.push({ nsfw: true });
      } else {
        newPages.push(thisPage);
      }
    }
    console.log(newPages);
    return newPages;
  }
}


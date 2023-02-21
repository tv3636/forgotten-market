import { COMMUNITY_CONTRACTS, CONTRACTS, ITEM_CONTRACTS, NON_TRAITS } from "./marketplaceConstants";
import styled from '@emotion/styled';
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
export function isTraitOffer(query: any) {

  if (getTraitCount(query) == 1) {
    for (var trait of Object.keys(query)) {
      if (!NON_TRAITS.includes(trait) 
        && ((Array.isArray(query[trait]) && query[trait]?.length == 1)
        || !Array.isArray(query[trait]))) {
        return true;
      }
    }

    return false;
  }
}

// Get count of selected traits in query
export function getTraitCount(query: any) {
  return Object.keys(query).length 
    - NON_TRAITS.reduce((prev, current) => {return prev + Number(current in query)}, 0);
}

// Get trait selected for trait offer
export function getTrait(query: any) {
  for (const key in query) {
    if (!['contractSlug', 'source', 'activity'].includes(key)) {
      return traitFormat(key, String(query.contractSlug));
    }
  }

  return '';
}

// Get trait value selected for trait offer
export function getTraitValue(query: any) {
  for (const key in query) {
    if (!['contractSlug', 'source', 'activity'].includes(key)) {
      return String(query[key]);
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

export function getImage(contract: string, tokenId: number | string, image_url?: string) {
  if (image_url && (contract in ITEM_CONTRACTS || contract == '0x4715be0c5e9bcfe1382da60cff69096af4c4eef4')) {
    return image_url;
  }
  
  let contractDict = getContract(contract);

  return contractDict.display == 'Wizards' ? 
  `${contractDict.image_url}${tokenId}/${tokenId}.png` : 
  contractDict.image_url.indexOf('https://portal.forgottenrunes') == 0 ? 
    `${contractDict.image_url}${tokenId}` :
    `${contractDict.image_url}${tokenId}.png`;
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


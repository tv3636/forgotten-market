import {
  SOULS_ABI,
  WIZARDS_ABI,
  PONIES_ABI,
  INFINITY_VEIL_ABI
} from "../../contracts/abis";

export enum ORDER_TYPE {
  BUY = 'buy',
  SELL = 'sell',
  OFFER = 'offer',
  ACCEPT_OFFER = 'accept offer',
  CANCEL_LISTING = 'cancel listing',
  CANCEL_OFFER = 'cancel offer',
}

export const BURN_ADDRESS = '0x0000000000000000000000000000000000000000';

export const OPENSEA_SOURCE = '0x5b3256965e7c3cf26e11fcaf296dfc8807c01073';
export const LOOKSRARE_SOURCE = '0x5924a28caaf1cc016617874a2f0c3710d881f3c1';
export const FORGOTTEN_MARKET_SOURCE = '0xfdfda3d504b1431ea0fd70084b1bfa39fa99dcc4';
export const X2Y2_SOURCE = '0xdc28ffaea1f91a88fb6fd0a8fe70d71bdd64284c';
export const SUDOSWAP_SOURCE = '0x4749e292ba93ecc24639c5e8dc518c73283ae148';
export const NFTX_SOURCE = '0xe864198328af9d2260e4178734190022fe8d79dc';

export const IPFS_SERVER = 'https://nfts.forgottenrunes.com/ipfs';

export const MARKET_ICONS: any = {
  [OPENSEA_SOURCE]: '/static/img/icons/nav/opensea_default.png',
  [LOOKSRARE_SOURCE]: '/static/img/icons/nav/looksrare_default.png',
  [FORGOTTEN_MARKET_SOURCE]: '/static/img/icons/nav/native_listing.png',
  [X2Y2_SOURCE]: '/static/img/icons/nav/x2y2_default.png',
  [SUDOSWAP_SOURCE]: '/static/img/icons/nav/sudoswap_default.png',
  [NFTX_SOURCE]: '/static/img/icons/nav/nftx_default.png',
}

export const MARKET_ICONS_BY_NAME: any = {
  'Forgotten Market': '/static/img/icons/nav/native_listing.png',
  'OpenSea': '/static/img/icons/nav/opensea_default.png',
  'LooksRare': '/static/img/icons/nav/looksrare_default.png',
  'X2Y2': '/static/img/icons/nav/x2y2_default.png',
  'Buy, Sell, and Swap NFTs Instantly | NFTX': '/static/img/icons/nav/nftx_default.png',
  'sudoswap': '/static/img/icons/nav/sudoswap_default.png',
  'blur.io': '/static/img/icons/nav/blur_default.png'
}

export const MARKETS: any = {
  [FORGOTTEN_MARKET_SOURCE]: {
    image: '/static/img/icons/nav/native_listing.png',
    name: 'Forgotten Market'
  },
  [OPENSEA_SOURCE]: {
    image: '/static/img/icons/nav/opensea_default.png',
    name: 'OpenSea'
  },
  [LOOKSRARE_SOURCE]: {
    image: '/static/img/icons/nav/looksrare_default.png',
    name: 'LooksRare'
  },
  [X2Y2_SOURCE]: {
    image: '/static/img/icons/nav/x2y2_default.png',
    name: 'X2Y2'
  },
  [SUDOSWAP_SOURCE]: {
    image: '/static/img/icons/nav/sudoswap_default.png',
    name: 'Sudoswap'
  },
  [NFTX_SOURCE]: {
    image: '/static/img/icons/nav/nftx_default.png',
    name: 'NFTX'
  }
}

export function sourceReplace(source: any) {
  if (source == 'Sudoswap') {
    return 'sudoswap'
  }

  if (source == 'NFTX') {
    return 'nftx.io'
  }

  return source
}

export const API_BASE_URL: string = "/api/"


export const CHARACTER_CONTRACTS: any = {
  "0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42": {
    collection: "forgottenruneswizardscult",
    display: "Wizards",
    singular: "Wizard",
    full: "Forgotten Runes Wizard's Cult",
    image_url: "https://runes-turnarounds.s3.amazonaws.com/",
    ABI: WIZARDS_ABI,
    fee: '400',
    feeRecipient: '0xfdfda3d504b1431ea0fd70084b1bfa39fa99dcc4',
    coreTraits: ['Head', 'Body', 'Familiar', 'Prop', 'Rune', 'Background'],
  },
  "0x9690b63eb85467be5267a3603f770589ab12dc95": {
    collection: "forgottenruneswarriorsguild",
    display: "Warriors",
    singular: "Warrior",
    full: "Forgotten Runes Warriors Guild",
    image_url: "https://portal.forgottenrunes.com/api/warriors/img/",
    fee: '650',
    feeRecipient: '0x6be88409f2a4751aea05a3a0977cb239904fe0d6',
    coreTraits: ['Head', 'Body', 'Companion', 'Weapon', 'Shield', 'Rune', 'Background'],
  },
  "0x251b5f14a825c537ff788604ea1b58e49b70726f": {
    collection: "forgottensouls",
    display: "Souls",
    singular: "Soul",
    full: "Forgotten Souls",
    image_url: "https://portal.forgottenrunes.com/api/souls/img/",
    ABI: SOULS_ABI,
    fee: '816',
    feeRecipient: '0xCfd61fb650DA1DD7B8f7Bc7aD0d105B40bBD3882',
    coreTraits: ['Undesirable', 'Head', 'Body', 'Familiar', 'Prop', 'Rune', 'Background'],
  },
}

export const MOUNT_CONTRACTS: any = {
  "0xf55b615b479482440135ebf1b907fd4c37ed9420": {
    collection: "forgottenrunesponies",
    display: "Ponies",
    singular: "Pony",
    full: "Forgotten Runes Ponies",
    image_url: "https://portal.forgottenrunes.com/api/shadowfax/img/",
    ABI: PONIES_ABI,
    fee: '594',
    feeRecipient: '0x94F0e012B7BB033F32029FbCC4f1d29ff1CfC30a',
    coreTraits: ['Head', 'Pony', 'Clothes', 'Mouth', 'Rune'],
  },
}

export const ITEM_CONTRACTS: any = {
  "0x31158181b4b91a423bfdc758fc3bf8735711f9c5": {
    collection: "infinityveil",
    display: "Flames",
    singular: "Flame",
    full: "Forgotten Runes Infinity Veil",
    image_url: "/static/img/marketplace/flame/",
    ABI: INFINITY_VEIL_ABI,
    fee: '816',
    feeRecipient: '0xCfd61fb650DA1DD7B8f7Bc7aD0d105B40bBD3882',
  },
  "0x59775fd5f266c216d7566eb216153ab8863c9c84": {
    collection: "nightmareimpstreatboxes",
    display: "Boxes",
    singular: "Box",
    full: "Nightmare Imp's Treat Boxes",
    image_url: "https://portal.forgottenrunes.com/api/halloween/boxes/img/",
    fee: '750',
    feeRecipient: '0xa708b04D686372D3E81536Ad71535F562E746A5a'
  },
  "0x7c104b4db94494688027cced1e2ebfb89642c80f": {
    collection: "athenaeum",
    display: "Treats",
    singular: "Treat",
    full: "Forgotten Runes Athenaeum",
    image_url: "https://portal.forgottenrunes.com/api/treats/img/",
    fee: '750',
    feeRecipient: '0xa708b04D686372D3E81536Ad71535F562E746A5a'
  },
  "0x5f48045f3a1a19ab9985418869f77612cfa752d6": {
    collection: "nightmareimpstricks",
    display: "Tricks",
    singular: "Trick",
    full: "Nightmare Imp's Tricks",
    image_url: "https://portal.forgottenrunes.com/api/tricks/img/",
    fee: '750',
    feeRecipient: '0xa708b04D686372D3E81536Ad71535F562E746A5a'
  },
  "0xda5cf3a42ebacd2d8fcb53830b1025e01d37832d": {
    collection: "forgottenrunesgatetotheseventhrealm",
    display: "Locks",
    singular: "Lock",
    full: "Forgotten Runes Gate to the Seventh Realm",
    image_url: "https://portal.forgottenrunes.com/api/locks/img/",
    fee: '827',
    feeRecipient: '0xa708b04D686372D3E81536Ad71535F562E746A5a'
  },
}

export const BEAST_CONTRACTS: any = {  
  "0x8634c23d5794ed177e9ffd55b22fdb80a505ab7b": {
    collection: "forgottenrunesbeasts",
    display: "Beasts",
    singular: "Beast",
    full: "Forgotten Runes Beasts",
    image_url: "https://portal.forgottenrunes.com/api/beasts/img/",
    fee: '750',
    feeRecipient: '0xa708b04D686372D3E81536Ad71535F562E746A5a'
  },
  
  "0x7de11a2d9e9727fa5ead3094e40211c5e9cf5857": {
    collection: "forgottenrunesbeastspawn",
    display: "Spawn",
    singular: "Spawn",
    full: "Forgotten Runes Beast Spawn",
    image_url: "https://portal.forgottenrunes.com/api/spawn/img/",
    fee: '750',
    feeRecipient: '0xa708b04D686372D3E81536Ad71535F562E746A5a'
  }
}

export const CONTRACTS: any = Object.assign({}, 
  CHARACTER_CONTRACTS, 
  MOUNT_CONTRACTS, 
  BEAST_CONTRACTS, 
  ITEM_CONTRACTS
);

export const COMMUNITY_CONTRACTS: any = {
  "0x5a79182165a2917ef9cccf33f472fe22afffeff8": {
    collection: "wizardsnouns",
    display: "Nouns",
    singular: "Noun",
    full: "Forgotten Runes Wizard's Nouns",
    image_url: "https://www.wizardsnouns.com/nouns/",
    fee: '1000',
    feeRecipient: '0xb11040E5dB5CBb8eD566e6A591a8b9762ee973f8'
  },
  "0x4b1e130ae84c97b931ffbe91ead6b1da16993d45": {
    collection: "babywizards",
    display: "Babies",
    singular: "Baby",
    full: "Forgotten Babies Wizard Orphanage",
    image_url: "http://forgottenbabies.com/uri/json/",
    fee: '500',
    feeRecipient: '0xfdfda3d504b1431ea0fd70084b1bfa39fa99dcc4'
  },
  "0x4bce2bf108599257f84e0b1965631132a579481b": {
    collection: "heroesofcumberland",
    display: "Heroes",
    singular: "Hero",
    full: "Heroes of Cumberland",
    image_url: "https://forgottenbabies.com/cucumdogs/",
    fee: '250',
    feeRecipient: '0x0303ee7033319f99d5486eaabef6e3d685ef89cb',
  },
  "0x4addac15971ab60ead954b8f15a67518730450e0": {
    collection: "forgottenpunks",
    display: "Punks",
    singular: "Punk",
    full: "ForgottenPunks",
    image_url: "https://forgottenpunks.vercel.app/api/img/",
    fee: '750',
    feeRecipient: '0x19dcef0cb5e71c95683bbdf21394f505c4eaece9',
    set: 'a0a37754be08f44a336ac4d8c1748f4af2fc77f7b4576ccadff58623796a63df'
  },
  "0x4715be0c5e9bcfe1382da60cff69096af4c4eef4" : {
    collection: "desert-bestiary",
    display: "Barren Court",
    singular: "Beast",
    full: "The Barren Court: Desert Bestiary",
    image_url: "",
    fee: '500',
    feeRecipient: '0x9b63e090ca2dc9581d24267417ddfc6dbdf12e30'
  },
  "0xf486f696b80164b5943191236eca114f4efab2ff": {
    collection: "blacksandmounts",
    display: "Mounts",
    singular: "Mount",
    full: "BlackSand Mounts",
    image_url: "https://forgottenbabies.com/ponies/",
    fee: '0',
    feeRecipient: '0xb807144c6aa1424657715e7b0f5fadbf9ea22411'
  }
}

export const ALL_CONTRACTS: any = Object.assign({}, CONTRACTS, COMMUNITY_CONTRACTS);

export const LOCATIONS: any = {
  "Cuckoo Land": [5.6, 5.3],
  "Psychic Leap": [5.6, 5.3],
  "Veil": [5.1, 2.85],
  "Bastion": [4.3, 1.9],
  "Realm": [5.3, 0.2],
  "Sacred Pillars": [5.4, -1.85],
  "Tower": [3.4, -3.2],
  "Salt": [2.1, -6.05],
  "Wold": [2.7, -1.2],
  "Lake": [3.95, -0.45],
  "Wild": [2.91, 1.3],
  "Carnival": [1.6, 2.4],
  "Marsh": [0.65, 2.8],
  "Thorn": [0.5, 5.25],
  "Mist": [1.3, 6.9],
  "Toadstools": [3.3, 6.15],
  "Fey": [3.2, 3.6],
  "Quantum Shadow": [-1.05, 6.59],
  "Valley": [-2.2, 6.7],
  "Platonic Shadow": [-3.5, 6.7],
  "Obelisk": [-3.9, 5.2],
  "Oasis": [-4.9, 6.7],
  "Sand": [-5.7, 4.5],
  "Havens": [-3.6, 1.9],
  "Mountain": [-3, 1.45],
  "Riviera": [-3.8, -0.05],
  "Surf": [-4.6, -2.2],
  "Isle": [-4.5, -3.8],
  "Brine": [-3.6, -6.55],
  "Citadel": [-1.9, -5.6],
  "Capital": [0, -5.75],
  "Keep": [-1.9, -2.7],
  "Wood": [1, 0.3],
  "": [404, 404],
};

export const BURN_TRAITS: any = [
  'Transmuted from',
  'Transmuted from number',
  'Burn order',
];

export const BACKGROUND_COLORS: any = {
  "#000000": "black",
  "#09071B": "blue",
  "#120315": "purple",
  "#040D04": "green",
  "#1E0200": "red",
};

export const NON_TRAITS = ['activity', 'contractSlug', 'source'];

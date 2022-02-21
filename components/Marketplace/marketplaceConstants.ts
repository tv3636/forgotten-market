import {
  SOULS_ABI,
  WIZARDS_ABI,
  PONIES_ABI,
  INFINITY_VEIL_ABI
} from "../../contracts/abis";
import { paths } from '../../interfaces/apiTypes';

export enum Status {
  LOADING,
  PROCESSING,
  WRAPPING,
  USER_INPUT,
  APPROVING_WETH,
  APPROVING_TOKEN,
  PROXY_APPROVAL,
  SIGNING,
  SUCCESS,
  FAILURE,
}

export enum ORDER_TYPE {
  BUY = 'buy',
  SELL = 'sell',
  OFFER = 'offer',
  ACCEPT_OFFER = 'accept',
  CANCEL_LISTING = 'cancel_listing',
  CANCEL_OFFER = 'cancel_offer',
}

export interface OrderPaths {
  [ORDER_TYPE.BUY]: paths['/execute/buy']['get']['parameters']['query'],
  [ORDER_TYPE.SELL]: paths['/execute/list']['get']['parameters']['query'],
  [ORDER_TYPE.OFFER]: paths['/execute/bid']['get']['parameters']['query'],
  [ORDER_TYPE.ACCEPT_OFFER]: paths['/execute/sell']['get']['parameters']['query'],
  [ORDER_TYPE.CANCEL_LISTING]: paths['/execute/cancel']['get']['parameters']['query'],
  [ORDER_TYPE.CANCEL_OFFER]: paths['/execute/cancel']['get']['parameters']['query'],
}

export const OrderURLs: any = {
  'buy': 'execute/buy',
  'sell': '/execute/list',
  'offer': '/execute/bid',
  'accept': '/execute/sell',
  'cancel_listing': '/execute/cancel',
  'cancel_offer': '/execute/cancel',
}

export const BURN_ADDRESS = '0x0000000000000000000000000000000000000000';
export const OS_WALLET = '0x5b3256965e7c3cf26e11fcaf296dfc8807c01073';

export const API_BASE_URL: string = Number(process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID) == 1 ?
  "https://mainnet-api-v4.reservoir.tools/" : "https://rinkeby-api-v4.reservoir.tools/";

export const CONTRACTS: any = Number(process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID) == 1 ? {
  "0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42": {
    collection: "forgottenruneswizardscult",
    display: "Wizards",
    singular: "Wizard",
    full: "Forgotten Runes Wizard's Cult",
    image_url: "https://runes-turnarounds.s3.amazonaws.com/",
    ABI: WIZARDS_ABI,
    fee: '350',
    feeRecipient: '0xd584fe736e5aad97c437c579e884d15b17a54a51'
  },
  "0x251b5f14a825c537ff788604ea1b58e49b70726f": {
    collection: "forgottensouls",
    display: "Souls",
    singular: "Soul",
    full: "Forgotten Souls",
    image_url: "https://portal.forgottenrunes.com/api/souls/img/",
    ABI: SOULS_ABI,
    fee: '766',
    feeRecipient: '0xd584fe736e5aad97c437c579e884d15b17a54a51'
  },
  "0xf55b615b479482440135ebf1b907fd4c37ed9420": {
    collection: "forgottenrunesponies",
    display: "Ponies",
    singular: "Pony",
    full: "Forgotten Runes Ponies",
    image_url: "https://portal.forgottenrunes.com/api/shadowfax/img/",
    ABI: PONIES_ABI,
    fee: '544',
    feeRecipient: '0xd584fe736e5aad97c437c579e884d15b17a54a51'
  },
} : {
  "0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42": {
    collection: "forgottenruneswizardscult",
    display: "Wizards",
    singular: "Wizard",
    full: "Forgotten Runes Wizard's Cult",
    image_url: "https://runes-turnarounds.s3.amazonaws.com/",
    ABI: WIZARDS_ABI,
    fee: '350',
    feeRecipient: '0x9ef8286cc70eb94721f994c55875fe6da08c80a0'
  },
  "0x95082b505c0752eef1806aef2b6b2d55eea77e4e": {
    collection: "forgottensouls",
    display: "Souls",
    singular: "Soul",
    full: "Forgotten Souls",
    image_url: "https://portal.forgottenrunes.com/api/souls/img/",
    ABI: SOULS_ABI,
    fee: '766',
    feeRecipient: '0x7761edb1d12b05a0ab2eaa6bb1d4b469aab59205'
  },
  "0x5020c6460b0b26a69c6c0bb8d99ed314f3c39d9e": {
    collection: "forgottenrunesponies",
    display: "Ponies",
    singular: "Pony",
    full: "Forgotten Runes Ponies",
    image_url: "https://portal.forgottenrunes.com/api/shadowfax/img/",
    ABI: PONIES_ABI,
    fee: '544',
    feeRecipient: '0x7d1346757b353a8ff47a3493885d8201f4d24caf'
  }
};

export const LOCATIONS: any = {
  "Cuckoo Land": [5.6, 5.3],
  "Psychic Leap": [5.6, 5.3],
  Veil: [5.1, 2.85],
  Bastion: [4.3, 1.9],
  Realm: [5.3, 0.2],
  "Sacred Pillars": [5.4, -1.85],
  Tower: [3.4, -3.2],
  Salt: [2.1, -6.05],
  Wold: [2.7, -1.2],
  Lake: [3.95, -0.45],
  Wild: [2.91, 1.3],
  Carnival: [1.6, 2.4],
  Marsh: [0.65, 2.8],
  Thorn: [0.5, 5.25],
  Mist: [1.3, 6.9],
  Toadstools: [3.3, 6.15],
  Fey: [3.2, 3.6],
  "Quantum Shadow": [-1.05, 6.59],
  Valley: [-2.2, 6.7],
  "Platonic Shadow": [-3.5, 6.7],
  Obelisk: [-3.9, 5.2],
  Oasis: [-4.9, 6.7],
  Sand: [-5.7, 4.5],
  Havens: [-3.6, 1.9],
  Mountain: [-3, 1.45],
  Riviera: [-3.8, -0.05],
  Surf: [-4.6, -2.2],
  Isle: [-4.5, -3.8],
  Brine: [-3.6, -6.55],
  Citadel: [-1.9, -5.6],
  Capital: [0, -5.75],
  Keep: [-1.9, -2.7],
  Wood: [1, 0.3],
};

export const BACKGROUND: any = {
  'Black': '#000000',
  'Red': '#1E0200',
  'Green': '#040D04',
  'Blue': '#09071B',
}

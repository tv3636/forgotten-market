import {
  SOULS_ABI,
  WIZARDS_ABI,
  PONIES_ABI
} from "../../contracts/abis";

export const API_BASE_URL: string =
  "https://rinkeby-api-v4.reservoir.tools/";

export const CONTRACTS: any = {
  "0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42": {
    collection: "forgottenruneswizardscult",
    display: "Wizards",
    singular: "Wizard",
    image_url: "/api/art/wizards/",
    ABI: WIZARDS_ABI
  },
  "0x251b5f14a825c537ff788604ea1b58e49b70726f": {
    collection: "forgottensouls",
    display: "Souls",
    singular: "Soul",
    image_url: "https://portal.forgottenrunes.com/api/souls/img/",
    ABI: SOULS_ABI
  },
  "0xf55b615b479482440135ebf1b907fd4c37ed9420": {
    collection: "forgottenrunesponies",
    display: "Ponies",
    singular: "Pony",
    image_url: "https://portal.forgottenrunes.com/api/shadowfax/img/",
    ABI: PONIES_ABI
  },
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

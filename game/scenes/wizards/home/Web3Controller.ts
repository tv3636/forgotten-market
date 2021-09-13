import {
  JsonRpcProvider,
  StaticJsonRpcProvider,
  Web3Provider,
} from "@ethersproject/providers";
import events, {
  OnMetamaskConnectedEventArgs,
  OnSiteProviderEventArgs,
} from "../../../events";

export const Web3ControllerEvents = {
  WEB3_CONNECTED: "Web3ControllerEvents/WEB3_CONNECTED",
};

let _web3Controller: Web3Controller;

export class Web3Controller {
  game: Phaser.Game;
  bgScene: Phaser.Scene | undefined;
  buyScene: Phaser.Scene | undefined;
  homeScene: Phaser.Scene | undefined;

  web3Connected: boolean;

  emitter: Phaser.Events.EventEmitter;

  provider: JsonRpcProvider | null;
  injectedProvider: Web3Provider | null;

  constructor({
    game,
    bgScene,
    buyScene,
    homeScene,
  }: {
    game: Phaser.Game;
    bgScene?: Phaser.Scene;
    buyScene?: Phaser.Scene;
    homeScene?: Phaser.Scene;
  }) {
    this.game = game;
    this.bgScene = bgScene;
    this.buyScene = buyScene;
    this.homeScene = homeScene;
    this.web3Connected = false;
    this.emitter = new Phaser.Events.EventEmitter();

    // this should really only exist in MetamaskWatchers, but the loading is weird, so let's give ourselves a little help
    this.provider = new StaticJsonRpcProvider(
      process.env.NEXT_PUBLIC_REACT_APP_NETWORK_URL
    );

    this.injectedProvider = null;
    this.game = game;

    game.events.on(
      events.ON_METAMASK_CONNECTED,
      ({
        provider,
        injectedProvider,
        address,
      }: OnMetamaskConnectedEventArgs) => {
        console.log("metamask connected:", provider, injectedProvider, address);
        this.web3Connected = true;
        this.provider = provider;
        this.injectedProvider = injectedProvider;
        this.emitter.emit(Web3ControllerEvents.WEB3_CONNECTED);
      }
    );

    game.events.on(
      events.ON_SITE_PROVIDER,
      ({ provider }: OnSiteProviderEventArgs) => {
        console.log("we have a provider:", provider);
        this.web3Connected = true;
        this.provider = provider;
      }
    );
  }

  create() {}
}

export function getWeb3Controller(game: Phaser.Game) {
  if (_web3Controller) {
    return _web3Controller;
  } else {
    _web3Controller = new Web3Controller({ game });
    return _web3Controller;
  }
}

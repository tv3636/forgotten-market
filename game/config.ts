import { AsepriteLayersAnimationLoaderPlugin } from "./plugins/asepriteLayersAnimationLoaderPlugin";
import { BootScene } from "./scenes/wizards/boot/BootScene";
import { HomeScene } from "./scenes/wizards/home/HomeScene";
import { BuyScene } from "./scenes/wizards/buy/BuyScene";
import { ShowScene } from "./scenes/wizards/show/ShowScene";
import { InteriorScene } from "./scenes/wizards/interior/InteriorScene";
import WebFontLoaderPlugin from "phaser3-rex-plugins/plugins/webfontloader-plugin";
import TextTypingPlugin from "phaser3-rex-plugins/plugins/texttyping-plugin";

export default {
  pixelArt: true,
  backgroundColor: "007872",

  scene: [BootScene, HomeScene, BuyScene, ShowScene, InteriorScene],

  scale: {
    mode: Phaser.Scale.RESIZE,
    zoom: 1 / window.devicePixelRatio,
    width: "100%",
    height: "100%",
    autoRound: true
  },
  plugins: {
    global: [
      {
        key: "AsepriteLayersAnimationLoaderPlugin",
        plugin: AsepriteLayersAnimationLoaderPlugin,
        start: true,
        mapping: "myAasepriteLoader"
      },
      {
        key: "WebFontLoader",
        plugin: WebFontLoaderPlugin,
        start: true
      },
      {
        key: "rexTextTyping",
        plugin: TextTypingPlugin,
        start: true
      }
    ]
  }
};

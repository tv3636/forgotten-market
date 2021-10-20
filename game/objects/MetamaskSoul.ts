import events from "../events";
import {
  getWeb3Controller,
  Web3ControllerEvents,
} from "../scenes/wizards/home/Web3Controller";

export class MetamaskSoul {
  sprite: any;
  scene: Phaser.Scene | undefined;

  metamaskButtonZone: any;
  constructor() {}
  create({ scene }: { scene: Phaser.Scene }) {
    const self = this;
    this.scene = scene;
    const worldView: Phaser.Geom.Rectangle = scene.cameras.main.worldView;
    const bottomY = worldView.height;
    const centerY = worldView.height / 2;
    const rightX = worldView.width;
    const centerX = worldView.centerX;
    console.log("create");

    (scene as any).myAasepriteLoader?.createFromAsepriteWithLayers("MMFoxSoul");
    console.log("bob");

    const fadeInTime = 500;

    this.sprite = scene.add.sprite(
      centerX,
      centerY - 100,
      "MMFoxSoul",
      `MMFoxSoulWave-0`
    );

    this.sprite.play({
      key: `MMFoxSoulWave-play`,
      delay: 0,
      repeatDelay: 0,
      repeat: -1,
    });
    this.sprite.setAlpha(0);

    // const zoneGraphics = scene.add.graphics();
    // zoneGraphics.strokeRect(centerX - 35, centerY - 140, 70, 70);
    this.metamaskButtonZone = this.scene.add.zone(
      centerX - 35,
      centerY - 140,
      70,
      70
    );
    this.metamaskButtonZone.setOrigin(0, 0);
    this.metamaskButtonZone
      .setInteractive({ useHandCursor: true })
      .on("pointerup", () => {
        console.log("connecting to web3");
        this.connectMetamask();
      });

    const web3Controller = getWeb3Controller(scene.game);
    web3Controller.emitter.on(
      Web3ControllerEvents.WEB3_CONNECTED,
      (evt: any) => {
        console.log("WEB3 Connected");
        self.onConnected();
      }
    );

    scene.tweens.add({
      targets: this.sprite,
      alpha: { value: 1, duration: 2000, ease: "Power1", delay: 500 },
    });

    return this;
  }
  connectMetamask() {
    this.scene?.game.events.emit(events.ON_METAMASK_ATTEMPT_CONNECT, {
      foo: "bar",
    });
  }

  onConnected() {
    if (!this.sprite) return;
    if (!this.scene) return;
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: { value: 0, duration: 500, ease: "Power1" },
    });
    this.scene.time.addEvent({
      delay: 501,
      callback: () => {
        if (this.sprite) {
          this.sprite.destroy();
          this.sprite = null;
        }
      },
    });
  }
}

// const toast = new Toast();
// toast.create({
//   scene: this,
//   message:
//     "Hello there, this is a long error message and unfortunately you're a dummy bye",
//   duration: 3000
// });

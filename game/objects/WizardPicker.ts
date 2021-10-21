import events from "../events";
import {
  getWeb3Controller,
  Web3ControllerEvents,
} from "../scenes/wizards/home/Web3Controller";

export class WizardPicker {
  sprite: any;
  scene: Phaser.Scene | undefined;

  isOpen: boolean = false;

  static preloadStatic(scene: Phaser.Scene) {
    scene.load.aseprite("buttons", "buttons.png", "buttons.json");
    scene.load.image("frame_Display", "frame_Display.png");

    const webfont = {
      custom: {
        families: ["Pixel-NES", "Alagard"],
        urls: ["/static/game/wizards/fonts.css"],
      },
    };
    (scene.load as any).rexWebFont(webfont);
  }

  create({ scene }: { scene: Phaser.Scene }) {
    this.scene = scene;
  }

  open() {
    const scene = this.scene;
    if (!scene) return;

    const width = scene.scale.gameSize.width;
    const height = scene.scale.gameSize.height;
    const centerY = height / 2;
    const worldView = scene.cameras.main.worldView;
    const centerX = worldView.centerX;

    const rayZone = scene.add.zone(
      (width / 2) * -1,
      0,
      width * 3,
      height * 100
    );
    rayZone.setOrigin(0, 0);

    const closeButton = scene.add.sprite(
      centerX + 215,
      130,
      "buttons",
      "button_exit_default.png"
    );
    closeButton.setOrigin(0, 0);
    closeButton.setScale(1);
    closeButton
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        closeButton.setFrame("button_exit_hover.png");
      })
      .on("pointerout", () => {
        closeButton.setFrame("button_exit_default.png");
      })
      .on("pointerdown", () => {
        closeButton.setAlpha(0.6);
      })
      .on("pointerup", () => {
        closeButton.setAlpha(1);
        console.log("clicked");
        // this.dismissScene();
      });

    scene.tweens.add({
      targets: closeButton,
      scale: 1,
      ease: "Back.easeOut",
      duration: 100,
    });

    rayZone
      .setInteractive({ draggable: true, useHandCursor: false })
      .on("pointerup", () => {
        // console.log("drag zone up", this.parentScene);
      })
      .on("drag", (pointer: any, dragX: number, dragY: number) => {
        // console.log("drag zone drag", this.parentScene);
        // const camera = this.cameras.main;
        // camera.scrollY += dragY * 0.5 * -1;
        // camera.scrollY = Math.max(0, camera.scrollY);
      });

    scene.input.on(
      "wheel",
      (
        pointer: any,
        gameObjects: any,
        deltaX: number,
        deltaY: number,
        deltaZ: number
      ) => {
        // const camera = this.cameras.main;
        // camera.scrollY += deltaY * 0.5 * 1;
        // camera.scrollY = Math.max(0, camera.scrollY);
      }
    );
  }

  close() {}
}

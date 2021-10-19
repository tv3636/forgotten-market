import { getWizardsContract } from "../../../../contracts/ForgottenRunesWizardsCultContract";

export class PyreScene extends Phaser.Scene {
  parentScene: Phaser.Scene;

  initialWidth: number = 0;

  numRemaining: number = 9999;
  summonText: any;

  constructor(parentScene: Phaser.Scene) {
    super("PyreScene");
    this.parentScene = parentScene;
  }

  static preloadStatic(scene: Phaser.Scene) {
    scene.load.aseprite("interior", "Interior_v4.png", "Interior_v4.json");

    const webfont = {
      custom: {
        families: ["Pixel-NES", "Alagard"],
        urls: ["/static/game/wizards/fonts.css"],
      },
    };
    (scene.load as any).rexWebFont(webfont);
  }

  preload() {}

  create() {
    const width = this.scale.gameSize.width;
    const height = this.scale.gameSize.height;
    const centerX = Math.floor(this.cameras.main.width / 2);
    const centerY = height / 2;
    this.initialWidth = width; // store for responsive

    (this as any).myAasepriteLoader?.createFromAsepriteWithLayers("interior");
    const bg = this.add.sprite(centerX, centerY, "interior", "BG-0");

    this.updateCamera();
  }

  getProvider() {
    return (this.parentScene as any).getProvider();
  }

  update() {
    if (this.summonText) {
      this.summonText.setText(`${this.numRemaining}`);
    }
  }
  updateCamera() {
    const width = this.scale.gameSize.width;
    const camera = this.cameras.main;
    if (camera) {
      const centerX = camera.width / 2;

      const initialCenterX = this.initialWidth / 2;
      camera.scrollX = (centerX - initialCenterX) * -1;

      if (width < 520) {
        this.cameras.main.setZoom(0.5);
      } else {
        this.cameras.main.setZoom(2);
      }
    }
  }
  resize(gameSize: any, baseSize: any, displaySize: any, resolution: any) {
    this.updateCamera();
  }
  dismissScene() {
    this.parentScene.scene.stop("PyreScene");
  }
}

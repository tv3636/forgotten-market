import { getWizardsContract } from "../../../../contracts/ForgottenRunesWizardsCultContract";

export class InteriorScene extends Phaser.Scene {
  parentScene: Phaser.Scene;

  initialWidth: number = 0;

  numRemaining: number = 9999;
  summonText: any;

  constructor(parentScene: Phaser.Scene) {
    super("InteriorScene");
    this.parentScene = parentScene;
  }

  static preloadStatic(scene: Phaser.Scene) {
    scene.load.aseprite("buttons", "buttons.png", "buttons.json");
    scene.load.aseprite("interior", "Interior_v4.png", "Interior_v4.json");

    const webfont = {
      custom: {
        families: ["Pixel-NES", "Alagard"],
        urls: ["/static/game/wizards/fonts.css"]
      }
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
    console.log("bg: ", bg);

    const beamSolid = this.add.sprite(
      centerX,
      centerY,
      "interior",
      "beamSolid-0"
    );

    const rays01 = this.add.sprite(centerX, centerY, "interior", "rays01-0");
    rays01.setAlpha(0.5);
    const rays02 = this.add.sprite(centerX, centerY, "interior", "rays02-0");
    rays02.setAlpha(0.5);

    this.tweens.add({
      targets: rays01,
      alpha: { value: 1, duration: 1800, ease: "Power1" },
      yoyo: true,
      repeat: -1
    });

    this.tweens.add({
      targets: rays02,
      alpha: { value: 1, duration: 2700, ease: "Power1" },
      yoyo: true,
      repeat: -1
    });

    this.setupWizardsRemaining();

    const dice = this.add.sprite(centerX, centerY, "interior", "dice-0");
    dice.play({ key: "dice-dicePlay", repeat: -1 });

    const rayZone = this.add.zone(0, 0, width, height * 100);
    rayZone.setOrigin(0, 0);
    rayZone
      .setInteractive({ draggable: true, useHandCursor: false })
      .on("pointerup", () => {
        console.log("close zone", this.parentScene);
        this.dismissScene();
      });

    this.updateCamera();
  }

  async setupWizardsRemaining() {
    const width = this.scale.gameSize.width;
    const height = this.scale.gameSize.height;
    const centerX = Math.floor(this.cameras.main.width / 2);
    const centerY = height / 2;

    this.summonText = this.add.text(centerX, centerY + 80, "....", {
      fontFamily: "Pixel-NES",
      fontSize: "34px",
      color: "#E1DECD",
      metrics: {
        fontSize: 35,
        ascent: 34,
        descent: 1
      }
    });
    // console.log("interior", this.summonText.getTextMetrics());

    this.summonText.scale = 0.5;
    this.summonText.setOrigin(0.5, 0.5);
    this.summonText.depth = 4;

    const provider = this.getProvider();
    const contract = getWizardsContract({ provider });

    const MAX_WIZARDS = 10000;

    const summonTextTween = this.tweens.add({
      targets: this.summonText,
      alpha: { value: 0.1, duration: 800, ease: "Power1" },
      yoyo: true,
      repeat: -1
    });

    const self = this;
    async function updateSupply() {
      let totalSupply = await contract.totalSupply();
      self.numRemaining = Math.max(MAX_WIZARDS - totalSupply, 0);
      if (summonTextTween) {
        self.summonText.setAlpha(1);
        summonTextTween.stop();
      }
    }
    setInterval(updateSupply, 5000);
    updateSupply();
  }

  getProvider() {
    console.log("this.parentScene: ", this.parentScene);
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
    this.parentScene.scene.stop("InteriorScene");
  }
}

import { keyBy } from "lodash";
import { getWizardsContract } from "../../../../contracts/ForgottenRunesWizardsCultContract";
import { linearmap } from "../../../gameUtils";
import { MetamaskSoul } from "../../../objects/MetamaskSoul";
import { WizardPicker } from "../../../objects/WizardPicker";
import { ShowScene } from "../show/ShowScene";
import { BurnModal } from "./BurnModal";

const BREAKPOINT = 768;

export class PyreScene extends Phaser.Scene {
  parentScene: Phaser.Scene;

  initialWidth: number = 0;

  numRemaining: number = 9999;
  summonText: any;

  sprites: any;

  // wizardPicker: WizardPicker;
  showScene: any;

  burnModal: BurnModal | undefined;

  constructor(parentScene: Phaser.Scene) {
    super("PyreScene");
    this.parentScene = parentScene;
  }

  static preloadStatic(scene: Phaser.Scene) {}

  preload() {
    this.load.path = "/static/game/wizards/";

    this.load.aseprite(
      "SoulsInterior",
      "souls/SoulsInterior3.png",
      "souls/SoulsInterior3.json"
    );
    this.load.aseprite(
      "MMFoxSoul",
      "souls/MMFoxSoul.png",
      "souls/MMFoxSoul.json"
    );
    this.load.atlas(
      "soulsUI",
      "souls/ui/souls-ui.png",
      "souls/ui/souls-ui.json"
    );

    const webfont = {
      custom: {
        families: ["Pixel-NES", "Alagard"],
        urls: ["/static/game/wizards/fonts.css"],
      },
    };
    (this.load as any).rexWebFont(webfont);

    // WizardPicker.preloadStatic(this);
    ShowScene.preloadStatic(this);
  }

  create() {
    const width = this.scale.gameSize.width;
    const height = this.scale.gameSize.height;
    const centerY = height / 2;
    const worldView = this.cameras.main.worldView;
    const centerX = worldView.centerX;

    this.scale.on("resize", this.resize, this);

    this.initialWidth = width; // store for responsive

    (this as any).myAasepriteLoader?.createFromAsepriteWithLayers(
      "SoulsInterior"
    );

    const floor = this.add.sprite(centerX, centerY, "SoulsInterior", "BG-0");

    const layers = [
      "BG",
      "columns_red",
      "circuits",
      "Fire_Large",
      "ray",
      "pyre",
      "bottomTile",
      "Glow_01",
      "room_hiLit",
      "candleFlames",
      "glow_candle",
      "fireSmall_2",
      "wood_01",
      "fireSmall_1",
      "wood_02",
      "Glow_02",
      "flameBurst",
      "ExplodeBits",
      "Glow_03",
      "vignette",
    ];

    const soulsLayersByName = keyBy(
      this.game.cache.json.get("SoulsInterior").meta.layers,
      "name"
    );

    this.sprites = layers.reduce((acc: any, name: string) => {
      const sprite = this.add.sprite(
        centerX,
        centerY,
        "SoulsInterior",
        `${name}-0`
      );
      acc[name] = sprite;

      const layerMeta = soulsLayersByName[name];
      if (layerMeta?.opacity !== 255) {
        const alphaValue = linearmap(layerMeta.opacity, 0, 255, 0, 1);
        // console.log("alpha", name, alphaValue);
        // for some reason our value needs scaled up a bit
        sprite.setAlpha(alphaValue * 1.3);
      }
      if (layerMeta?.blendMode === "lighten") {
        sprite.blendMode = Phaser.BlendModes.LIGHTEN;
      }

      return acc;
    }, {});

    this.startIdle();

    let metamaskSoul = new MetamaskSoul();
    metamaskSoul = metamaskSoul.create({ scene: this });
    metamaskSoul.onConnect = () => {
      this.openWizardPicker();
    };

    this.burnModal = new BurnModal({ scene: this });

    this.burnModal.show({ wizardId: 0 });

    // this.wizardPicker = new WizardPicker();
    // this.wizardPicker.create({ scene: this });

    // // TMP
    // / this.wizardPicker.open();
    // this.openWizardPicker();

    this.updateCamera();
  }

  getProvider() {
    return (this.parentScene as any).getProvider();
  }

  startIdle() {
    const { ray } = this.sprites;
    ray.setAlpha(0);

    const hides = [
      "Fire_Large",
      "ray",
      "room_hiLit",
      "flameBurst",
      "ExplodeBits",
      "vignette",
    ];
    hides.forEach((hideName) => {
      this.sprites[hideName].setAlpha(0);
    });

    const plays = [
      "Glow_01",
      "candleFlames",
      "fireSmall_2",
      "fireSmall_1",
      "Glow_02",
      "Glow_03",
    ];
    plays.forEach((playName) => {
      this.sprites[playName].play({
        key: `${playName}-play`,
        delay: 0,
        repeatDelay: 0,
        repeat: -1,
      });
    });
  }

  update() {
    // if (this.summonText) {
    //   this.summonText.setText(`${this.numRemaining}`);
    // }
  }
  updateCamera() {
    const width = this.scale.gameSize.width;
    const height = this.scale.gameSize.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const camera = this.cameras.main;
    const desktop = this.scale.gameSize.width >= BREAKPOINT;
    const mobile = !desktop;

    if (camera) {
      const centerX = camera.width / 2;

      const initialCenterX = this.initialWidth / 2;
      camera.scrollX = (centerX - initialCenterX) * -1;

      if (width < BREAKPOINT) {
        camera.scrollY = 250;
        this.cameras.main.setZoom(1);
      } else {
        camera.scrollY = 75;
        this.cameras.main.setZoom(1.5);
      }
    }
  }
  resize(gameSize: any, baseSize: any, displaySize: any, resolution: any) {
    console.log("resize");
    this.updateCamera();

    if (this.showScene) {
      this.showScene.resize(gameSize, baseSize, displaySize, resolution);
    }
  }
  dismissScene() {
    this.parentScene.scene.stop("PyreScene");
  }

  openWizardPicker() {
    const self = this;
    const onWizardPicked = ({ nftId }: { nftId: any }) => {
      console.log("wizard: ", nftId);
      self.scene.stop("ShowScene");
      self.burnModal?.show();
    };

    // TMP
    // setTimeout(() => {
    //   onWizardPicked({ nftId: 0 });
    // }, 2000);

    const showSceneOpts = {
      onWizardPicked,
      showSocials: false,
      addSelectButton: ({
        scene,
        container,
        nftId,
      }: {
        scene: Phaser.Scene;
        container: any;
        nftId: any;
      }) => {
        const summonButton = scene.add.sprite(
          0,
          110,
          "soulsUI",
          "pick_default.png"
        );
        summonButton.setOrigin(0.5, 0);
        summonButton.setScale(1);
        summonButton
          .setInteractive({ useHandCursor: true })
          .on("pointerover", () => {
            summonButton.setFrame("pick_hover.png");
          })
          .on("pointerout", () => {
            summonButton.setFrame("pick_default.png");
          })
          .on("pointerdown", () => {
            summonButton.setAlpha(0.6);
          })
          .on("pointerup", () => {
            summonButton.setAlpha(1);
            onWizardPicked({ nftId });
          });

        container.add(summonButton);
      },
    };

    if (this.showScene) {
      this.scene.launch("ShowScene", showSceneOpts);
    } else {
      this.scene.launch("ShowScene", showSceneOpts);
      this.showScene = this.scene.get("ShowScene");
      this.showScene.parentScene = this;
    }
  }
}

import { keyBy } from "lodash";
import { IMAGE_NOBG_BASE_URL } from "../../../../constants";
import { getWizardsContract } from "../../../../contracts/ForgottenRunesWizardsCultContract";
import { linearmap } from "../../../gameUtils";
import { BurningWizardSprite } from "../../../objects/BurningWizardSprite";
import { ImageButton } from "../../../objects/ImageButton";
import { MetamaskSoul } from "../../../objects/MetamaskSoul";
import { Toast } from "../../../objects/Toast";
import { WizardPicker } from "../../../objects/WizardPicker";
import { ShowScene } from "../show/ShowScene";
import { BurnModal } from "./BurnModal";
import { BurnWarningModal } from "./BurnWarningModal";

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

  metamaskSoul: MetamaskSoul | undefined;
  container: any;

  pendingText: any;

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

    this.load.audio("burn_loop", "souls/audio/burn_loop.mp3");
    this.load.audio("angelic_chord", "souls/audio/angelic_chord.mp3");
    this.load.audio("explosion", "souls/audio/explosion.mp3");

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

    const music = this.sound.add("burn_loop");
    music.play({ loop: true });

    this.scale.on("resize", this.resize, this);
    this.initialWidth = width; // store for responsive
    this.updateCamera();

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

    let metamaskSoul = new MetamaskSoul({
      onConnect: () => {
        console.log("metamaskSoul onConnect");
        this.openWizardPicker();
      },
    });
    this.metamaskSoul = metamaskSoul.create({ scene: this });

    this.burnModal = new BurnModal({ scene: this });
    this.burnModal.onBurnInitiated = ({ hash, wizardId }) => {
      console.log("hash, wizardId: ", hash, wizardId);
      this.burnModal?.hide();
      this.metamaskSoul?.hide();

      this.time.addEvent({
        delay: 1500,
        callback: () => {
          this.playExplosion();
          this.showConfirmingSoul({ wizardId: wizardId });
          this.addEtherscanPendingMessage({ hash });
        },
      });
    };

    this.burnModal.onBurnConfirmed = ({ hash, wizardId }) => {
      console.log("hash, wizardId: ", hash, wizardId);
      this.hideEtherscanPendingMessage();
      // ---------------
      // TODO right here
      // --------------
      // hide your burning wizard
      // now show the soul
    };
    this.burnModal.onBurnError = ({ hash, wizardId }) => {
      console.log("hash, wizardId: ", hash, wizardId);
      // hide your burning wizard
    };

    (this.cameras.main as any).preRender(1);
    this.updateCamera();

    // const warningModal = new BurnWarningModal({ scene: this });
    // warningModal.show({ wizardId: 72 });
    // warningModal.onComplete = () => {
    //   console.log("on complete");
    //   warningModal.hide();
    // };

    // TMP
    // this.burnModal.show({ wizardId: 78 });
    // this.wizardPicker = new WizardPicker();
    // this.wizardPicker.create({ scene: this });
    this.updateCamera();

    // // TMP
    // / this.wizardPicker.open();
    // this.openWizardPicker();

    // setTimeout(() => {
    //   const toast = new Toast();
    //   toast.create({
    //     scene: this,
    //     message: "Testing toast",
    //     duration: 3000,
    //     color: "#ffffff",
    //   });
    // }, 100);

    const testButton = new ImageButton(
      this,
      centerX - 400,
      centerY + 200,
      "soulsUI",
      "yes_default.png",
      "yes_hover.png",
      ({ btn }: { btn: ImageButton }) => {
        console.log("yes");
        this.metamaskSoul?.hide();
        this.playExplosion();
        this.showConfirmingSoul({ wizardId: 44 });
      }
    );
    testButton.setScale(0.5);
    this.add.existing(testButton);

    const testButton2 = new ImageButton(
      this,
      centerX - 400,
      centerY + 240,
      "soulsUI",
      "no_default.png",
      "no_hover.png",
      ({ btn }: { btn: ImageButton }) => {
        console.log("no");
      }
    );
    testButton2.setScale(0.5);
    this.add.existing(testButton2);

    // this.showConfirmingSoul();
    // this.addEtherscanPendingMessage({ hash: "abc123" });
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
      // "vignette",
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
      // "vignette",
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

  playExplosion() {
    const shakeDuration = 750;
    const shakeVector = new Phaser.Math.Vector2(0.0005, 0);
    this.cameras.main.shake(shakeDuration, shakeVector);

    const explosion = this.sound.add("explosion");
    explosion.play({ volume: 5 });

    const playsOnce = ["vignette", "room_hiLit", "flameBurst", "ExplodeBits"];
    playsOnce.forEach((playName) => {
      this.sprites[playName].setAlpha(1);
      this.sprites[playName].play({
        key: `${playName}-play`,
        delay: 0,
        repeatDelay: 0,
        repeat: 0,
      });
    });

    const playsLoop = ["Fire_Large"];
    playsLoop.forEach((playName) => {
      this.sprites[playName].setAlpha(1);
      this.sprites[playName].play({
        key: `${playName}-play`,
        delay: 0,
        repeatDelay: 0,
        repeat: -1,
      });
    });
  }

  showConfirmingSoul({ wizardId }: { wizardId: number }) {
    const width = this.scale.gameSize.width;
    const height = this.scale.gameSize.height;
    const centerY = height / 2;
    const worldView = this.cameras.main.worldView;
    const centerX = worldView.centerX;

    // add ray
    this.tweens.add({
      targets: this.sprites["ray"],
      alpha: { value: 0.6, duration: 500, ease: "Power1" },
    });

    BurningWizardSprite.fromWizardId({
      scene: this,
      wizardId,
      cb: ({ sprite }: { sprite: BurningWizardSprite }) => {
        this.add.existing(sprite);
        sprite.setScale(0.33);
        sprite.setOrigin(0.5, 0.5);
        sprite.setPosition(centerX, centerY - 120);
        sprite.playBurn();

        this.tweens.add({
          targets: sprite,
          alpha: { value: 0.2, duration: 1400, ease: "Power1" },
          delay: 0,
          yoyo: true,
          repeat: -1,
        });
      },
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
    // const camera = this.cameras.main;
    const desktop = this.scale.gameSize.width >= BREAKPOINT;
    const mobile = !desktop;

    if (this.cameras.main) {
      const centerX = this.cameras.main.width / 2;

      const initialCenterX = this.initialWidth / 2;
      this.cameras.main.scrollX = (centerX - initialCenterX) * -1;

      if (width < BREAKPOINT) {
        this.cameras.main.scrollY = 250;
        this.cameras.main.setZoom(1);
      } else {
        this.cameras.main.scrollY = 75;
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
      self.burnModal?.show({ wizardId: nftId });
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

  addEtherscanPendingMessage({ hash }: { hash: string }) {
    const width = this.scale.gameSize.width;
    const height = this.scale.gameSize.height;
    const centerY = height / 2;
    const worldView = this.cameras.main.worldView;
    const centerX = worldView.centerX;

    this.pendingText = this.make.text({
      x: 0,
      y: 0,
      text: "Pending. View on Etherscan...",
      style: {
        fontFamily: "Alagard",
        fontSize: "16px",
        color: "#E1DECD",
        wordWrap: { width: 220 },
        align: "center",
        metrics: {
          fontSize: 20,
          ascent: 15,
          descent: 2,
        },
      },
    });
    this.pendingText.setOrigin(0.5, 0.5);
    this.pendingText.setPosition(centerX, centerY + 270);
    this.add.existing(this.pendingText);

    this.pendingText
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        this.pendingText.setAlpha(0.8);
      })
      .on("pointerout", () => {
        this.pendingText.setAlpha(1);
      })
      .on("pointerdown", () => {
        this.pendingText.setAlpha(0.6);
      })
      .on("pointerup", () => {
        this.pendingText.setAlpha(1);
        const etherscanURL = `${process.env.NEXT_PUBLIC_REACT_APP_BLOCK_EXPLORER}/tx/${hash}`;
        window.open(etherscanURL, "_blank");
      });

    this.tweens.add({
      targets: this.pendingText,
      alpha: { value: 0.2, duration: 1400, ease: "Linear" },
      delay: 0,
      yoyo: true,
      repeat: -1,
    });
  }

  hideEtherscanPendingMessage() {
    if (this.pendingText) {
      this.pendingText.destroy();
      this.pendingText = null;
    }
  }
}

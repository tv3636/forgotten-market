import { parseEther } from "@ethersproject/units";
import { getWizardsContract } from "../../../../contracts/ForgottenRunesWizardsCultContract";
import { fixHackyBraveText } from "../../../gameUtils";
import { ImageButton } from "../../../objects/ImageButton";
import { Toast } from "../../../objects/Toast";
import { getWeb3Controller } from "../home/Web3Controller";
import { BuyButtonRow } from "./buyButtonRow";

export const PRICE = parseEther("0.07");
export class BuyScene extends Phaser.Scene {
  parentScene: Phaser.Scene;
  initialWidth: number = 0;

  constructor(parentScene: Phaser.Scene) {
    super("BuyScene");
    this.parentScene = parentScene;
  }

  static preloadStatic(scene: Phaser.Scene) {
    scene.load.aseprite("buttons", "buttons.png", "buttons.json");
    scene.load.image("frame_purchase", "frame_purchase.png");
    scene.load.image("frame_Display", "frame_Display.png");
    scene.load.image("frame_YouHaveNo", "frame_YouHaveNo.png");

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

    const rayZone = this.add.zone(0, 0, width, height);
    rayZone.setOrigin(0, 0);

    const frame = this.add.sprite(centerX, 70, "frame_purchase");
    frame.setOrigin(0.5, 0);
    frame.setScale(0.8);
    frame.setInteractive({ useHandCursor: false });

    this.tweens.add({
      targets: frame,
      scale: 1,
      ease: "Back.easeOut",
      duration: 100,
    });

    const closeButton = this.add.sprite(
      centerX + 265,
      75,
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
        this.dismissBuyScene();
      });

    this.tweens.add({
      targets: closeButton,
      scale: 1,
      ease: "Back.easeOut",
      duration: 100,
    });

    rayZone.setInteractive({ useHandCursor: false }).on("pointerup", () => {
      console.log("close zone", this.parentScene);
      this.dismissBuyScene();
    });

    //
    const summonText = this.add.text(100, 0, "Summon Wizards?", {
      fontFamily: "Pixel-NES",
      fontSize: "27px",
      color: "#E1DECD",
      metrics: {
        fontSize: 28,
        ascent: 27,
        descent: 1,
      },
    });
    console.log("summon wizards", summonText.getTextMetrics());

    summonText.setOrigin(0, 0.5);
    summonText.setPosition(centerX - 155, 89);

    const rexTextTyping = this.plugins.get("rexTextTyping") as any;
    if (rexTextTyping) {
      const typing = rexTextTyping.add(summonText, {
        speed: 45,
      });
      typing.start("Summon Wizards?");
    }

    let buy1 = new BuyButtonRow({
      scene: this,
      baseY: 190,
      baseName: "button1",
      displayPrice: "0.07",
      priceDelay: 300,
      onClick: () => {
        console.log("you clicked button one");
        this.initiateBuy({ howMany: 1 });
      },
    });

    let buy2 = new BuyButtonRow({
      scene: this,
      baseY: 290,
      baseName: "button2",
      displayPrice: "0.21",
      priceDelay: 200,
      onClick: () => {
        console.log("you clicked button two");
        this.initiateBuy({ howMany: 3 });
      },
    });

    let buy3 = new BuyButtonRow({
      scene: this,
      baseY: 390,
      baseName: "button3",
      displayPrice: "0.84",
      priceDelay: 100,
      onClick: () => {
        console.log("you clicked button three");
        this.initiateBuy({ howMany: 12 });
      },
    });

    this.time.addEvent({
      delay: 100,
      callback: () => {
        buy1.create();
      },
      startAt: 0,
    });

    this.time.addEvent({
      delay: 200,
      callback: () => {
        buy2.create();
      },
      startAt: 0,
    });

    this.time.addEvent({
      delay: 300,
      callback: () => {
        buy3.create();
      },
      startAt: 0,
    });

    this.updateCamera();
    (this.cameras.main as any).preRender();
    this.checkIfSoldOut();
  }
  update() {}
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
        this.cameras.main.setZoom(1);
      }
    }
  }
  resize(gameSize: any, baseSize: any, displaySize: any, resolution: any) {
    this.updateCamera();
  }

  async initiateBuy({ howMany }: { howMany: number }) {
    const web3Controller = getWeb3Controller(this.game);
    const injectedProvider = web3Controller.injectedProvider;
    if (!injectedProvider) {
      console.log(
        "ERROR: Couldn't find Metamask. This is bad. Real bad. Go back and see the crow."
      );
      const toast = new Toast();
      toast.create({
        scene: this,
        message: "Can't find Metamask",
        duration: 3000,
      });
      return;
    }

    const signer = injectedProvider.getSigner();
    const contract = await getWizardsContract({ provider: injectedProvider });
    const tx = await contract.populateTransaction.summon(howMany, {
      value: PRICE.mul(howMany),
    });

    console.log("signer: ", signer);
    console.log("tx: ", tx);

    const testHash =
      "0x3c45223a26636f694386a9fded56e9bbda8d28634117a5fedf6f0d3a3f495a7b";

    try {
      const txResponse = await signer.sendTransaction(tx);
      console.log("txResponse: ", txResponse);
      const txHash = txResponse.hash;

      // test
      // const txHash = testHash;

      (this.parentScene as any).lastTxHash = txHash;
      this.metamaskSubmitted();
    } catch (err) {
      console.log("err: ", err);
      const toast = new Toast();
      toast.create({
        scene: this,
        message: err.message?.substr(0, 200),
        duration: 3000,
      });
    }
  }

  async checkIfSoldOut() {
    try {
      const web3Controller = getWeb3Controller(this.game);
      const provider = web3Controller.provider;
      const contract = await getWizardsContract({ provider });
      const numMinted = await contract.totalSupply();

      const wizardsRemaining = numMinted && numMinted.lt(10000);
      if (wizardsRemaining) {
        return;
      }

      const width = this.scale.gameSize.width;
      const height = this.scale.gameSize.height;
      const centerX = Math.floor(this.cameras.main.width / 2);
      const centerY = height / 2;

      const frame = this.add.sprite(centerX, 140, "frame_YouHaveNo");
      frame.setOrigin(0.5, 0);
      frame.setScale(0.8);
      frame.setInteractive({ useHandCursor: false });
      frame.setDepth(1);

      const message = "No wizards remain to be summoned";

      const summonText = this.add.text(100, 0, message, {
        fontFamily: "Pixel-NES",
        fontSize: "27px",
        color: "#E1DECD",
        wordWrap: { width: 310 },
        align: "center",
        metrics: {
          fontSize: 24,
          ascent: 24,
          descent: 4,
        },
      });
      // console.log("summon wizards", summonText.getTextMetrics());
      summonText.setOrigin(0.5, 0);
      summonText.setPosition(centerX, 200);
      summonText.depth = 1;

      const rexTextTyping = this.plugins.get("rexTextTyping") as any;
      if (rexTextTyping) {
        const typing = rexTextTyping.add(summonText, {
          speed: 45,
        });
        typing.start(message);
      }

      const openSeaButton = {
        default: "social_opensea_default.png",
        hover: "social_opensea_hover.png",
        cb: () => {
          console.log("opensea");
          const openSeaURL = `https://opensea.io/collection/forgottenruneswizardscult`;
          window.open(openSeaURL, "_blank");
        },
      };

      const socialButton = new ImageButton(
        this,
        centerX,
        350,
        "buttons",
        openSeaButton.default,
        openSeaButton.hover,
        openSeaButton.cb
      );
      socialButton.depth = 1;
      socialButton.setAlpha(0);
      this.add.existing(socialButton);
      this.tweens.add({
        targets: socialButton,
        alpha: { value: 1, duration: 1000, ease: "Power1" },
        delay: 1000,
      });
    } catch (err) {
      console.log("err: ", err);
    }
  }

  metamaskSubmitted() {
    (this.parentScene as any).startSendSummon();
    return this.dismissBuyScene();
  }

  dismissBuyScene() {
    this.parentScene.scene.stop("BuyScene");
  }
}

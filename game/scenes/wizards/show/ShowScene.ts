import { Web3Provider } from "@ethersproject/providers";
import { getWizardsContract } from "../../../../contracts/ForgottenRunesWizardsCultContract";
import { getWeb3Controller } from "../home/Web3Controller";
import { NftCard } from "./NftCard";
import Bluebird from "bluebird";
import { BigNumber } from "ethers/lib/ethers";
import { Toast } from "../../../objects/Toast";
import { fixHackyBraveText, isBraveOnWindows } from "../../../gameUtils";
export class ShowScene extends Phaser.Scene {
  parentScene: Phaser.Scene;

  initialWidth: number = 0;
  constructor(parentScene: Phaser.Scene) {
    super("ShowScene");
    this.parentScene = parentScene;
  }

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

  preload() {}

  create() {
    const width = this.scale.gameSize.width;
    const height = this.scale.gameSize.height;
    const worldView = this.cameras.main.worldView;
    // const width = worldView.width;
    // const height = worldView.height;

    const centerX = Math.floor(this.cameras.main.width / 2);
    const centerY = height / 2;
    this.initialWidth = width; // store for responsive

    // const worldWidth = worldView.width;
    const rayZone = this.add.zone((width / 2) * -1, 0, width * 3, height * 100);
    rayZone.setOrigin(0, 0);

    const closeButton = this.add.sprite(
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
        this.dismissScene();
      });

    this.tweens.add({
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
        const camera = this.cameras.main;
        camera.scrollY += dragY * 0.5 * -1;
        camera.scrollY = Math.max(0, camera.scrollY);
      });

    this.input.on(
      "wheel",
      (
        pointer: any,
        gameObjects: any,
        deltaX: number,
        deltaY: number,
        deltaZ: number
      ) => {
        const camera = this.cameras.main;
        camera.scrollY += deltaY * 0.5 * 1;
        camera.scrollY = Math.max(0, camera.scrollY);
      }
    );
    this.updateCamera();
    // (this.cameras.main as any).preRender();
    this.loadWizards();
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
  dismissScene() {
    this.parentScene.scene.stop("ShowScene");
  }

  showWizards({ indexes }: { indexes: number[] }) {
    const width = this.scale.gameSize.width;
    const height = this.scale.gameSize.height;
    const centerX = Math.floor(this.cameras.main.width / 2);
    const centerY = height / 2;
    const padding = 20;
    const baseTop = 330;

    for (let i = 0; i < indexes.length; i++) {
      // HERE: just pass in the index and have the card load the stuff. it's wizard specific so just go with it
      // const nft = {
      //   address: "abc123",
      //   imageURL: "abc123",
      //   name: "Archmage wizzy of the mountain",
      //   description:
      //     "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting"
      // };
      const card = new NftCard({ scene: this, idx: i, nftId: indexes[i] });
      card.create();
      card.setPosition(
        centerX,
        baseTop + (Math.floor(card.height() / 2) + padding) * i
      );
    }
  }

  async loadWizards() {
    const web3Controller = getWeb3Controller(this.game);

    try {
      const injectedProvider = web3Controller.injectedProvider as Web3Provider;
      const provider = web3Controller.provider;
      const contract = getWizardsContract({ provider });
      const signer = injectedProvider.getSigner();
      const address = await signer.getAddress();
      console.log("address: ", address);
      const tokenIndexes = await contract.tokensOfOwner(address);
      console.log("tokenIndexes: ", tokenIndexes);

      if (tokenIndexes?.length > 0) {
        const maxWizards = 10000;
        // const totalSupply = await contract.totalSupply();

        // just grab the first 200, if you bought more than that use a better tool for now
        // last minute shortcuts
        const maxTokens = 100;
        const wizardIndexes = tokenIndexes
          .map((idx: BigNumber) => idx.toNumber())
          .sort(function (a: number, b: number) {
            return a - b;
          })
          .reverse()
          .slice(0, maxTokens);
        console.log("wizardIndexes: ", wizardIndexes);

        // https://nftz.forgottenrunes.com/wizards-staging/0.png

        this.showSummonAgain();

        this.showWizards({ indexes: wizardIndexes });
      } else {
        // you have no
        //
        this.showYouHaveNoWizards();
      }
    } catch (err) {
      console.log("err: ", err);
      const toast = new Toast();
      toast.create({
        scene: this,
        message: err.message?.substr(0, 200),
        duration: 3000,
      });
      this.showYouHaveNoWizards();
    }

    // fetch all their wizards

    // if they have none, say none
    // show what they have, ordered by most recent
  }

  showYouHaveNoWizards() {
    const scene = this;
    const width = scene.scale.gameSize.width;
    const height = scene.scale.gameSize.height;
    const centerX = Math.floor(scene.cameras.main.width / 2);
    const centerY = height / 2;
    const frame = scene.add.sprite(centerX, 50, "frame_Display");
    frame.setScale(0.5);
    frame.setOrigin(0.5, 0);
    frame.setInteractive({ useHandCursor: false });
    // name

    const message = "You have no Wizards.\n\nConnect your wallet?";
    const summonText = scene.make.text({
      x: centerX,
      y: 20,
      text: message,
      style: {
        fontFamily: "Alagard",
        fontSize: "20px",
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
    summonText.setOrigin(0.5, 0.5);
    summonText.setPosition(centerX, 100);
    scene.add.existing(summonText);

    const rexTextTyping = scene.plugins.get("rexTextTyping") as any;
    if (rexTextTyping) {
      const typing = rexTextTyping.add(summonText, {
        speed: 45,
      });
      typing.start(message);
    }
  }

  showSummonAgain() {
    const centerX = Math.floor(this.cameras.main.width / 2);
    //
    const summonButton = this.add.sprite(
      centerX,
      55,
      "buttons",
      "summonmore_default.png"
    );
    summonButton.setOrigin(0.5, 0);
    summonButton.setScale(1);
    summonButton
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        summonButton.setFrame("summonmore_rollover.png");
      })
      .on("pointerout", () => {
        summonButton.setFrame("summonmore_default.png");
      })
      .on("pointerdown", () => {
        summonButton.setAlpha(0.6);
      })
      .on("pointerup", () => {
        summonButton.setAlpha(1);
        console.log("summon more");
        this.dismissScene();
        (this.parentScene as any).launchBuyScene();
      });
  }
}

// read the metadata?
// https://nfts.forgottenrunes.com/ipfs/QmeqUHR11xw9mqxpnmX7AJXaadBanr61GfXxkBPBfBpr1j/0.png
// https://nftz.forgottenrunes.com/test/0.png
// https://nftz.forgottenrunes.com/wizards-staging/0.png

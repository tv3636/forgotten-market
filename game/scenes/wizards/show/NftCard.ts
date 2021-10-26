import { ImageButton } from "./../../../objects/ImageButton";
import { frame } from "web3modal/dist/providers/connectors";
import { WizardNFT } from "./../../../gameTypes";

import stagingWizardData from "../../../../data/nfts-staging.json";
import productionWizardData from "../../../../data/nfts-prod.json";
import { fixHackyBraveText, isBraveOnWindows } from "../../../gameUtils";

const nftData: {
  [nftId: string]: { name: string; image: string; background_color: string };
} =
  process.env.NEXT_PUBLIC_REACT_APP_NFT_ENV === "staging"
    ? stagingWizardData
    : productionWizardData;

export class NftCard {
  scene: Phaser.Scene;
  // nft: WizardNFT;
  nftId: number;
  container: any;
  frame: any;

  onNftPicked: any;
  showSocials: boolean = true;

  addSelectButton: any;
  idx: number;
  constructor({
    nftId,
    scene,
    idx,
    onNftPicked,
    showSocials,
    addSelectButton,
  }: {
    nftId: number;
    scene: Phaser.Scene;
    idx: number;
    showSocials: boolean;
    onNftPicked?: any;
    addSelectButton?: any;
  }) {
    this.nftId = nftId;
    this.scene = scene;
    this.idx = idx;
    this.onNftPicked = onNftPicked;
    this.showSocials = showSocials;
    this.addSelectButton = addSelectButton;
  }

  create() {
    const scene = this.scene;
    const width = scene.scale.gameSize.width;
    const height = scene.scale.gameSize.height;
    const centerX = Math.floor(scene.cameras.main.width / 2);
    const centerY = height / 2;
    const zoom = this.scene?.cameras?.main?.zoom || 1;

    this.container = scene.add.container(0, 0);
    this.container.setScale(0.8);

    const frame = scene.add.sprite(0, 0, "frame_Display");
    frame.setScale(0.5);
    frame.setOrigin(0.5, 0.5);
    frame.setInteractive({ useHandCursor: false });
    this.frame = frame;
    this.container.add(frame);

    scene.tweens.add({
      targets: this.container,
      scale: 1,
      ease: "Back.easeOut",
      duration: 100,
      delay: this.idx * 100,
    });

    const nftName = nftData[this.nftId?.toString()]?.name + ` (#${this.nftId})`;
    const nftNameUp = nftName.toUpperCase();

    // name
    const summonText = scene.make.text({
      x: 100,
      y: 0,
      text: nftNameUp,
      style: {
        fontFamily: "Alagard",
        fontSize: Math.floor(20 * zoom) + "px",
        color: "#E1DECD",
        wordWrap: { width: 210 * zoom },
        align: "center",
        metrics: {
          fontSize: 20 * zoom,
          ascent: 15 * zoom,
          descent: 2 * zoom,
        },
      },
    });
    summonText.setScale(1 / zoom);
    summonText.setOrigin(0.5, 0.5);
    summonText.setPosition(0, -155);
    this.container.add(summonText);

    const rexTextTyping = scene.plugins.get("rexTextTyping") as any;
    if (rexTextTyping) {
      const typing = rexTextTyping.add(summonText, {
        speed: 45,
      });
      typing.start(nftNameUp);
    }

    // load the image
    const nftImageUrl =
      process.env.NEXT_PUBLIC_REACT_APP_WIZARDS_WEB_IMG_BASE_URL +
      `/${this.nftId}.png`;

    const wizardImageKey = `wizard:${this.nftId}`;

    scene.load.image(wizardImageKey, nftImageUrl); // add task
    scene.load.once("complete", () => {
      const img = scene.add.sprite(0, 0, wizardImageKey);
      img.setScale(0.5);
      img.setOrigin(0.5, 0.5);

      if (this.onNftPicked) {
        img
          .setInteractive({ useHandCursor: true })
          .on("pointerover", () => img.setAlpha(0.8))
          .on("pointerout", () => img.setAlpha(1))
          .on("pointerdown", () => img.setAlpha(0.5))
          .on("pointerup", () => {
            img.setAlpha(1);
            this.onNftPicked({ nftId: this.nftId });
          });
      }
      this.container.add(img);

      if (this.addSelectButton) {
        this.addSelectButton({
          nftName,
          nftImageUrl,
          nftId: this.nftId,
          scene,
          container: this.container,
        });
      }
    });
    scene.load.start(); // start loading

    // description
    // const descriptionText = scene.make.text({
    //   x: -270,
    //   y: -110,
    //   origin: { x: 0, y: 0 },
    //   text: this.nft.description,
    //   style: {
    //     fontFamily: "Pixel-NES",
    //     fontSize: "14px",
    //     color: "#E1DECD",
    //     wordWrap: { width: 300 }
    //   }
    // });
    // this.container.add(descriptionText);

    // if (rexTextTyping) {
    //   const typing = rexTextTyping.add(descriptionText, {
    //     speed: 1
    //   });
    //   typing.start(this.nft.description);
    // }

    if (this.showSocials) {
      this.createSocials({ nftName, nftImageUrl });
    }
  }

  setPosition(x: number, y: number) {
    this.container.setPosition(x, y);
  }

  height() {
    return this.frame.height;
  }

  createSocials({
    nftName,
    nftImageUrl,
  }: {
    nftName: string;
    nftImageUrl: string;
  }) {
    const baseX = 40;
    const baseY = 140;
    const padding = 2;
    const width = 38;

    const buttons = [
      {
        default: "social_twitter_default.png",
        hover: "social_twitter_hover.png",
        cb: () => {
          console.log("twitter");
          window.open(
            generateTweetLink({ nftName, nftImageUrl, nftId: this.nftId }),
            "_blank"
          );
        },
      },
      // {
      //   default: "social_ig_default.png",
      //   hover: "social_ig_hover.png",
      //   cb: () => {
      //     console.log("ig");
      //   }
      // },
      // {
      //   default: "social_discord_default.png",
      //   hover: "social_discord_hover.png",
      //   cb: () => {
      //     console.log("discord");
      //   }
      // },
      {
        default: "social_opensea_default.png",
        hover: "social_opensea_hover.png",
        cb: () => {
          console.log("opensea");
          const openSeaURL = `https://opensea.io/assets/${process.env.NEXT_PUBLIC_REACT_APP_WIZARDS_CONTRACT_ADDRESS}/${this.nftId}`;
          window.open(openSeaURL, "_blank");
        },
      },
      // {
      //   default: "social_link_default.png",
      //   hover: "social_link_hover.png",
      //   cb: () => {
      //     console.log("link");
      //   }
      // },
      {
        default: "social_download_default.png",
        hover: "social_download_hover.png",
        cb: () => {
          console.log("download");
          const zipURL = `https://nftz.forgottenrunes.com/wizard/${this.nftId}.zip`;
          window.open(zipURL, "_blank");
          // downloadURI(nftImageUrl, `wizard-${this.nftId}.png`);
        },
      },
    ];

    for (let i = 0; i < buttons.length; i++) {
      const btn = buttons[i];

      const socialButton = new ImageButton(
        this.scene,
        -baseX + i * (width + padding),
        baseY,
        "buttons",
        btn.default,
        btn.hover,
        btn.cb
      );
      socialButton.setAlpha(0);
      this.container.add(socialButton);
      this.scene.tweens.add({
        targets: socialButton,
        alpha: { value: 1, duration: 200, ease: "Power1" },
        delay: i * 140,
      });
    }
  }

  // scene.load.image(key, url);   // add task
  // // scene.load.image(config); // config: {key, url}
  // scene.load.once('complete', callback);  // add callback of 'complete' event
  // scene.load.start();                     // start loading
}

function downloadURI(uri: string, name: string) {
  const link = document.createElement("a");
  link.download = name;
  link.target = "_blank";
  link.setAttribute("download", name);
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // delete link;
}

// https://twitter.com/intent/tweet?url=https%3A%2F%2Fpools.fyi%2F%23%2F&text=I%20tweete

function generateTweetLink({
  nftName,
  nftImageUrl,
  nftId,
}: {
  nftName: string;
  nftImageUrl: string;
  nftId: number;
}) {
  const text = `${nftName} has been summoned from the @forgottenrunes`;
  const url = `https://opensea.io/assets/${process.env.NEXT_PUBLIC_REACT_APP_WIZARDS_CONTRACT_ADDRESS}/${nftId}`;

  const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text
  )}&url=${encodeURIComponent(url)}`;
  return intentUrl;
}

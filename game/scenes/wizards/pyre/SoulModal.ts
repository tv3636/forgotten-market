import { SOULS_IMAGES_BASE_URL } from "../../../../constants";
import { ImageButton } from "../../../objects/ImageButton";
import { fetchSoulsMetadataWithRetry } from "../../../portal";

const SECONDS = 1000;

export class SoulModal {
  sprite: any;
  scene: Phaser.Scene | undefined;

  onConnect: any;

  frame: any;

  container: any;

  instructionText: any;

  wizardId: any;
  soulId: any;

  constructor({ scene }: { scene: Phaser.Scene }) {
    this.scene = scene;
  }

  show({ wizardId }: { wizardId: number }) {
    const scene = this.scene;
    if (!scene) return;
    const worldView: Phaser.Geom.Rectangle = scene.cameras.main.worldView;
    const bottomY = worldView.height;
    const centerY = worldView.height / 2;
    const rightX = worldView.width;
    const centerX = worldView.centerX;

    this.addFrame();
    this.addCloseButton();
    this.addInstructionText();
    this.wizardId = wizardId;

    fetchSoulsMetadataWithRetry({
      soulId: this.wizardId,
    }).then((soulData) => {
      // this is more like soulId
      this.addWizardImage({ wizardId });
      const nftTitle = soulData.name;
      this.writeMessage({
        msg: `The Quantum Shadow has returned to you:\n\n${nftTitle}`,
      });
    });

    return this;
  }

  hide() {
    if (this.container) {
      this.scene?.tweens.add({
        targets: this.container,
        alpha: { value: 0, duration: 500, ease: "Power1" },
        delay: 0,
      });

      this.scene?.time.addEvent({
        delay: 500 + 10,
        callback: () => {
          this.container.destroy();
        },
      });
    }
  }

  addWizardImage({ wizardId }: { wizardId: number }) {
    const scene = this.scene;
    if (!scene) return;
    const angels = scene.sound.add("angelic_chord");
    const nftImageUrl = `${SOULS_IMAGES_BASE_URL}${wizardId}`;
    console.log(nftImageUrl);
    const wizardImageKey = `soul:${wizardId}`;
    scene.load.image(wizardImageKey, nftImageUrl); // add task
    scene.load.once("complete", () => {
      const img = scene.add.sprite(0, -50, wizardImageKey);
      img.setScale(0.6);
      img.setOrigin(0.5, 0);
      img.setAlpha(0);
      this.scene?.tweens.add({
        targets: img,
        alpha: { value: 1, duration: 2000, ease: "Power1" },
        delay: 3500,
      });
      this.scene?.time.addEvent({
        delay: 3500,
        callback: () => {
          angels.play({ volume: 2 });
        },
      });
      this.container.add(img);
      this.addOpenSeaButton({ soulId: wizardId });
    });
    scene.load.start(); // start loading
  }

  addOpenSeaButton({ soulId }: { soulId: number }) {
    const openSeaButton = {
      default: "social_opensea_default.png",
      hover: "social_opensea_hover.png",
      cb: () => {
        console.log("opensea");
        const openSeaURL = `https://opensea.io/collection/forgottensouls/${soulId}`;
        window.open(openSeaURL, "_blank");
      },
    };

    const socialButton = new ImageButton(
      this.scene,
      150,
      160,
      "buttons",
      openSeaButton.default,
      openSeaButton.hover,
      openSeaButton.cb
    );
    socialButton.depth = 1;
    socialButton.setAlpha(0);
    this.scene?.add.existing(socialButton);
    this.container.add(socialButton);
    this.scene?.tweens.add({
      targets: socialButton,
      alpha: { value: 1, duration: 2000, ease: "Power1" },
      delay: 5500,
    });
  }

  addInstructionText() {
    const zoom = this.scene?.cameras?.main?.zoom || 1;
    this.instructionText = this.scene?.make.text({
      x: 0,
      y: 0,
      text: "",
      style: {
        fontFamily: "Alagard",
        fontSize: Math.floor(22 * zoom) + "px",
        color: "#E1DECD",
        wordWrap: { width: 320 * zoom },
        align: "center",
        metrics: {
          fontSize: 20 * zoom,
          ascent: 15 * zoom,
          descent: 2 * zoom,
        },
      },
    });
    // this.instructionText.setResolution(2);
    this.instructionText.setScale(1 / zoom);
    this.instructionText.setOrigin(0.5, 0);
    this.instructionText.setPosition(0, -180);
    this.container.add(this.instructionText);
  }

  addFrame() {
    const scene = this.scene;
    if (!scene) return;
    const width = scene.scale.gameSize.width;
    const height = scene.scale.gameSize.height;
    const centerY = height / 2;
    const worldView = scene.cameras.main.worldView;
    const centerX = worldView.centerX;

    this.container = scene.add.container(centerX, centerY - 50);
    this.container.setScale(0.5);

    const frame = scene.add.sprite(0, 0, "soulsUI", "box.png");
    frame.setScale(0.75);
    frame.setOrigin(0.5, 0.5);
    frame.setInteractive({ useHandCursor: false });
    this.frame = frame;
    this.container.add(frame);
    this.container.setAlpha(0);

    scene.tweens.add({
      targets: this.container,
      scale: 1,
      ease: "Back.easeOut",
      duration: 2000,
      delay: 0,
    });
    scene.tweens.add({
      targets: this.container,
      alpha: 1,
      ease: "Back.easeOut",
      duration: 2000,
      delay: 0,
    });
  }
  addCloseButton() {
    const scene = this.scene;
    if (!scene) return;
    const centerX = Math.floor(scene.cameras.main.width / 2);
    const closeButton = scene.add.sprite(
      210,
      -210,
      "buttons",
      "button_exit_default.png"
    );
    this.container.add(closeButton);

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
        this.hide();
      });

    scene.tweens.add({
      targets: closeButton,
      scale: 1,
      ease: "Back.easeOut",
      duration: 100,
    });
  }

  writeMessage({ msg }: { msg: string }) {
    const rexTextTyping = this.scene?.plugins.get("rexTextTyping") as any;
    if (rexTextTyping) {
      const typing = rexTextTyping.add(this.instructionText, {
        speed: 45,
      });
      typing.start(msg);
    }
  }
}

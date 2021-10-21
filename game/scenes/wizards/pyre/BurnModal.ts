export class BurnModal {
  sprite: any;
  scene: Phaser.Scene | undefined;

  onConnect: any;

  frame: any;

  container: any;

  instructionText: any;

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
    this.addWizardImage({ wizardId });

    this.writeMessage({
      msg: "To burn your Wizard, complete the spells below",
    });

    return this;
  }

  addWizardImage({ wizardId }: { wizardId: number }) {
    const scene = this.scene;
    if (!scene) return;
    const nftImageUrl =
      process.env.NEXT_PUBLIC_REACT_APP_WIZARDS_WEB_IMG_BASE_URL +
      `/${wizardId}.png`;

    const wizardImageKey = `wizard:${wizardId}`;

    scene.load.image(wizardImageKey, nftImageUrl); // add task
    scene.load.once("complete", () => {
      const img = scene.add.sprite(0, -78, wizardImageKey);
      img.setScale(0.25);
      img.setOrigin(0.5, 0);
      this.container.add(img);
    });
    scene.load.start(); // start loading
  }

  addInstructionText() {
    this.instructionText = this.scene?.make.text({
      x: 0,
      y: 0,
      text: "",
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
    this.instructionText.setOrigin(0.5, 0);
    this.instructionText.setPosition(0, -120);
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

    this.container = scene.add.container(centerX, centerY - 100);
    this.container.setScale(0.8);

    const frame = scene.add.sprite(0, 0, "soulsUI", "box.png");
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
      delay: 0,
    });
  }
  addCloseButton() {
    const scene = this.scene;
    if (!scene) return;
    const centerX = Math.floor(scene.cameras.main.width / 2);
    const closeButton = scene.add.sprite(
      centerX + 215,
      80,
      "buttons",
      "button_exit_default.png"
    );

    // closeButton.setOrigin(0, 0);
    // closeButton.setScale(1);
    // closeButton
    //   .setInteractive({ useHandCursor: true })
    //   .on("pointerover", () => {
    //     closeButton.setFrame("button_exit_hover.png");
    //   })
    //   .on("pointerout", () => {
    //     closeButton.setFrame("button_exit_default.png");
    //   })
    //   .on("pointerdown", () => {
    //     closeButton.setAlpha(0.6);
    //   })
    //   .on("pointerup", () => {
    //     closeButton.setAlpha(1);
    //     console.log("clicked");
    //     // this.dismissScene();
    //   });

    // scene.tweens.add({
    //   targets: closeButton,
    //   scale: 1,
    //   ease: "Back.easeOut",
    //   duration: 100,
    // });
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

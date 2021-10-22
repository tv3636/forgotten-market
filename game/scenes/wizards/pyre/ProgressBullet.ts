import { Toast } from "../../../objects/Toast";

export class ProgressBullet {
  sprite: any;
  scene: Phaser.Scene | undefined;

  container: any;

  instructionText: any;
  pendingText: any;

  msg: string;

  currentStatus: string;

  statusIcon: any;

  enabled: boolean = true;

  onClick: any;

  constructor({
    scene,
    container,
    msg,
    enabled = true,
  }: {
    scene: Phaser.Scene;
    container: any;
    msg: string;
    enabled: boolean;
  }) {
    this.scene = scene;
    this.container = container;
    this.msg = msg;
    this.currentStatus = "INCOMPLETE";
    this.enabled = enabled;
  }
  show() {
    const scene = this.scene;
    if (!scene) return;
    const worldView: Phaser.Geom.Rectangle = scene.cameras.main.worldView;
    const bottomY = worldView.height;
    const centerY = worldView.height / 2;
    const rightX = worldView.width;
    const centerX = worldView.centerX;

    this.addInstructionText();
    this.addIcon();

    this.writeMessage({
      msg: this.msg,
    });
    // this.addInteractionZone();

    this.setEnabled(this.enabled);
    this.setCurrentStatus({ newStatus: this.currentStatus });

    return this;
  }

  setOnClick(onClick: any) {
    this.onClick = onClick;
    this.addInteractionZone();
  }

  addInteractionZone() {
    if (!this.scene) return;

    // const zoneGraphics = this.scene.add.graphics();
    // zoneGraphics.lineStyle(2, 0xff0000, 1);
    // zoneGraphics.strokeRect(-12, -16, 200, 30);
    // this.container.add(zoneGraphics);

    const rayZone = this.scene.add.zone(0, 0, 200, 30);
    rayZone.setOrigin(0, 0);
    rayZone.setPosition(-12, -16);
    this.container.add(rayZone);

    const self = this;
    rayZone
      .setInteractive({ useHandCursor: true })
      .on("pointerover", (pointer: any) => {
        self.onHover();
      })
      .on("pointerout", (pointer: any) => {
        self.onHoverOut();
      })
      .on("pointerup", () => {
        self.onHoverOut();
        // this.onClick();

        if (this.enabled) {
          this.onClick(this);
        }
      });
  }

  onHover() {
    if (this.enabled) {
      this.container.setAlpha(0.6);
    }
  }

  onHoverOut() {
    if (this.enabled) {
      this.container.setAlpha(1);
    }
  }

  addIcon() {
    if (!this.scene) return;
    this.statusIcon = this.scene.add.sprite(0, 0, "soulsUI", "circle.png");
    this.statusIcon.setScale(0.5);
    this.container.add(this.statusIcon);
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
    this.instructionText.setOrigin(0, 0.5);
    this.instructionText.setPosition(18, 0);
    this.container.add(this.instructionText);
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

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (this.enabled) {
      if (this.instructionText) {
        this.instructionText.setAlpha(1);
      }
    } else {
      if (this.instructionText) {
        this.instructionText.setAlpha(0.5);
      }
    }
  }

  onPendingTx({ hash }: { hash: string }) {
    this.setCurrentStatus({ newStatus: "PENDING" });
    this.setEnabled(false);
    this.addEtherscanPendingMessage({ hash });
  }

  onPendingTxConfirmed() {
    const success = true; //?
    if (success) {
      this.setCurrentStatus({ newStatus: "COMPLETE" });
      this.hideEtherscanPendingMessage();
    }
  }

  onPendingTxError() {
    this.setCurrentStatus({ newStatus: "INCOMPLETE" });
    this.hideEtherscanPendingMessage();
  }

  addEtherscanPendingMessage({ hash }: { hash: string }) {
    this.pendingText = this.scene?.make.text({
      x: 0,
      y: 0,
      text: "Pending. View on Etherscan...",
      style: {
        fontFamily: "Alagard",
        fontSize: "12px",
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
    this.pendingText.setOrigin(0, 0.5);
    this.pendingText.setPosition(24, 16);
    this.container.add(this.pendingText);

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
  }

  hideEtherscanPendingMessage() {
    if (this.pendingText) {
      this.pendingText.destroy();
      this.pendingText = null;
    }
  }

  setCurrentStatus({ newStatus }: { newStatus: string }) {
    this.currentStatus = newStatus;
    switch (newStatus) {
      case "INCOMPLETE": {
        //
        break;
      }
      case "PENDING": {
        break;
        //
      }
      case "COMPLETE": {
        break;
        //
      }
    }
    this.updateIcon();
  }

  updateIcon() {
    if (!this.scene) return;
    if (!this.statusIcon) return;

    const tweens = this.scene.tweens.getTweensOf(this.statusIcon);
    tweens.forEach((tween) => {
      tween.stop();
      tween.remove();
    });

    switch (this.currentStatus) {
      case "INCOMPLETE": {
        this.statusIcon.setFrame("circle.png");
        break;
      }
      case "PENDING": {
        this.statusIcon.setFrame("star.png");
        this.scene.tweens.add({
          targets: this.statusIcon,
          angle: { value: 360, duration: 3000, ease: "Linear", repeat: -1 },
          alpha: {
            value: 0.5,
            duration: 1000,
            ease: "Linear",
            repeat: -1,
            yoyo: 1,
          },
        });

        break;
      }
      case "COMPLETE": {
        this.statusIcon.setFrame("starComplete.png");
        break;
      }
    }
  }
}

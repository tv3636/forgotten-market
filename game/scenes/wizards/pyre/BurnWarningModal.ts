import {
  FORGOTTEN_SOULS_ADDRESS,
  getInfinityVeilContract,
  getWizardsContract,
  INFINITY_VEIL_ADDRESS,
} from "../../../../contracts/ForgottenRunesWizardsCultContract";
import { ImageButton } from "../../../objects/ImageButton";
import { Toast } from "../../../objects/Toast";
import { getWeb3Controller } from "../home/Web3Controller";
import { ProgressBullet } from "./ProgressBullet";
import productionWizardData from "../../../../data/nfts-prod.json";
import { IMAGE_NOBG_BASE_URL } from "../../../../constants";

const nftData: {
  [nftId: string]: { name: string; image: string; background_color: string };
} = productionWizardData;

const SECONDS = 1000;
const TYPING_SPEED = 45;

// const SECONDS = 10;
// const TYPING_SPEED = 1;

export class BurnWarningModal {
  sprite: any;
  scene: Phaser.Scene | undefined;

  onConnect: any;

  frame: any;

  container: any;

  instructionText: any;

  bullets: any;

  messages: any[];
  msgIdx: number = 0;

  confirmButton: any;

  onComplete: any;

  wizardId: number;

  constructor({ scene, wizardId }: { scene: Phaser.Scene; wizardId: number }) {
    this.scene = scene;
    this.wizardId = wizardId;

    const nftName = nftData[wizardId?.toString()]?.name + ` (#${wizardId})`;

    this.messages = [
      {
        msg: "Do not be too eager to deal out death and judgement... Are you sure you want to burn this Wizard?",
        btn: "yes_default.png",
        btnHover: "yes_hover.png",
      },
      {
        msg: "Dark Magic is unpredictable and you may receive An Undesirable.\n\nDo you understand?",
        btn: "understand_default.png",
        btnHover: "understand_hover.png",
      },
      {
        msg: "Hmm... It seems you cannot be dissuaded.",
        pause: 4 * SECONDS,
      },
      {
        msg: "You will submit 1 Sacred Flame and 1 Wizard. Both burned and neither returned to you.\nDo you submit?",
        btn: "submit_default.png",
        btnHover: "submit_hover.png",
      },
      {
        msg: "Alright then.",
        pause: 1 * SECONDS,
      },
      {
        msg: "You've made your choice.\n\nThere's no turning back now.",
        pause: 5 * SECONDS,
      },
      {
        msg: `${nftName} will be no more,\n\none final entry in their Lore`,
        pause: 7 * SECONDS,
      },
      {
        msg: "May the Flame burn favorably through your Soul",
        pause: 4 * SECONDS,
      },
    ];
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
    this.addInstructionText();
    this.addWizardImage({ wizardId });

    this.showMessage(this.msgIdx);

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
    // this.frame.destroy();
    // this.instructionText.destroy();
    // this.confirmButton.destroy();
  }

  showMessage(idx: number) {
    const { msg, btn, pause } = this.messages[idx];
    this.writeMessage({
      msg,
    });
    if (btn) {
      this.addButtons();
    } else if (pause) {
      const self = this;
      this.scene?.time.addEvent({
        delay: pause,
        callback: () => {
          self.goToNextStep();
        },
        startAt: 0,
      });
    }
  }

  goToNextStep() {
    if (this.msgIdx < this.messages.length - 1) {
      this.msgIdx += 1;
      this.showMessage(this.msgIdx);
    } else {
      console.log("we're at the end");
      console.log("this.onComplete: ", this.onComplete);
      if (this.onComplete) {
        this.onComplete();
      }
    }
  }

  addButtons() {
    if (!this.scene) return;
    const self = this;

    const worldView: Phaser.Geom.Rectangle = this.scene.cameras.main.worldView;
    const bottomY = worldView.height;
    const rightX = worldView.width;
    const centerY = worldView.centerY;
    const centerX = worldView.centerX;

    this.confirmButton = new ImageButton(
      this.scene,
      centerX,
      centerY - 170,
      "soulsUI",
      this.messages[this.msgIdx].btn,
      this.messages[this.msgIdx].btnHover,
      ({ btn }: { btn: ImageButton }) => {
        if (self.scene) {
          btn.enabled = false;
          self.scene.tweens.add({
            targets: btn,
            alpha: { value: 0, duration: 500, ease: "Power1" },
            delay: 0,
          });
          self.scene.time.addEvent({
            delay: 5 * SECONDS + 10,
            callback: () => {
              btn.destroy();
            },
          });
        }
        self.goToNextStep();
      }
    );
    this.confirmButton.setScale(0.8);
    this.confirmButton.setAlpha(0);
    this.scene.add.existing(this.confirmButton);

    this.scene.tweens.add({
      targets: this.confirmButton,
      alpha: { value: 1, duration: 2000, ease: "Power1" },
      delay: 5 * SECONDS,
    });
  }

  addWizardImage({ wizardId }: { wizardId: number }) {
    const scene = this.scene;
    if (!scene) return;
    const nftImageUrl = `${IMAGE_NOBG_BASE_URL}${wizardId}.png`;
    const wizardImageKey = `wizard:nobg:${wizardId}`;
    scene.load.image(wizardImageKey, nftImageUrl); // add task
    scene.load.once("complete", () => {
      const img = scene.add.sprite(0, 24, wizardImageKey);
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
        align: "left",
        metrics: {
          fontSize: 20,
          ascent: 15,
          descent: 2,
        },
      },
    });
    this.instructionText.setOrigin(0.5, 0);
    this.instructionText.setPosition(0, -120);
    this.instructionText.setFixedSize(220, 300);
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
    this.container.setScale(1);

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
  writeMessage({ msg }: { msg: string }) {
    const rexTextTyping = this.scene?.plugins.get("rexTextTyping") as any;
    if (rexTextTyping) {
      const typing = rexTextTyping.add(this.instructionText, {
        speed: TYPING_SPEED,
      });
      typing.start(msg);
    }
  }
}

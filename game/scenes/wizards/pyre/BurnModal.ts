import {
  FORGOTTEN_SOULS_ADDRESS,
  getInfinityVeilContract,
  INFINITY_VEIL_ADDRESS,
} from "../../../../contracts/ForgottenRunesWizardsCultContract";
import { Toast } from "../../../objects/Toast";
import { getWeb3Controller } from "../home/Web3Controller";
import { ProgressBullet } from "./ProgressBullet";

export class BurnModal {
  sprite: any;
  scene: Phaser.Scene | undefined;

  onConnect: any;

  frame: any;

  container: any;

  instructionText: any;

  bullets: any;

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

    this.addStepsBullets();
    this.addHelp();

    return this;
  }

  async sendTx({
    buildTx,
    onPending,
    onConfirm,
    onError,
  }: {
    buildTx: any;
    onConfirm: any;
    onPending: any;
    onError: any;
  }) {
    if (!this.scene) return;
    const web3Controller = getWeb3Controller(this.scene.game);
    const injectedProvider = web3Controller.injectedProvider;
    if (!injectedProvider) {
      console.log(
        "ERROR: Couldn't find Metamask. This is bad. Real bad. Go back and connect."
      );
      const toast = new Toast();
      toast.create({
        scene: this.scene,
        message: "Can't find Metamask",
        duration: 3000,
      });
      return;
    }
    const { chainId } = await injectedProvider.getNetwork();
    const signer = injectedProvider.getSigner();

    const tx = await buildTx({ signer, injectedProvider, chainId });

    console.log("signer: ", signer);
    console.log("tx: ", tx);
    let txHash;
    try {
      const txResponse = await signer.sendTransaction(tx);
      txHash = txResponse.hash;
      console.log("txResponse: ", txResponse);
      onPending({ hash: txHash });
    } catch (err) {
      onError({ hash: txHash });
      console.log("err toast: ", err);
      const toast = new Toast();
      toast.create({
        scene: this.scene,
        message:
          (err as Error)?.message?.substr(0, 200) ||
          "Sorry, there was a problem",
        duration: 3000,
      });
    }
  }

  addStepsBullets() {
    const scene = this.scene;
    if (!scene) return;
    const width = scene.scale.gameSize.width;
    const height = scene.scale.gameSize.height;
    const centerY = height / 2;
    const worldView = scene.cameras.main.worldView;
    const centerX = worldView.centerX;

    const rowBase = -104;
    const rowHeight = 35;
    const xBase = -80;

    const approveFlamesContainer = scene.add.container(
      centerX + xBase,
      centerY + rowBase + rowHeight * 1
    );
    const approveWizardsContainer = scene.add.container(
      centerX + xBase,
      centerY + rowBase + rowHeight * 2
    );
    const burnBothContainer = scene.add.container(
      centerX + xBase,
      centerY + rowBase + rowHeight * 3
    );

    //
    let flamesApproved = false;
    let wizardsApproved = false;

    const onClickBurnBoth = () => {
      console.log("burn both clicked");
      if (!flamesApproved) {
        const toast = new Toast();
        toast.create({
          scene,
          message: "Approve Flames before trying to burn",
          duration: 3000,
        });
      }
      if (!wizardsApproved) {
        const toast = new Toast();
        toast.create({
          scene,
          message: "Approve Wizards before trying to burn",
          duration: 3000,
        });
      }
    };

    const burnBoth = new ProgressBullet({
      scene,
      container: burnBothContainer,
      msg: "Burn them both",
      onClick: onClickBurnBoth,
      enabled: false,
    });
    burnBoth.setEnabled(false);

    const onClickApproveFlames = (parent: ProgressBullet) => {
      console.log("approve flames");
      console.log("metamask pops up");

      this.sendTx({
        buildTx: async ({ injectedProvider, chainId }: any) => {
          const contract = await getInfinityVeilContract({
            provider: injectedProvider,
          });
          const tx = await contract.populateTransaction.setApprovalForAll(
            FORGOTTEN_SOULS_ADDRESS[chainId],
            true
          );
          return tx;
        },
        onPending: ({ hash }: { hash: string }) => {
          parent.onPendingTx({ hash });
        },
        onConfirm: () => {
          parent.onPendingTxConfirmed();
        },
        onError: () => {
          parent.onPendingTxError();
        },
      });
    };
    const onClickApproveWizards = () => {
      console.log("approve wizards");
    };
    const approveFlames = new ProgressBullet({
      scene,
      container: approveFlamesContainer,
      msg: "Approve your flame",
      onClick: onClickApproveFlames,
      enabled: true,
    });
    const approveWizards = new ProgressBullet({
      scene,
      container: approveWizardsContainer,
      msg: "Approve your wizard",
      onClick: onClickApproveWizards,
      enabled: true,
    });
    const delay = 101;

    // approveFlames.show();
    // approveWizards.show();
    // burnBoth.show();

    scene.time.addEvent({
      delay: delay * 1,
      callback: () => {
        approveFlames.show();
        // onClickApproveFlames(approveFlames);
        // setTimeout(() => {
        //   approveFlames.onPendingTxConfirmed();
        // }, 2000);
      },
      startAt: 0,
    });

    scene.time.addEvent({
      delay: delay * 2,
      callback: () => {
        approveWizards.show();
      },
      startAt: 0,
    });

    scene.time.addEvent({
      delay: delay * 3,
      callback: () => {
        burnBoth.show();
      },
      startAt: 0,
    });

    this.bullets = {
      approveFlames,
      approveWizards,
      burnBoth,
    };
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
  addHelp() {
    if (!this.scene) return;
    const helpText = this.scene.make.text({
      x: 0,
      y: 0,
      text: "help?",
      alpha: 0,
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
    helpText.setOrigin(1, 1);
    helpText.setPosition(112, 130);
    this.container.add(helpText);

    helpText
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        helpText.setAlpha(0.8);
      })
      .on("pointerout", () => {
        helpText.setAlpha(1);
      })
      .on("pointerdown", () => {
        helpText.setAlpha(0.6);
      })
      .on("pointerup", () => {
        helpText.setAlpha(1);
        let location: string = window.location.toString();
        if (location[location.length - 1] !== "/") {
          location += "/";
        }
        window.open(location + "posts/how-to-burn", "_blank");
      });

    this.scene.tweens.add({
      targets: helpText,
      alpha: 1,
      ease: "Back.easeOut",
      duration: 2000,
      delay: 2000,
    });
  }
}

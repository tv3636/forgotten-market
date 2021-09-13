import { fadeIn, fixHackyBraveText } from "../gameUtils";
import {
  getWeb3Controller,
  Web3Controller,
} from "../scenes/wizards/home/Web3Controller";
import { buildAnimationParticleClass } from "./animation-particles";

const beamFullY = 392;
const beamInitialY = 550;

const beamZDepth = 2;

export class TowerBeams {
  scene: Phaser.Scene;
  beams: any = [];
  beamZoneHovering: boolean = false;
  onClick: () => void;

  nightModeEnabled: boolean = false;

  beamLeft: any;
  beamRight: any;
  beamCenter: any;

  beamLeft2: any;
  beamRight2: any;
  beamCenter2: any;
  summonText: any;
  explorerLink: any;

  beamGiant: any;

  sparklyCursor: any;

  constructor({
    scene,
    onClick,
  }: {
    scene: Phaser.Scene;
    onClick: () => void;
  }) {
    this.scene = scene;
    this.onClick = onClick;
  }

  preload() {
    const scene = this.scene;
    scene.load.multiatlas("beamphase1", "beamphase1.json");
    scene.load.multiatlas("floaters", "floaters.json");
    scene.load.atlas("squarerot", "squarerot.png", "squarerot.json");
    scene.load.image("beammask", "mask.png");
    scene.load.atlas(
      "explosionParts",
      "explosionParts.png",
      "explosionParts.json"
    );
  }
  create() {}

  createLife() {
    const scene = this.scene;
    const width = scene.scale.gameSize.width;
    const height = scene.scale.gameSize.height;

    const worldView = this.scene.cameras.main.worldView;
    const centerX = worldView.centerX;

    const centerY = height / 2;

    //
    const beamCenter = scene.add.sprite(
      centerX - 19,
      392,
      "beamphase1",
      "beam_center.png"
    );
    fadeIn(scene, beamCenter);
    beamCenter.setScale(0.5);
    beamCenter.depth = beamZDepth;
    this.beamCenter = beamCenter;

    const beamCenter2 = scene.add.sprite(
      centerX - 19,
      392,
      "beamphase1",
      "beam_center.png"
    );
    beamCenter2.setAlpha(0);
    beamCenter2.setScale(0.5);
    beamCenter2.depth = beamZDepth;
    this.beamCenter2 = beamCenter2;

    const beamLeft = scene.add.sprite(
      centerX - 19,
      beamInitialY,
      "beamphase1",
      "beam_column.png"
    );
    fadeIn(scene, beamLeft);
    beamLeft.setScale(0.5);
    beamLeft.depth = beamZDepth;
    this.beamLeft = beamLeft;

    const beamLeft2 = scene.add.sprite(
      centerX - 19,
      beamInitialY,
      "beamphase1",
      "beam_column.png"
    );
    beamLeft2.setAlpha(0);
    beamLeft2.setScale(0.5);
    beamLeft2.depth = beamZDepth;
    this.beamLeft2 = beamLeft2;

    const beamRight = scene.add.sprite(
      centerX + 86,
      beamInitialY,
      "beamphase1",
      "beam_column.png"
    );
    fadeIn(scene, beamRight);
    beamRight.setScale(0.5);
    beamRight.depth = beamZDepth;
    this.beamRight = beamRight;

    const beamRight2 = scene.add.sprite(
      centerX + 86,
      beamInitialY,
      "beamphase1",
      "beam_column.png"
    );
    beamRight2.setAlpha(0);
    beamRight2.setScale(0.5);
    beamRight2.depth = beamZDepth;
    this.beamRight2 = beamRight2;

    const frameNames = scene.anims.generateFrameNames("squarerot", {
      start: 1,
      end: 11,
      zeroPad: 2,
      prefix: "squareRot",
      suffix: ".png",
    });

    const beamphaseAnim = scene.anims.create({
      key: "beamphase1-square",
      frames: frameNames,
      frameRate: 20,
      repeat: -1,
    });
    // squarePulse.anims.play("beamphase1-square");

    // https://github.com/photonstorm/phaser3-examples/blob/master/public/src/game%20objects/particle%20emitter/custom%20particles.js

    const AnimatedParticle = buildAnimationParticleClass({
      anim: beamphaseAnim,
    });

    let particles = scene.add.particles("squarerot");
    // console.log("particles: ", particles);

    let emitter = particles.createEmitter({
      x: centerX,
      y: 250,
      scale: 0.5,
      quantity: 1,
      accelerationY: -100,
      frequency: 600,
      //   frequency: 6000,
      lifespan: 1370,
      alpha: 0,
      blendMode: "Phaser.BlendModes.SCREEN",
      particleClass: AnimatedParticle as any,
    });
    emitter.setAlpha(function (p: any, k: any, t: number) {
      //   return 1 - 2 * Math.abs(t - 0.5);
      //   console.log("t : ", t);
      //   const v = 1 - 2 * Math.abs(t - 0.5);
      //   console.log(v, t);
      return 1 - t;
    });

    // const zoneGraphics = scene.add.graphics();
    // zoneGraphics.strokeRect(centerX - 100, 0, 200, 300);
    const rayZone = scene.add.zone(centerX - 100, 0, 200, 300);
    rayZone.setOrigin(0, 0);
    rayZone.setPosition(centerX - 100, 0);

    rayZone
      .setInteractive({ useHandCursor: true })
      .on("pointerover", (pointer: any) => {
        this.beamZoneHovering = true;
      })
      .on("pointerout", (pointer: any) => {
        // console.log("pointerout:", pointer);
        this.beamZoneHovering = false;
      })
      .on("pointerup", () => {
        console.log("clicked the zone");
        this.onClick();
      });

    [
      { leftX: 64, rightX: 42, sideY: 179, sideYTip: 183, beam: beamLeft },
      { leftX: 64, rightX: 42, sideY: 179, sideYTip: 183, beam: beamLeft2 },
      { leftX: -42, rightX: -63, sideY: 179, sideYTip: 183, beam: beamRight },
      { leftX: -42, rightX: -63, sideY: 179, sideYTip: 183, beam: beamRight2 },
      { leftX: 17, rightX: -17, sideY: 251, sideYTip: 258, beam: beamCenter },
      { leftX: 17, rightX: -17, sideY: 251, sideYTip: 258, beam: beamCenter2 },
    ].map(({ leftX, rightX, sideY, sideYTip, beam }) => {
      // left column beam mask
      const shape = scene.add.graphics({});

      shape.fillStyle(0xffffff);
      shape.beginPath();
      shape.moveTo(centerX - leftX, sideY);
      shape.lineTo(centerX - Math.floor((leftX + rightX) / 2), sideYTip); // point
      shape.lineTo(centerX - rightX, sideY);
      shape.lineTo(centerX - rightX, -100);
      shape.lineTo(centerX - leftX, -100);
      shape.closePath();
      //   shape.fillPath();
      //   shape.strokePath();

      const mask = shape.createGeometryMask();
      beam.setMask(mask);
      beam.depth = 2;
      this.beams.push(beam);
    });

    // DEBUGs
    // this.showSummonsSent();
    // this.explode();
    // this.enableSparklyCursors();
  }

  update() {
    if (this.nightModeEnabled) {
      this.beams.map((beam: any) => {
        if (beam.y > beamFullY) {
          beam.y = beam.y - 4;
        }
      });
    } else {
      if (this.beamZoneHovering) {
        this.beams.map((beam: any) => {
          if (beam.y > beamFullY) {
            beam.y = beam.y - 2;
          }
        });
      } else {
        this.beams.map((beam: any) => {
          if (beam.y < beamInitialY) {
            beam.y = beam.y + 1;
          }
        });
      }
    }

    if (this.sparklyCursor) {
      // this.sparklyCursor.
    }
  }

  enableNightMode({ duration }: { duration: number }) {
    this.nightModeEnabled = true;

    [this.beamLeft2, this.beamRight2, this.beamCenter2].forEach((beam: any) => {
      this.scene.tweens.add({
        targets: beam,
        alpha: { value: 1, duration, ease: "Power1" },
      });
    });
  }

  disableNightMode() {
    this.nightModeEnabled = false;
    [this.beamLeft2, this.beamRight2, this.beamCenter2].forEach((beam: any) => {
      this.scene.tweens.add({
        targets: beam,
        alpha: { value: 0, duration: 1000, ease: "Power1" },
      });
    });
  }

  regularBeams() {
    this.disableNightMode();
    if (this.beamGiant) {
      this.scene.tweens.add({
        targets: this.beamGiant,
        alpha: { value: 0, duration: 500, ease: "Power1" },
      });
      this.scene.time.addEvent({
        delay: 501,
        callback: () => {
          this.beamGiant.destroy();
        },
      });
    }

    [this.beamLeft, this.beamRight, this.beamCenter].forEach((beam: any) => {
      if (beam) {
        this.scene.tweens.add({
          targets: beam,
          alpha: { value: 1, duration: 500, ease: "Power1" },
        });
      }
    });
  }
  turnOffBeams() {
    console.log("turn off beams");

    this.beams.map((beam: any) => {
      // remove any previous tweens
      var tweens = this.scene.tweens.getTweensOf(beam);
      tweens.forEach((tween) => {
        tween.stop();
        tween.remove();
      });

      this.scene.tweens.add({
        targets: beam,
        alpha: { value: 0, duration: 50, ease: "Power1" },
      });
    });
  }

  bringToFront() {
    this.beams.map((beam: any) => {
      beam.depth = 2;
    });
  }

  explode() {
    const scene = this.scene;
    const width = scene.scale.gameSize.width;
    const height = scene.scale.gameSize.height;
    // const centerX = Math.floor(scene.cameras.main.width / 2);
    // const centerX = width / 2;
    const centerY = height / 2;
    const worldView = this.scene.cameras.main.worldView;
    const centerX = worldView.centerX;

    // cross
    const cross = scene.add.sprite(
      centerX - 4,
      280,
      "explosionParts",
      "cross.png"
    );

    cross.depth = beamZDepth;
    cross.setScale(0.1);
    const scaleIncrease = 5;
    const crossDuration = 200;
    scene.tweens.add({
      targets: cross,
      alpha: { value: 0, duration: crossDuration * 1.8, ease: "Power1" },
      scale: {
        value: 0.1 * scaleIncrease,
        duration: crossDuration,
        ease: "Power1",
      },
      x: {
        value: centerX - 4 * scaleIncrease,
        duration: crossDuration,
        ease: "Power1",
      },
      y: { value: 390, duration: crossDuration, ease: "Power1" },
    });

    // whiteGlare
    scene.time.addEvent({
      delay: 200,
      callback: () => {
        const whiteGlare = scene.add.tileSprite(
          0,
          0,
          width,
          height,
          "explosionParts",
          "whiteGlare.png"
        );
        whiteGlare.setAlpha(0);
        whiteGlare.setOrigin(0, 0);
        whiteGlare.depth = beamZDepth + 1;

        scene.tweens.add({
          targets: whiteGlare,
          alpha: { value: 0.8, duration: 300, ease: "Power1" },
          yoyo: true,
        });
      },
      startAt: 0,
    });

    // boomSquare
    scene.time.addEvent({
      delay: 200,
      callback: () => {
        const boomSquare = scene.add.sprite(
          centerX,
          250,
          "explosionParts",
          "boomSquare.png"
        );
        boomSquare.setScale(0.25);
        boomSquare.depth = beamZDepth;

        const scaleIncrease = 5;
        const duration = 260;
        const ease = "Power1";

        scene.tweens.add({
          targets: boomSquare,
          alpha: { value: 0, duration: duration * 1.8, ease },
          scale: {
            value: 0.25 * scaleIncrease,
            duration,
            ease,
          },
          x: {
            value: centerX,
            duration,
            ease,
          },
          y: { value: 250, duration: crossDuration, ease },
        });
      },
      startAt: 0,
    });

    // squareGiant
    scene.time.addEvent({
      delay: 200 + 60,
      callback: () => {
        const squareGiant = scene.add.sprite(
          centerX,
          250,
          "explosionParts",
          "squareGiant.png"
        );
        squareGiant.setScale(0.25);
        squareGiant.depth = beamZDepth;

        const scaleIncrease = 3.5;
        const duration = 200;

        scene.tweens.add({
          targets: squareGiant,
          alpha: { value: 0, duration: duration * 1.2, ease: "Power1" },
          scale: {
            value: 0.25 * scaleIncrease,
            duration,
            ease: "Power1",
          },
          x: {
            value: centerX,
            duration,
            ease: "Power1",
          },
          y: { value: 250, duration: crossDuration, ease: "Power1" },
        });
      },
      startAt: 0,
    });

    const beamGiant = scene.add.sprite(
      centerX,
      275,
      "explosionParts",
      "beam_giant.png"
    );
    beamGiant.setOrigin(0.5, 1);
    beamGiant.setScale(0.5);
    beamGiant.setAlpha(0);
    beamGiant.depth = beamZDepth;
    this.beamGiant = beamGiant;

    //
    const vertSquare = scene.add.sprite(
      centerX,
      250,
      "explosionParts",
      "vertSquare.png"
    );
    vertSquare.setScale(0.5);
    vertSquare.depth = beamZDepth + 1;

    // vertSquare
    scene.time.addEvent({
      delay: 200,
      callback: () => {
        const crossDuration = 300;

        scene.tweens.add({
          targets: vertSquare,
          alpha: {
            value: 0,
            duration: crossDuration * 1.2,
            ease: "Power1",
          },
          y: { value: -100, duration: crossDuration, ease: "Power1" },
        });
      },
      startAt: 0,
    });

    // beamGiant
    scene.time.addEvent({
      delay: 200,
      callback: () => {
        beamGiant.setAlpha(0.1);

        scene.tweens.add({
          targets: beamGiant,
          alpha: { value: 1, duration: 200, ease: "Power1" },
        });

        this.turnOffBeams();
      },
    });

    scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.showSummonsSent();
      },
    });

    // DEBUG
    // scene.time.addEvent({
    //   delay: 5000,
    //   callback: () => {
    //     this.summonConfirmed();
    //   }
    // });
  }

  summonConfirmed() {
    (this.scene as any).endSendSummon();
    (this.scene as any).launchShowScene();
  }

  showSummonsSent() {
    const scene = this.scene;
    const width = scene.scale.gameSize.width;
    const height = scene.scale.gameSize.height;
    // const centerX = Math.floor(scene.cameras.main.width / 2);
    const worldView = this.scene.cameras.main.worldView;
    const centerX = worldView.centerX;

    //
    const message = "Your request\n\nhas been sent\n\nto the ether";

    const summonText = this.scene.add.text(0, 0, "", {
      fontFamily: "Alagard",
      fontSize: "40px",
      color: "#004844",
      metrics: {
        fontSize: 43,
        ascent: 35,
        descent: 8,
      },
    });
    summonText.scale = 0.5;
    summonText.setOrigin(0, 0);
    summonText.setPosition(centerX - 63, 50);
    summonText.depth = beamZDepth + 1;
    this.summonText = summonText;

    const rexTextTyping = scene.plugins.get("rexTextTyping") as any;
    if (rexTextTyping) {
      const typing = rexTextTyping.add(summonText, {
        speed: 45,
      });
      typing.start(message);
    }

    const lastTxHash = (scene as any).lastTxHash;
    if (lastTxHash) {
      console.log("lastTxHash: ", lastTxHash);
      const explorerLink = this.scene.add.text(
        0,
        0,
        "please wait...\n(etherscan)",
        {
          fontFamily: "Alagard",
          fontSize: "20px",
          color: "#004844",
          metrics: {
            fontSize: 40,
            ascent: 30,
            descent: 2,
          }, // +
        }
      );
      explorerLink.setAlpha(0);
      explorerLink.scale = 0.5;
      explorerLink.setOrigin(0.5, 0);
      explorerLink.setPosition(centerX, 200);
      explorerLink.depth = beamZDepth + 1;
      this.explorerLink = explorerLink;
      this.scene.tweens.add({
        targets: this.explorerLink,
        alpha: { value: 0.8, duration: 1600, delay: 3000, ease: "Power1" },
      });
      explorerLink
        .setInteractive({ useHandCursor: true })
        .on("pointerover", (pointer: any) => {
          explorerLink.setAlpha(1);
        })
        .on("pointerout", (pointer: any) => {
          explorerLink.setAlpha(0.8);
        })
        .on("pointerup", () => {
          const etherscanURL = `${process.env.NEXT_PUBLIC_REACT_APP_BLOCK_EXPLORER}/tx/${lastTxHash}`;
          window.open(etherscanURL, "_blank");
        });

      this.waitForTxConfirmation({ hash: lastTxHash });
    }

    // this.enableSparklyCursors();
  }

  async waitForTxConfirmation({ hash }: { hash: string }) {
    const minWait = 10000;
    const start = new Date().valueOf();
    let sleepTime = minWait;

    try {
      const web3Controller = getWeb3Controller(this.scene.game);
      const provider = web3Controller.provider;
      if (!provider) return;

      (this.scene as any).startLoading();

      const receipt = await provider.waitForTransaction(
        hash,
        1, // confirmations
        60 * 60 * 10
      );
      const end = new Date().valueOf();
      const diff = end - start;

      // sleep long enough to let the animation play out
      sleepTime = Math.max(minWait - diff, 0);
      console.log("sleepTime: ", sleepTime);
      console.log("receipt:", receipt);
    } catch (err) {
      console.log("err:", err);
    } finally {
      this.scene.time.addEvent({
        delay: sleepTime,
        callback: () => {
          this.summonConfirmed();
        },
      });
    }
  }

  enableSparklyCursors() {
    const scene = this.scene;
    const frameNames = scene.anims.generateFrameNames("floaters", {
      start: 1,
      end: 4,
      zeroPad: 2,
      prefix: "trifx",
      suffix: ".png",
    });

    console.log("frameNames: ", frameNames);

    // const beamphaseAnim = scene.anims.create({
    //   key: "floaters",
    //   frames: frameNames,
    //   frameRate: 20,
    //   repeat: -1
    // });
    // squarePulse.anims.play("beamphase1-square");

    // https://github.com/photonstorm/phaser3-examples/blob/master/public/src/game%20objects/particle%20emitter/custom%20particles.js

    // const AnimatedParticle = buildAnimationParticleClass({
    //   anim: beamphaseAnim
    // });

    // let particles = scene.add.particles("floaters");

    // let emitter = particles.createEmitter({
    //   frame: { frames: [0, 1, 2], cycle: true },
    //   x: 600,
    //   y: 400,
    //   scale: 0.5,
    //   quantity: 1,
    //   accelerationY: -100,
    //   frequency: 600,
    //   lifespan: 1370,
    //   alpha: 0,
    //   blendMode: "Phaser.BlendModes.SCREEN"
    //   // particleClass: AnimatedParticle as any
    // });
    // emitter.setAlpha(function (p: any, k: any, t: number) {
    //   return 1 - t;
    // });
  }

  disableSparklyCursors() {
    //
  }

  hideSummonsSent() {
    if (this.summonText) {
      this.summonText.destroy();
    }
    if (this.explorerLink) {
      this.explorerLink.destroy();
    }
  }

  cleanupExplosion() {
    this.regularBeams();
    this.hideSummonsSent();
  }
}

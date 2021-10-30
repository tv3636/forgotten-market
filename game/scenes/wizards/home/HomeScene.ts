import { InteriorScene } from "./../interior/InteriorScene";
import { BuyScene } from "./../buy/BuyScene";
import { TowerBeams } from "./../../../objects/towerBeams";
import { Tower } from "./../../../objects/tower";
import { buildAnimationParticleClass } from "../../../objects/animation-particles";
import { TextButton } from "../../../objects/text-button";
import { getStore } from "../../../../store";
import { IStore } from "../../../../stores/rootStore";
import events from "../../../events";
import {
  getWeb3Controller,
  Web3Controller,
  Web3ControllerEvents,
} from "./Web3Controller";
import { getWizardsContract } from "../../../../contracts/ForgottenRunesWizardsCultContract";
import { JsonRpcProvider } from "@ethersproject/providers";
import { BigNumber } from "@ethersproject/bignumber";
import { check } from "yargs";
import { bigNumberMax, bigNumberSubSafe } from "../../../../lib/web3Utils";
import { fadeIn, fixHackyBraveText } from "../../../gameUtils";
import { Toast } from "../../../objects/Toast";
import { AlagardFontMetrics } from "../../../fontSettings";

//  This Scene is aspect ratio locked at 640 x 960 (and scaled and centered accordingly)

const NIGHT = true;
const BREAKPOINT = 768;

export class HomeScene extends Phaser.Scene {
  backgroundScene: any;
  wolf: any;
  cat: any;
  crow: any;
  doorguy: any;
  owl: any;
  metamaskButtonZone: any;

  graphics: any;

  initialWidth: any;
  text: any;

  tower: Tower;
  towerBeams: TowerBeams;

  buyScene: any;
  showScene: any;
  interiorScene: any;
  pyreScene: any;
  darkSky: any;

  initialScrollY: number = 0;

  lastTxHash: string | null = null;

  summoningBegun: boolean = false;

  store: IStore;

  tooEarlyText: any;

  summonStartBlock: BigNumber;
  currentBlock: BigNumber;

  blocksTillSummoningText: any;

  bat1: any;
  bat2: any;

  bat1center: any;
  bat2center: any;

  bati: number = 0;
  bati2: number = 0;

  lastDelta: number = 1;

  constructor() {
    super("HomeScene");
    this.store = getStore();
    this.towerBeams = new TowerBeams({
      scene: this,
      onClick: () => {
        const web3Controller = getWeb3Controller(this.game);
        if (web3Controller.web3Connected) {
          this.launchBuyScene();
        }
      },
    });
    this.tower = new Tower({ scene: this });
    this.summonStartBlock = BigNumber.from(0);
    this.currentBlock = BigNumber.from(0);
  }

  preload() {
    this.load.path = "/static/game/wizards/";
    this.load.aseprite("wolf", "wolf-n.png", "wolf-n.json");
    this.load.aseprite("cat", "cat-n.png", "cat-n.json");
    this.load.aseprite("crow", "crow.png", "crow.json");
    this.load.aseprite("doorguy", "doorguy.png", "doorguy.json");
    // this.load.bitmapFont("Pixel-NES", "Pixel-NES.png", "Pixel-NES.xml");
    this.input.topOnly = false;

    if (NIGHT) {
      this.load.aseprite("owl", "souls/owl.png", "souls/owl.json");
      this.load.aseprite("bat", "souls/bat.png", "souls/bat.json");
    }

    this.tower.preload();
    this.towerBeams.preload();
    BuyScene.preloadStatic(this);
    InteriorScene.preloadStatic(this);

    const webfont = {
      custom: {
        families: ["Pixel-NES", "Alagard"],
        urls: ["/static/game/wizards/fonts.css"],
      },
      google: {
        families: ["Bangers"],
      },
    };
    (this.load as any).rexWebFont(webfont);
  }

  async create() {
    const width = this.scale.gameSize.width;
    const height = this.scale.gameSize.height;
    const centerX = Math.floor(this.cameras.main.width / 2);
    const centerY = height / 2;
    this.initialWidth = width; // store for responsive

    this.graphics = this.add.graphics();

    // const textureManager = this.scene.systems.textures;
    this.backgroundScene = this.scene.get("BootScene");
    this.scale.on("resize", this.resize, this);

    // check if we're ready
    try {
      const { summoningBegun, summonStartBlock, currentBlock, diffBlock } =
        await this.fetchIfSummoningBegan();
      this.summoningBegun = summoningBegun;
      this.summonStartBlock = summonStartBlock;
      this.currentBlock = currentBlock;
    } catch (err) {
      console.log("Error fetching start summoning block:", err);
    }

    this.createEnvironment();

    this.updateCamera();
    (this.cameras.main as any).preRender();

    this.tower.create();
    this.towerBeams.create();

    this.configureSoulsWorld();
    // if (this.summoningBegun) {
    //   this.configureSummoningBegunWorld();
    // } else {
    //   this.showTooEarly();
    //   this.checkForSummoningBegunAtIntervals();
    // }

    // this.createDebugs();

    this.updateCamera();
    (this.cameras.main as any).preRender();

    this.addControls();

    this.cameras.main.fadeIn(500, 0, 0, 0);

    // TMP
    // this.launchBuyScene();
    // this.startSendSummon();
    // this.launchInteriorScene();
    // this.showTooEarly();

    // this.connectMetamask();
    // setTimeout(() => {
    // this.launchShowScene();
    // }, 100);

    // this.time.addEvent({
    //   delay: 1000,
    //   callback: () => {
    //     this.summoningBegun = true;
    //   }
    // });

    // const toast = new Toast();
    // toast.create({
    //   scene: this,
    //   message:
    //     "4. Hello there! Welcome to the Forgotten Runes. Here you can Summon a Wizard",
    //   duration: 3000
    // });
  }

  async fetchIfSummoningBegan() {
    const provider = this.getProvider() as JsonRpcProvider;
    const contract = await getWizardsContract({ provider });

    const summonStartBlock = await contract.summonStartBlock();
    const currentBlock = BigNumber.from(await provider.getBlockNumber());
    const diffBlock = bigNumberSubSafe(
      summonStartBlock,
      BigNumber.from(currentBlock)
    );

    let summoningBegun = false;
    if (BigNumber.from(currentBlock).gte(summonStartBlock)) {
      summoningBegun = true;
    }

    return {
      summoningBegun,
      summonStartBlock,
      currentBlock,
      diffBlock,
    };
  }

  checkForSummoningBegunAtIntervals() {
    let handle = setInterval(async () => {
      console.log("checkForSummoningBegunAtIntervals");
      if (this.summoningBegun) {
        this.configureSummoningBegunWorld();
        clearInterval(handle);
      } else {
        const { summoningBegun, summonStartBlock, currentBlock, diffBlock } =
          await this.fetchIfSummoningBegan();
        this.summoningBegun = summoningBegun;
        this.summonStartBlock = summonStartBlock;
        this.currentBlock = currentBlock;
      }
    }, 10 * 1000);
  }

  configureSummoningBegunWorld() {
    console.log("configureSummoningBegunWorld");
    this.hideTooEarly();
    this.tower.createLife();
    this.towerBeams.createLife();
    this.createCharacters();
  }

  configureSoulsWorld() {
    console.log("configureSoulsWorld");
    this.hideTooEarly();
    this.tower.createSoulsLife();
    this.createSoulsCharacters();
  }

  launchBuyScene() {
    if (this.buyScene) {
      this.scene.launch("BuyScene");
    } else {
      this.scene.launch("BuyScene");
      this.buyScene = this.scene.get("BuyScene");
      this.buyScene.parentScene = this;
    }
  }

  launchShowScene() {
    if (this.showScene) {
      this.scene.launch("ShowScene");
    } else {
      this.scene.launch("ShowScene");
      this.showScene = this.scene.get("ShowScene");
      this.showScene.parentScene = this;
    }
  }

  launchInteriorScene() {
    if (this.interiorScene) {
      this.scene.launch("InteriorScene");
      this.interiorScene = this.scene.get("InteriorScene");
      this.interiorScene.parentScene = this;
    } else {
      this.scene.launch("InteriorScene");
      this.interiorScene = this.scene.get("InteriorScene");
      this.interiorScene.parentScene = this;
    }
  }

  launchPyreScene() {
    if (this.pyreScene) {
      this.scene.launch("PyreScene");
      this.pyreScene = this.scene.get("PyreScene");
      this.pyreScene.parentScene = this;
    } else {
      this.scene.launch("PyreScene");
      this.pyreScene = this.scene.get("PyreScene");
      this.pyreScene.parentScene = this;
    }
  }

  stopBuyScene() {
    //
  }

  createCharacters() {
    const width = this.scale.gameSize.width;
    const height = this.scale.gameSize.height;
    // const centerX = Math.floor(this.cameras.main.width / 2);
    const worldView = this.cameras.main.worldView;
    const centerX = worldView.centerX;
    const centerY = height / 2;

    // characters
    (this as any).myAasepriteLoader?.createFromAseprite("wolf");
    this.wolf = this.add.sprite(centerX + 53, 440, "wolf", 0);
    fadeIn(this, this.wolf);
    this.wolf.play({
      key: "idle",
      delay: 1000,
      repeatDelay: 2000,
      repeat: -1,
    });
    this.wolf.on(Phaser.Animations.Events.ANIMATION_COMPLETE, (anim: any) => {
      if (anim?.key === "howl") {
        // add the metamask button
        this.wolf.play({
          key: "idle",
          delay: 1000,
          repeatDelay: 2000,
          repeat: -1,
        });
      }
    });

    // const zoneGraphics = this.add.graphics();
    // zoneGraphics.strokeRect(centerX + 38, 438, 45, 30);
    const wolfZone = this.add.zone(centerX + 38, 438, 45, 30);
    wolfZone.setOrigin(0, 0);
    wolfZone.setPosition(centerX + 38, 438);
    wolfZone.setInteractive({ useHandCursor: true }).on("pointerup", () => {
      this.wolf.play({
        key: "howl",
        repeat: 0,
        delay: 0,
      });
    });

    (this as any).myAasepriteLoader?.createFromAseprite("cat");
    this.cat = this.add.sprite(centerX - 108, 346, "cat", 0);
    fadeIn(this, this.cat);
    this.cat.depth = 2;
    this.cat.play({
      key: "play",
      repeat: -1,
    });

    (this as any).myAasepriteLoader?.createFromAseprite("doorguy");
    this.doorguy = this.add.sprite(centerX - 71, 385, "doorguy", 1);
    fadeIn(this, this.doorguy);
    this.doorguy.play({
      key: "play-doorguy",
      delay: 1000,
      repeatDelay: 10000,
      repeat: -1,
    });

    // const zoneGraphics = this.add.graphics();
    // zoneGraphics.strokeRect(centerX + 10, 414, 30, 30);
    const hatZone = this.add.zone(centerX + 10, 414, 30, 30);
    hatZone.setOrigin(0, 0);
    hatZone.setPosition(centerX + 10, 414);
    hatZone.setInteractive({ useHandCursor: true }).on("pointerup", () => {
      this.launchShowScene();
    });

    this.showCrow();

    const web3Controller = getWeb3Controller(this.game);
    web3Controller.emitter.on(
      Web3ControllerEvents.WEB3_CONNECTED,
      (evt: any) => {
        this.hideCrow();
      }
    );
  }

  createSoulsCharacters() {
    const width = this.scale.gameSize.width;
    const height = this.scale.gameSize.height;
    // const centerX = Math.floor(this.cameras.main.width / 2);
    const worldView = this.cameras.main.worldView;
    const centerX = worldView.centerX;
    const centerY = height / 2;

    (this as any).myAasepriteLoader?.createFromAseprite("owl");
    this.owl = this.add.sprite(centerX - 8, 390, "owl", 0);
    this.owl.depth = 2;
    fadeIn(this, this.owl);
    this.owl.play({
      key: "play",
      delay: 2000,
      repeatDelay: 5000,
      repeat: -1,
    });

    (this as any).myAasepriteLoader?.createFromAseprite("bat");
    this.bat1 = this.add.sprite(centerX - 8, 390, "bat", 0);
    this.bat1.depth = 2;
    fadeIn(this, this.bat1);
    this.bat1.play({
      key: "play-bat",
      repeatDelay: 0,
      repeat: -1,
      startFrame: 1,
    });

    this.bat2 = this.add.sprite(centerX + 10, 380, "bat", 0);
    this.bat2.depth = 2;
    fadeIn(this, this.bat2);
    this.bat2.play({
      key: "play-bat",
      repeatDelay: 0,
      repeat: -1,
    });
  }

  showCrow() {
    const width = this.scale.gameSize.width;
    const height = this.scale.gameSize.height;
    const centerX = Math.floor(this.cameras.main.width / 2);
    const centerY = height / 2;

    (this as any).myAasepriteLoader?.createFromAseprite("crow");
    this.crow = this.add.sprite(centerX + 115, 196, "crow", 0);
    fadeIn(this, this.crow);
    this.crow.depth = 2;
    this.crow.play({
      key: "crow-fly-mm",
      delay: 1000,
      repeat: 0,
    });

    // const zoneGraphics = this.add.graphics();
    // zoneGraphics.strokeRect(centerX + 60, 105, 70, 70);
    this.metamaskButtonZone = this.add.zone(centerX + 60, 105, 70, 70);
    this.metamaskButtonZone.setOrigin(0, 0);
    this.metamaskButtonZone.setPosition(centerX + 60, 105);
    this.metamaskButtonZone
      .setInteractive({ useHandCursor: true })
      .on("pointerup", () => {
        console.log("connecting to web3");
        this.connectMetamask();
      });

    this.crow.on(Phaser.Animations.Events.ANIMATION_COMPLETE, (anim: any) => {
      if (anim?.key === "crow-fly-mm") {
      }
    });
  }

  hideCrow() {
    if (!this.crow) return;
    this.tweens.add({
      targets: this.crow,
      alpha: { value: 0, duration: 500, ease: "Power1" },
    });
    this.time.addEvent({
      delay: 501,
      callback: () => {
        if (this.crow) {
          this.crow.destroy();
          this.crow = null;
        }
      },
    });
  }

  connectMetamask() {
    this.game.events.emit(events.ON_METAMASK_ATTEMPT_CONNECT, { foo: "bar" });
  }

  createEnvironment() {
    // TODO: the moon
    // const centerX = Math.floor(this.cameras.main.width / 2);
    // const moon = this.add.sprite(centerX, 0, "castle", "moon-0");
    // moon.setOrigin(0.5, 0);
  }

  createDebugs() {
    const width = this.scale.gameSize.width;
    const height = this.scale.gameSize.height;
    const centerX = Math.floor(this.cameras.main.width / 2);
    const centerY = height / 2;

    const self = this;
    this.input.on("pointerdown", function (event: Phaser.Input.Pointer) {
      console.log({
        downX: event.downX,
        downY: event.downY,
        worldX: self.input.activePointer.worldX,
        worldY: self.input.activePointer.worldY,
        worldXRel: centerX - self.input.activePointer.worldX,
      });
    });
  }

  update(delta: number) {
    this.towerBeams.update();
    this.tower.update();
    this.updateTooEarly();
    this.moveBats(delta - this.lastDelta);
    this.lastDelta = delta;
  }

  updateTooEarly() {
    if (!this.summoningBegun && this.tooEarlyText) {
      try {
        let remain = bigNumberSubSafe(this.summonStartBlock, this.currentBlock);
        remain = bigNumberMax(remain, BigNumber.from(0));
        const blocksString = remain.gt(10000) ? "many" : remain.toString();
        const blockOrBlocks = remain.eq(1) ? "block" : "blocks";
        const remainOrRemains = remain.eq(1) ? "remains" : "remain";
        const blocksRemain = `${blocksString} ${blockOrBlocks} ${remainOrRemains}`;
        this.blocksTillSummoningText.setText(blocksRemain);
      } catch (err) {
        console.log("err: ", err);
      }
    }
  }

  getProvider() {
    return getWeb3Controller(this.game).provider;
  }

  updateCamera() {
    const camera = this.cameras.main;
    const width = this.scale.gameSize.width;
    const height = this.scale.gameSize.height;
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    const mainZoom = this.backgroundScene.cameras.main.zoom;
    camera.setZoom(mainZoom);

    if (mainZoom > 1) {
      camera.scrollY = -height / mainZoom / 2;
    }

    // scroll based on whatever we initially had
    const initialCenterX = this.initialWidth / 2;
    camera.scrollX = (centerX - initialCenterX) * -1;
    this.backgroundScene.updateCamera();

    this.updateDarkSkySize();
  }

  getZoom() {
    return this.cameras.main.zoom;
  }

  resize(gameSize: any, baseSize: any, displaySize: any, resolution: any) {
    const width = gameSize.width;
    const height = gameSize.height;
    this.updateCamera();
    if (this.buyScene) {
      this.buyScene.resize(gameSize, baseSize, displaySize, resolution);
    }
    if (this.showScene) {
      this.showScene.resize(gameSize, baseSize, displaySize, resolution);
    }
  }

  updateDarkSkySize() {
    const worldView = this.cameras.main.worldView;
    const centerX = worldView.centerX;

    if (this.darkSky) {
      // this.darkSky.height = this.cameras.main.height;
      this.darkSky.width = this.cameras.main.width;
      this.darkSky.x = centerX;
      // this.darkSky.tilePositionY = 300;
    }
  }

  startSendSummon() {
    const timeToFade = 1000;
    this.towerBeams.enableNightMode({ duration: 1000 });

    // dark sky has nothing to do with the screen height - it's only world height
    // and it needs to have a cap for all pixels above

    // add dark sky
    const darkSky = this.add.tileSprite(
      0,
      0,
      this.cameras.main.width,
      820,
      "darkGradientStrip"
    );
    darkSky.setAlpha(0);
    darkSky.setOrigin(0.5, 0.5);
    darkSky.depth = 0;
    darkSky.tilePositionY = 0;
    this.darkSky = darkSky;
    this.updateDarkSkySize();

    this.tweens.add({
      targets: darkSky,
      alpha: { value: 1, duration: timeToFade, ease: "Power1" },
    });

    this.towerBeams.bringToFront();

    // earthquake
    this.time.addEvent({
      delay: timeToFade - 100,
      callback: () => {
        const shakeDuration = 1500;
        const shakeVector = new Phaser.Math.Vector2(0.0005, 0);
        this.cameras.main.shake(shakeDuration, shakeVector);
        this.backgroundScene.cameras.main.shake(shakeDuration, shakeVector);
      },
      startAt: 0,
    });

    // explode
    const timeToExplodeAfterFade = 800;

    this.time.addEvent({
      delay: timeToFade + timeToExplodeAfterFade,
      callback: () => {
        this.towerBeams.explode();
      },
      startAt: 0,
    });
  }

  endSendSummon() {
    console.log("end send summon");
    this.towerBeams.cleanupExplosion();
    this.endLoading();

    this.tweens.add({
      targets: this.darkSky,
      alpha: { value: 0, duration: 500, ease: "Power1" },
    });
  }

  addControls() {
    const width = this.scale.gameSize.width;
    const height = this.scale.gameSize.height;
    const camera = this.cameras.main;
    this.initialScrollY = camera.scrollY;
    const desktop = this.scale.gameSize.width >= BREAKPOINT;

    const maxScroll = desktop ? 1400 : 1800;

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
        // console.log("camera.scrollY: ", camera.scrollY);
        camera.scrollY = Math.max(this.initialScrollY, camera.scrollY);
        camera.scrollY = Math.min(camera.scrollY, maxScroll);
        // this.updateCamera();

        const scrollYDiff = Math.abs(camera.scrollY - this.initialScrollY); // 0
        // console.log("camera.scrollY: ", camera.scrollY, scrollYDiff);
        this.backgroundScene.updateParallax({
          scrollY: scrollYDiff,
        });
      }
    );

    const zoneGraphics = this.add.graphics();
    const worldView = this.cameras.main.worldView;
    const centerX = worldView.centerX;
    // zoneGraphics.strokeRect(centerX - 70, 363, 20, 30);
    // zoneGraphics.strokeRect(centerX + 32, 398, 20, 30);

    if (!NIGHT) {
      const doorZone1 = this.add.zone(centerX - 70, 363, 20, 30);
      doorZone1.setOrigin(0, 0);
      doorZone1.setPosition(centerX - 70, 363);
      doorZone1.setInteractive({ useHandCursor: true }).on("pointerup", () => {
        this.launchInteriorScene();
      });

      const doorZone2 = this.add.zone(centerX + 32, 398, 20, 30);
      doorZone2.setOrigin(0, 0);
      doorZone2.setPosition(centerX + 32, 398);
      doorZone2.setInteractive({ useHandCursor: true }).on("pointerup", () => {
        this.launchInteriorScene();
      });
    }

    const rayZone = this.add.zone((width / 2) * -1, 0, width * 3, height * 100);
    rayZone.setOrigin(0, 0);
    rayZone
      .setInteractive({ draggable: true, useHandCursor: false })
      // .on("pointerup", () => {
      //   // console.log("drag zone up", this.parentScene);
      // })
      .on("drag", (pointer: any, dragX: number, dragY: number) => {
        // console.log("drag zone drag", this.parentScene);
        const camera = this.cameras.main;
        camera.scrollY += dragY * 0.5 * -1;
        camera.scrollY = Math.max(this.initialScrollY, camera.scrollY);
        camera.scrollY = Math.min(camera.scrollY, maxScroll);

        const scrollYDiff = Math.abs(camera.scrollY - this.initialScrollY); // 0
        this.backgroundScene.updateParallax({
          scrollY: scrollYDiff,
        });
      });
  }

  startLoading() {
    this.tower.startLoadingRunes();
  }
  endLoading() {
    this.tower.stopLoadingRunes();
  }

  showTooEarly() {
    const worldView = this.cameras.main.worldView;
    const centerX = worldView.centerX;

    const message = "The Summoning\n\nhas not yet begun";
    const summonText = this.add.text(0, 0, "", {
      fontFamily: "Alagard",
      fontSize: "40px",
      color: "#004844",
      metrics: {
        fontSize: 43,
        ascent: 35,
        descent: 8,
      },
    });
    // console.log("summoning", summonText.getTextMetrics());

    summonText.scale = 0.5;
    summonText.setOrigin(0.5, 0);
    summonText.setPosition(centerX, 50);

    summonText.depth = 1;
    console.log("displayHeight", summonText.displayHeight);
    this.tooEarlyText = summonText;

    const rexTextTyping = this.plugins.get("rexTextTyping") as any;
    if (rexTextTyping) {
      const typing = rexTextTyping.add(summonText, {
        speed: 45,
      });
      typing.start("The Summoning\n\nhas not yet begun");
    }

    const countText = this.add.text(0, 0, "...", {
      fontFamily: "Alagard",
      fontSize: "20px",
      color: "#004844",
      metrics: {
        fontSize: 40,
        ascent: 30,
        descent: 2,
      },
    });
    countText.scale = 0.5;
    countText.setOrigin(0.5, 0);
    countText.setPosition(centerX, 140);
    countText.depth = 1;
    this.blocksTillSummoningText = countText;
    countText.setAlpha(0);
    this.tweens.add({
      targets: countText,
      alpha: { value: 0.8, duration: 1000, delay: 2000, ease: "Power1" },
    });
    countText
      .setInteractive({ useHandCursor: true })
      .on("pointerover", (pointer: any) => {
        countText.setAlpha(1);
      })
      .on("pointerout", (pointer: any) => {
        countText.setAlpha(0.8);
      })
      .on("pointerup", () => {
        const etherscanURL = `${
          process.env.NEXT_PUBLIC_REACT_APP_BLOCK_EXPLORER
        }/block/countdown/${this.summonStartBlock?.toString()}`;
        window.open(etherscanURL, "_blank");
      });
  }

  hideTooEarly() {
    if (this.tooEarlyText) {
      this.tooEarlyText.destroy();
    }
    if (this.blocksTillSummoningText) {
      this.blocksTillSummoningText.destroy();
    }
  }

  moveBats(delta: number) {
    const worldView = this.cameras.main.worldView;
    const centerX = worldView.centerX;

    let batBase1 = {
      x: centerX - 8,
      y: 390,
    };

    let batBase2 = {
      x: centerX + 10,
      y: 380,
    };

    const radius = 90;
    // const speed = 0.005;
    const speed = 20;
    const timeScale = 1;

    const moveBat = ({
      bat,
      batCenter,
      base,
    }: {
      bat: any;
      batCenter: { x: number; y: number };
      base: { x: number; y: number };
    }) => {
      if (bat && batCenter?.x) {
        const targetX = base.x + batCenter.x;
        const targetY = base.y + batCenter.y;
        const curX = bat.x;
        const curY = bat.y;

        let dt = (delta * timeScale) / 1000;
        let movingDist = speed * dt;
        let distToTarget = Phaser.Math.Distance.Between(
          curX,
          curY,
          targetX,
          targetY
        );
        // console.log("movingDist: ", movingDist, distToTarget);

        let newX, newY;
        var t = movingDist / distToTarget;
        newX = Phaser.Math.Linear(curX, targetX, t);
        newY = Phaser.Math.Linear(curY, targetY, t);
        // console.log("newX, newY: ", newX, newY);
        bat.setPosition(newX, newY);
      }
    };

    moveBat({ bat: this.bat1, batCenter: this.bat1center, base: batBase1 });
    moveBat({ bat: this.bat2, batCenter: this.bat2center, base: batBase2 });

    if (!this.bat1center || this.bati % 91 === 0) {
      const g = new Phaser.Math.RandomDataGenerator();
      this.bat1center = {
        x: g.between(-1 * radius, radius),
        y: g.between(-1 * radius, radius),
      };
    }

    if (!this.bat2center || this.bati % 73 === 0) {
      const g = new Phaser.Math.RandomDataGenerator();
      this.bat2center = {
        x: g.between(-1 * radius, radius),
        y: g.between(-1 * radius, radius),
      };
    }

    this.bati += 1;
    this.bati = this.bati % 2056;
  }
}

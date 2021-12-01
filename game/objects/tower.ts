import { BigNumber } from "@ethersproject/bignumber";
import { JsonRpcProvider } from "@ethersproject/providers";
import {
  getSoulsContract,
  WIZARDS_CONTRACT_ADDRESS,
} from "../../contracts/ForgottenRunesWizardsCultContract";
import { bigNumberSubSafe } from "../../lib/web3Utils";
import { fadeIn } from "../gameUtils";
import { getWeb3Controller } from "../scenes/wizards/home/Web3Controller";
import { buildAnimationParticleClass } from "./animation-particles";
import { ImageButton } from "./ImageButton";

const maxRunes = 18;

const NIGHT = false;
const WINTER = true;

export class Tower {
  scene: Phaser.Scene;
  runes: any[] = [];
  lines: any;

  burningBegan: boolean = false;
  burningStartBlock: number = 111111111111111111111111111111111;
  currentBlock: number = 0;

  constructor({ scene }: { scene: Phaser.Scene }) {
    this.scene = scene;
  }

  preload() {
    const scene = this.scene;
    scene.load.aseprite("buttons", "buttons.png", "buttons.json");

    if (WINTER) {
      scene.load.aseprite(
        "castleParts",
        "winter/castle_v3.png",
        "winter/castle_v3.json"
      );
      scene.load.image("towerTile", "winter/castle_Snow_tile.png");

      // we have some animations in souls too
      scene.load.aseprite(
        "castlePartsSouls",
        "souls/castle_Souls.png",
        "souls/castle_Souls.json"
      );
      scene.load.aseprite("castlePartsOrig", "castle_v2.png", "castle_v2.json");
    } else if (NIGHT) {
      scene.load.aseprite(
        "castleParts",
        "souls/castle_Souls.png",
        "souls/castle_Souls.json"
      );
      scene.load.image("towerTile", "souls/castle_Souls_tile.png");
    } else {
      scene.load.aseprite("castleParts", "castle_v2.png", "castle_v2.json");
      scene.load.image("towerTile", "towerTile.png");
    }
  }

  create() {
    const scene = this.scene;
    const width = scene.scale.gameSize.width;
    const height = scene.scale.gameSize.height;
    // const centerX = Math.floor(scene.cameras.main.width / 2);
    const centerY = height / 2;
    const worldView = this.scene.cameras.main.worldView;
    const centerX = worldView.centerX;

    var data = scene.game.cache.json.get("castleParts");

    const originX = 0.5 + 0.015; /* fudge center */
    const originY = 0 + 0.001;

    (scene as any).myAasepriteLoader?.createFromAsepriteWithLayers(
      "castleParts"
    );

    if (WINTER) {
      (scene as any).myAasepriteLoader?.createFromAsepriteWithLayers(
        "castlePartsSouls"
      );
    }

    const towerY = 0;
    const tower = NIGHT
      ? scene.add.sprite(centerX, towerY, "castleParts", "tower_dark-0")
      : scene.add.sprite(centerX, towerY, "castleParts", "tower-0");
    tower.setOrigin(originX, originY);

    const towerTile = scene.add.tileSprite(
      centerX - 6,
      towerY + tower.height,
      265,
      2800,
      "towerTile"
    );
    towerTile.setOrigin(originX, originY);

    {
      // buttons
      const faqButton = new ImageButton(
        scene,
        centerX - 90,
        towerY + tower.height + 700 - 100,
        "buttons",
        "faq_default.png",
        "faq_hover.png",
        () => {
          let location: string = window.location.toString();
          if (location[location.length - 1] !== "/") {
            location += "/";
          }
          window.open(location + "wtf", "_blank");
        }
      );
      faqButton.setScale(0.5);
      scene.add.existing(faqButton);

      const discordButton = new ImageButton(
        scene,
        centerX - 90,
        towerY + tower.height + 725 - 100,
        "buttons",
        "social_discord_default.png",
        "social_discord_hover.png",
        () => {
          console.log("discord");
          window.open("https://discord.com/invite/F7WbxwJuZC", "_blank");
        }
      );
      discordButton.setScale(0.5);
      scene.add.existing(discordButton);

      const twitterButton = new ImageButton(
        scene,
        centerX - 90,
        towerY + tower.height + 750 - 100,
        "buttons",
        "social_twitter_default.png",
        "social_twitter_hover.png",
        () => {
          window.open("https://twitter.com/forgottenrunes", "_blank");
        }
      );
      twitterButton.setScale(0.5);
      scene.add.existing(twitterButton);

      const openSeaButton = new ImageButton(
        scene,
        centerX - 90,
        towerY + tower.height + 775 - 100,
        "buttons",
        "social_opensea_default.png",
        "social_opensea_hover.png",
        () => {
          const contractAddress =
            process.env.NEXT_PUBLIC_REACT_APP_WIZARDS_CONTRACT_ADDRESS;
          window.open(
            `https://opensea.io/collection/forgottenruneswizardscult`,
            "_blank"
          );
        }
      );
      openSeaButton.setScale(0.5);
      scene.add.existing(openSeaButton);
    }

    // check if we're ready
    try {
      this.fetchIfBurningBegan().then(
        ({ burningBegan, burningStartBlock, currentBlock, diffBlock }) => {
          this.burningBegan = burningBegan;
          this.burningStartBlock = burningStartBlock;
          console.log(
            "burningStartBlock: ",
            burningBegan,
            currentBlock.toString(),
            burningStartBlock.toString()
          );
          if (burningBegan) {
            this.addPyreDoor();
          } else {
            this.checkForBurningBegunAtIntervals();
          }
        }
      );
    } catch (err) {
      console.log("Error fetching start summoning block:", err);
    }

    // DEBUG
    // this.startLoadingRunes();
    // this.scene.time.addEvent({
    //   delay: 2000,
    //   callback: () => {
    //     this.stopLoadingRunes();
    //   }
    // });
  }

  getProvider() {
    return getWeb3Controller(this.scene.game).provider;
  }
  checkForBurningBegunAtIntervals() {
    let handle = setInterval(async () => {
      console.log("checkForBurningBegunAtIntervals");
      const { burningBegan, burningStartBlock } =
        await this.fetchIfBurningBegan();
      this.burningBegan = burningBegan;
      this.burningStartBlock = burningStartBlock;
      if (this.burningBegan) {
        clearInterval(handle);
        this.addPyreDoor();
      }
    }, 60 * 1000);
  }

  async fetchIfBurningBegan() {
    const provider = this.getProvider() as JsonRpcProvider;
    const contract = await getSoulsContract({ provider });
    const { chainId } = await provider.getNetwork();
    const wizardsAddress = WIZARDS_CONTRACT_ADDRESS[chainId];

    const [offset, burningStartBlock] = await contract.flammables(
      wizardsAddress
    );
    const currentBlock = BigNumber.from(await provider.getBlockNumber());
    const diffBlock = bigNumberSubSafe(
      burningStartBlock,
      BigNumber.from(currentBlock)
    );

    let burningBegan = false;
    if (BigNumber.from(currentBlock).gte(burningStartBlock)) {
      burningBegan = true;
    }

    return {
      burningBegan,
      burningStartBlock,
      currentBlock,
      diffBlock,
    };
  }

  createSoulsLife() {
    const scene = this.scene;
    const width = scene.scale.gameSize.width;
    const height = scene.scale.gameSize.height;
    const centerY = height / 2;
    const worldView = this.scene.cameras.main.worldView;
    const centerX = worldView.centerX;
    const centerYW = worldView.centerY;

    var data = scene.game.cache.json.get("castleParts");

    const originX = 0.5 + 0.015; /* fudge center */
    const originY = 0 + 0.001;

    const lines = scene.add.sprite(
      centerX,
      0,
      "castleParts",
      "towerLines_red-0"
    );
    fadeIn(scene, lines);
    lines.setOrigin(originX, originY);
    lines.depth = 1;
    this.lines = lines;

    const boards = scene.add.sprite(centerX, 0, "castleParts", "boards-0");
    fadeIn(scene, boards);
    boards.depth = 2;
    boards.setOrigin(originX, originY);

    const addNormalThing = ({ name }: { name: string }) => {
      const thing = scene.add.sprite(centerX, 0, "castleParts", name);
      fadeIn(scene, thing);
      thing.setOrigin(originX, originY);
      return thing;
    };

    addNormalThing({ name: "plants-0" });
    addNormalThing({ name: "pumpkin-0" });
    addNormalThing({ name: "pumpkin Copy-0" });
    addNormalThing({ name: "palms-0" });
    const towerDoorGlowSprite = addNormalThing({ name: "tower_dark_doors-0" });
    towerDoorGlowSprite.play({
      key: "tower_dark_doors-play",
      repeat: -1,
      delay: 0,
    });

    // this.addRunes({ n: 18, originX, originY });

    const band2 = scene.add.sprite(centerX, 0, "castleParts", "towerBandRed-0");
    band2.setOrigin(originX, originY);
    band2.setAlpha(0);

    scene.tweens.add({
      targets: band2,
      alpha: { value: 0.7, duration: 8000, ease: "Power1" },
      yoyo: true,
      repeat: -1,
    });

    // scene.input.enableDebug(pyreDoorZone);
  }

  createWinterLife() {
    const scene = this.scene;
    const width = scene.scale.gameSize.width;
    const height = scene.scale.gameSize.height;
    const centerY = height / 2;
    const worldView = this.scene.cameras.main.worldView;
    const centerX = worldView.centerX;
    const centerYW = worldView.centerY;

    var data = scene.game.cache.json.get("castleParts");

    const originX = 0.5 + 0.015; /* fudge center */
    const originY = 0 + 0.001;

    const lines = scene.add.sprite(
      centerX,
      0,
      "castleParts",
      "towerLines_red-0"
    );
    fadeIn(scene, lines);
    lines.setOrigin(originX, originY);
    lines.depth = 0;
    this.lines = lines;

    // const boards = scene.add.sprite(centerX, 0, "castleParts", "boards-0");
    // fadeIn(scene, boards);
    // boards.depth = 2;
    // boards.setOrigin(originX, originY);

    const addNormalThing = ({ name }: { name: string }) => {
      const thing = scene.add.sprite(centerX, 0, "castleParts", name);
      fadeIn(scene, thing);
      thing.setOrigin(originX, originY);
      return thing;
    };

    addNormalThing({ name: "palms-0" });
    addNormalThing({ name: "snow-0" });

    // addNormalThing({ name: "pumpkin-0" });
    // addNormalThing({ name: "pumpkin Copy-0" });
    // addNormalThing({ name: "palms-0" });
    // const towerDoorGlowSprite = addNormalThing({ name: "tower_dark_doors-0" });
    // towerDoorGlowSprite.play({
    //   key: "tower_dark_doors-play",
    //   repeat: -1,
    //   delay: 0,
    // });

    this.addRunes({ n: 18, originX, originY });

    const band2 = scene.add.sprite(centerX, 0, "castleParts", "towerBand-0");
    band2.setOrigin(originX, originY);
    band2.setAlpha(0);

    scene.tweens.add({
      targets: band2,
      alpha: { value: 0.7, duration: 8000, ease: "Power1" },
      yoyo: true,
      repeat: -1,
    });

    // scene.input.enableDebug(pyreDoorZone);
  }

  addPyreDoor() {
    const scene = this.scene;
    const width = scene.scale.gameSize.width;
    const height = scene.scale.gameSize.height;
    const centerY = height / 2;
    const worldView = this.scene.cameras.main.worldView;
    const centerX = worldView.centerX;
    const centerYW = worldView.centerY;

    var data = scene.game.cache.json.get("castleParts");

    const originX = 0.5 + 0.015; /* fudge center */
    const originY = 0 + 0.001;

    // add the door
    // addNormalThing({ name: "bottomDoor-0" });
    // addNormalThing({ name: "doorGlow-0" });

    const bottomDoorY = 1200;
    const bottomDoor = scene.add.sprite(
      centerX,
      0 + bottomDoorY,
      "castleParts",
      "bottomDoor-with-snow-0" // WINTER ? "bottomDoor-with-snow-0" : "bottomDoor-0"
    );
    fadeIn(scene, bottomDoor);
    bottomDoor.setOrigin(originX, originY);

    const bottomDoorGlow = scene.add.sprite(
      centerX,
      0 + bottomDoorY,
      "castlePartsSouls",
      "doorGlow-0"
    );
    fadeIn(scene, bottomDoorGlow);
    bottomDoorGlow.setOrigin(originX, originY);
    bottomDoorGlow.play({
      key: "doorGlow-play",
      repeat: -1,
      delay: 0,
    });

    // const zoneGraphics = scene.add.graphics();
    // zoneGraphics.lineStyle(2, 0xff0000, 1);
    // zoneGraphics.strokeRect(centerX + 38, centerY + 1350, 36, 50);
    const pyreDoorZone = this.scene.add.zone(
      centerX + 38,
      0 + bottomDoorY + 720,
      36,
      50
    );
    pyreDoorZone.setOrigin(0, 0);
    pyreDoorZone.setInteractive({ useHandCursor: true }).on("pointerup", () => {
      (this.scene as any).launchPyreScene();
    });
  }

  createLife() {
    const scene = this.scene;
    const width = scene.scale.gameSize.width;
    const height = scene.scale.gameSize.height;
    // const centerX = Math.floor(scene.cameras.main.width / 2);
    const centerY = height / 2;
    const worldView = this.scene.cameras.main.worldView;
    const centerX = worldView.centerX;

    var data = scene.game.cache.json.get("castleParts");

    const originX = 0.5 + 0.015; /* fudge center */
    const originY = 0 + 0.001;

    const lines = scene.add.sprite(centerX, 0, "castleParts", "towerLines-0");
    fadeIn(scene, lines);
    lines.setOrigin(originX, originY);
    lines.depth = 1;
    this.lines = lines;

    const hatstaff = scene.add.sprite(centerX, 0, "castleParts", "hatStaff-0");
    fadeIn(scene, hatstaff);
    hatstaff.setOrigin(originX, originY);

    // hatstaff.setInteractive({ useHandCursor: true }).on("pointerup", () => {
    //   (this.scene as any).launchShowScene();
    // });

    const plants = scene.add.sprite(centerX, 0, "castleParts", "plants-0");
    fadeIn(scene, plants);
    plants.setOrigin(originX, originY);

    const palms0 = scene.add.sprite(centerX, 0, "castleParts", "palms-0");
    fadeIn(scene, palms0);
    palms0.setOrigin(originX, originY);

    this.addRunes({ n: 18, originX, originY });

    const band = scene.add.sprite(centerX, 0, "castleParts", "towerBandRed-0");
    fadeIn(scene, band);
    band.setOrigin(originX, originY);

    const band2 = scene.add.sprite(
      centerX,
      0,
      "castleParts",
      "towerBandPulse-0"
    );
    band2.setOrigin(originX, originY);
    band2.setAlpha(0);

    scene.tweens.add({
      targets: band2,
      alpha: { value: 0.7, duration: 8000, ease: "Power1" },
      yoyo: true,
      repeat: -1,
    });

    // const palms1 = scene.add.sprite(
    //   centerX,
    //   0,
    //   "castleParts",
    //   "palms Copy-0"
    // );
    // palms1.setOrigin(originX, originY);
    // palms1.depth = 1;

    // DEBUG
    // this.startLoadingRunes();
    // this.scene.time.addEvent({
    //   delay: 2000,
    //   callback: () => {
    //     this.stopLoadingRunes();
    //   }
    // });
  }

  addRunes({
    n,
    originX,
    originY,
  }: {
    n: number;
    originX: number;
    originY: number;
  }) {
    const worldView = this.scene.cameras.main.worldView;
    const centerX = worldView.centerX;
    const numRunes = Math.min(n, maxRunes);

    for (let i = 1; i < n + 1; i++) {
      const frameName = `rune-${pad(i, 2)}-0`;
      // console.log("frameName: ", frameName);

      const rune = this.scene.add.sprite(centerX, 0, "castleParts", frameName);
      fadeIn(this.scene, rune);
      rune.setOrigin(originX, originY);
      // rune.setAlpha(0);
      // this.scene.tweens.add({
      //   targets: rune,
      //   alpha: { value: 1, duration: 200, ease: "Power1" },
      //   delay: (maxRunes - i) * 140
      // });
      this.runes[i] = rune;
    }
  }

  startLoadingRunes() {
    for (let i = 1; i < maxRunes + 1; i++) {
      const rune = this.runes[i];
      this.scene.tweens.add({
        targets: rune,
        alpha: { value: 0.1, duration: 1000, ease: "Power1" },
        delay: (maxRunes - i) * 180,
        yoyo: true,
        repeat: -1,
      });
    }
    this.scene.tweens.add({
      targets: this.lines,
      alpha: { value: 0.2, duration: 1400, ease: "Power1" },
      delay: 0,
      yoyo: true,
      repeat: -1,
    });
  }
  stopLoadingRunes() {
    for (let i = 1; i < maxRunes + 1; i++) {
      const rune = this.runes[i];
      if (rune) {
        const tweens = this.scene.tweens.getTweensOf(rune);
        tweens.forEach((tween) => {
          tween.stop();
          tween.remove();
        });
        this.scene.tweens.add({
          targets: rune,
          alpha: { value: 1, duration: 200, ease: "Power1" },
        });
      }
    }

    if (this.lines) {
      const tweens = this.scene.tweens.getTweensOf(this.lines);
      tweens.forEach((tween) => {
        tween.stop();
        tween.remove();
      });
      this.scene.tweens.add({
        targets: this.lines,
        alpha: { value: 1, duration: 200, ease: "Power1" },
      });
    }
  }

  update() {}
}

function pad(num: number | string, size: number) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}

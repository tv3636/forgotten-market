import { fadeIn } from "../gameUtils";
import { buildAnimationParticleClass } from "./animation-particles";
import { ImageButton } from "./ImageButton";

const maxRunes = 18;
export class Tower {
  scene: Phaser.Scene;
  runes: any[] = [];
  lines: any;

  constructor({ scene }: { scene: Phaser.Scene }) {
    this.scene = scene;
  }

  preload() {
    const scene = this.scene;
    scene.load.aseprite("castleParts", "castle_v2.png", "castle_v2.json");
    scene.load.aseprite("buttons", "buttons.png", "buttons.json");
    scene.load.image("towerTile", "towerTile.png");
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

    const towerY = 0;
    const tower = scene.add.sprite(centerX, towerY, "castleParts", "tower-0");
    tower.setOrigin(originX, originY);

    const towerTile = scene.add.tileSprite(
      centerX - 6,
      towerY + tower.height,
      265,
      1200,
      "towerTile"
    );
    towerTile.setOrigin(originX, originY);

    const faqButton = new ImageButton(
      scene,
      centerX - 90,
      towerY + tower.height + 700,
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
      towerY + tower.height + 725,
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
      towerY + tower.height + 750,
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
      towerY + tower.height + 775,
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

    // DEBUG
    // this.startLoadingRunes();
    // this.scene.time.addEvent({
    //   delay: 2000,
    //   callback: () => {
    //     this.stopLoadingRunes();
    //   }
    // });
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

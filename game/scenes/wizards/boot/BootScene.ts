import WebFontFile from "../../../plugins/WebFontFIle";
import events from "../../../events";
import { getWeb3Controller, Web3Controller } from "../home/Web3Controller";

const BREAKPOINT = 768;

const NIGHT = false;
const WINTER = true;

export class BootScene extends Phaser.Scene {
  gameScene: any;
  layer: any;
  landscape: any;

  web3Controller: Web3Controller | undefined;

  initialScrollY: number;

  constructor() {
    super("BootScene");
    this.initialScrollY = 0;
  }

  preload() {
    if (WINTER) {
      this.load.path = "/static/game/wizards/winter/";
      this.load.image("dark_moon_1", "sky/castle_v3_skyBG_dark_moon_1.png");
      this.load.image(
        "dark_moon_copy_1",
        "sky/castle_v3_skyBG_dark_moon_1.png"
      );
      this.load.image(
        "cloudspinkfront_1",
        "sky/castle_v3_skyBG_dark_cloudsfront_1.png"
      );
      this.load.image(
        "dark_cloudsmountains1",
        "sky/castle_v3_skyBG_dark_cloudsmountains_1.png"
      );
      this.load.image(
        "cloudspinkback",
        "sky/castle_v3_skyBG_dark_cloudsback_1.png"
      );
      this.load.image("pinkBG", "sky/castle_v3_skyBG_dark_sky_1.png");

      this.load.atlas(
        "snowflakes",
        "snow/snowflakes.png",
        "snow/snowflakes.json"
      );
      this.load.text("snow-particle-effect", "snow/snow.json");
    } else if (NIGHT) {
      this.load.path = "/static/game/wizards/souls/";
      this.load.image("dark_moon_1", "sky/castle_Souls_skyBG_dark_moon_1.png");
      this.load.image(
        "dark_moon_copy_1",
        "sky/castle_Souls_skyBG_dark_moon_copy_1.png"
      );

      this.load.image(
        "cloudspinkfront_1",
        "sky/castle_Souls_skyBG_dark_cloudspinkfront_1.png"
      );
      this.load.image(
        "dark_layer_2_1",
        "sky/castle_Souls_skyBG_dark_layer_2_1.png"
      );
      this.load.image(
        "dark_cloudsmountains1",
        "sky/castle_Souls_skyBG_dark_cloudsmountains_1.png"
      );
      this.load.image(
        "cloudspinkback",
        "sky/castle_Souls_skyBG_dark_cloudspinkback_1.png"
      );
      this.load.image(
        "dark_stars_1",
        "sky/castle_Souls_skyBG_dark_stars_1.png"
      );
      this.load.image(
        "dark_layer_1_1",
        "sky/castle_Souls_skyBG_dark_layer_1_1.png"
      );
      this.load.image("pinkBG", "sky/castle_Souls_skyBG_dark_sky_1.png");
    } else {
      this.load.path = "/static/game/wizards/";
      this.load.image("pinkBG", "pinkBG.png");
      this.load.image("cloudsPinkBack", "cloudsPinkBack.png");
      this.load.image("cloudsMountains", "cloudsMountains.png");
      this.load.image("cloudsPinkFront", "cloudsPinkFront.png");
      this.load.image("moon", "moon.png");
      this.load.image("stars", "stars.png");
      this.load.image("darkGradientStrip", "darkGradientStrip.png");
    }
    this.load.addFile(new WebFontFile(this.load, ["Press Start 2P"]));
  }

  create() {
    const self = this;
    this.web3Controller = getWeb3Controller(this.game);
    this.cameras.main.setRoundPixels(true);
    this.layer = this.add.container();

    // this is used below
    // const textureManager = this.scene.systems.textures;
    // const pinkBGFrame = textureManager.getFrame("pinkBG");

    const tileBgWidth = this.cameras.main.width;

    this.landscape = this.add.container();
    this.layer.add(this.landscape);

    // the landscape layer needs to be
    // such that the center of the landscape overall
    // is in the center of the camera

    // basically just create a stage that is the size of the bg ratio and make sure that stays centered to the camera
    // but the bg stage is also centered

    // https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.TileSprite.html
    const pinkBG = this.add.tileSprite(
      0,
      0,
      tileBgWidth,
      this.cameras.main.height,
      "pinkBG"
    );
    pinkBG.setOrigin(0, 0);
    this.landscape.add(pinkBG);

    const addToLandscape = ({ name }: { name: string }) => {
      const layer = this.add.tileSprite(
        0,
        0,
        tileBgWidth,
        this.cameras.main.height * 2,
        name
      );
      layer.setOrigin(0, 0);
      this.landscape.add(layer);
    };

    if (WINTER) {
      // addToLandscape({ name: "dark_layer_1_1" });
      // addToLandscape({ name: "dark_stars_1" });
      addToLandscape({ name: "cloudspinkback" });
      addToLandscape({ name: "dark_cloudsmountains1" });
      // addToLandscape({ name: "dark_layer_2_1" });
      addToLandscape({ name: "cloudspinkfront_1" });
      // addToLandscape({ name: "dark_moon_copy_1" });
      addToLandscape({ name: "dark_moon_1" });

      const blackBG = this.add.tileSprite(
        0,
        300,
        tileBgWidth,
        this.cameras.main.height * 2,
        "cloudspinkback"
      );
      blackBG.setOrigin(0, 0);
      this.landscape.add(blackBG);
      // this.letItSnow();
    } else if (NIGHT) {
      addToLandscape({ name: "dark_layer_1_1" });
      addToLandscape({ name: "dark_stars_1" });
      addToLandscape({ name: "cloudspinkback" });
      addToLandscape({ name: "dark_cloudsmountains1" });
      addToLandscape({ name: "dark_layer_2_1" });
      addToLandscape({ name: "cloudspinkfront_1" });
      addToLandscape({ name: "dark_moon_copy_1" });
      addToLandscape({ name: "dark_moon_1" });

      const blackBG = this.add.tileSprite(
        0,
        300,
        tileBgWidth,
        this.cameras.main.height * 2,
        "cloudspinkback"
      );
      blackBG.setOrigin(0, 0);
      this.landscape.add(blackBG);

      // addToLandscape({ name: "cloudspinkback" });
      // add a cover at the bottom
      // const blackBG = this.add.tileSprite(
      //   0,
      //   300,
      //   tileBgWidth,
      //   this.cameras.main.height,
      //   "cloudspinkback"
      // );
      // blackBG.setOrigin(0, 0);
      // this.landscape.add(blackBG);
    } else {
      const cloudsPinkBack = this.add.tileSprite(
        0,
        0,
        tileBgWidth,
        this.cameras.main.height,
        "cloudsPinkBack"
      );
      cloudsPinkBack.setOrigin(0, 0);
      this.landscape.add(cloudsPinkBack);

      const cloudsMountains = this.add.tileSprite(
        0,
        0,
        tileBgWidth,
        this.cameras.main.height,
        "cloudsMountains"
      );
      cloudsMountains.setOrigin(0, 0);
      this.landscape.add(cloudsMountains);

      const cloudsPinkFront = this.add.tileSprite(
        0,
        0,
        tileBgWidth,
        this.cameras.main.height,
        "cloudsPinkFront"
      );
      cloudsPinkFront.setOrigin(0, 0);
      this.landscape.add(cloudsPinkFront);

      const stars = this.add.tileSprite(
        0,
        0,
        this.cameras.main.width,
        this.cameras.main.height,
        "stars"
      );
      stars.setOrigin(0, 0);
      this.landscape.add(stars);
    }

    const width = this.scale.gameSize.width;
    const height = this.scale.gameSize.height;
    const centerX = width / 2;
    const centerY = height / 2;
    //  We launch this Scene first because we can't use `getZoom` otherwise
    this.scene.launch("HomeScene");
    this.gameScene = this.scene.get("HomeScene");
    this.updateCamera();
    this.addParallax();

    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  addParallax() {
    const camera = this.cameras.main;
    this.initialScrollY = camera.scrollY;
    // console.log("this.initialScrollY: ", this.initialScrollY);
    // const minScroll = -220;
    // const maxScroll = this.initialScrollY;

    const minScroll = this.initialScrollY;
    const maxScroll = -220;

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
        const worldView = this.cameras.main.worldView;
        const centerX = worldView.centerX;
        const centerY = worldView.centerY;

        // console.log("camera.scrollY: ", camera.scrollY);
        // console.log("centerY", centerY, "camera.scrollY: ", camera.scrollY);

        camera.scrollY += deltaY * 0.01;
        camera.scrollY = Phaser.Math.Clamp(
          camera.scrollY,
          minScroll,
          maxScroll
        );

        let i = 0;
        this.landscape.each((tile: any, idx: number) => {
          // console.log("tile.tilePositionY: ", tile.tilePositionY);
          tile.tilePositionY += deltaY * 0.05 * i;

          const maxTileY = i * 20;
          tile.tilePositionY = Phaser.Math.Clamp(
            tile.tilePositionY,
            0,
            maxTileY
          );
          i++;
        });

        // console.log("centerY", centerY);
        // camera.scrollY = Math.max(this.initialScrollY, camera.scrollY);
        // camera.scrollY = Math.min(camera.scrollY, maxScroll);
      }
    );
  }

  updateParallax({ scrollY }: { scrollY: number }): void {
    let maxScrollY = 1650; // just cheating
    let _scrollY = Math.min(maxScrollY, scrollY);
    // console.log("scrollY: ", scrollY);

    let i = 0;
    const numLandscapes = this.landscape.length;
    this.landscape.each((tile: any, idx: number) => {
      const isLast = i === numLandscapes - 1;
      // tile.tilePositionY -= scrollY * 0.0005 * i;
      tile.tilePositionY = _scrollY * 0.035 * i;
      if (isLast) {
        tile.tilePositionY = _scrollY * 0.02 * i;
      }
      // console.log("tile.tilePositionY: ", tile.tilePositionY);
      // const maxTileY = i * 13;
      // console.log("maxTileY: ", maxTileY);
      // console.log("tile.tilePositionY: ", tile.tilePositionY);
      // tile.tilePositionY = Phaser.Math.Clamp(tile.tilePositionY, 0, maxTileY);
      i++;
    });
  }

  updateCamera() {
    const width = this.scale.gameSize.width;
    const height = this.scale.gameSize.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const camera = this.cameras.main;
    const desktop = this.scale.gameSize.width >= BREAKPOINT;

    const mobile = !desktop;
    if (mobile) {
      const zoom = 1;
      camera.setZoom(zoom);
      camera.setPosition(0, 0);
      camera.scrollY = 0;
    } else {
      const zoom = 2;
      camera.setZoom(zoom);
      camera.setPosition(0, 0);
      camera.scrollY = -height / 4; // TODO this isn't quite right
    }

    const textureManager = this.scene.systems.textures;
    const pinkBGFrame = textureManager.getFrame("pinkBG");
    const gameCenter = width / 2;
    const pinkBGFrameWidthScaled = pinkBGFrame.width;

    const tilePosX = (centerX - pinkBGFrameWidthScaled / 2) * -1;
    const tilePosY = 0;

    this.landscape.each((tile: any) => {
      // the center of the pinkBGFrame needs to be the center of the screen
      tile.width = width;
      tile.height = pinkBGFrame.height; // don't repeat y
      tile.tilePositionX = tilePosX;
      tile.tilePositionY = tilePosY;
    });

    // const zoneGraphics = this.add.graphics();
    // zoneGraphics.fillStyle(0x0000ff, 1);
    // zoneGraphics.fillRect(0, 600, width, pinkBGFrame.height);
    // tileBgWidth,
    // this.cameras.main.height,
  }

  update() {
    this.game.events.emit(events.ON_UPDATE);
  }

  // letItSnow() {
  //   const width = this.cameras.main.width;
  //   console.log("let it snow");

  //   const base = JSON.parse(this.cache.text.get("snow-particle-effect"));
  //   console.log("base: ", base);
  //   let emitterConfig = {
  //     ...base,
  //     emitZone: {
  //       source: new Phaser.Geom.Rectangle(0, -50, width, 1),
  //       type: "random",
  //     },
  //   };
  //   const snowParticles = this.add.particles("snowflakes", [emitterConfig]);
  //   // snowParticles.depth = 10;
  //   this.landscape.add(snowParticles);
  // }

  resize() {
    this.updateCamera();
  }
}

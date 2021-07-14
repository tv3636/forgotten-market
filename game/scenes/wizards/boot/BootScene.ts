import WebFontFile from "../../../plugins/WebFontFIle";
import events from "../../../events";
import { getWeb3Controller, Web3Controller } from "../home/Web3Controller";

const BREAKPOINT = 768;

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
    this.load.path = "/static/game/wizards/";
    this.load.image("pinkBG", "pinkBG.png");
    this.load.image("cloudsPinkBack", "cloudsPinkBack.png");
    this.load.image("cloudsMountains", "cloudsMountains.png");
    this.load.image("cloudsPinkFront", "cloudsPinkFront.png");
    this.load.image("moon", "moon.png");
    this.load.image("stars", "stars.png");
    this.load.image("darkGradientStrip", "darkGradientStrip.png");
    this.load.addFile(new WebFontFile(this.load, ["Press Start 2P"]));
  }

  create() {
    const self = this;
    this.web3Controller = getWeb3Controller(this.game);
    this.cameras.main.setRoundPixels(true);
    this.layer = this.add.container();

    const textureManager = this.scene.systems.textures;
    const pinkBGFrame = textureManager.getFrame("pinkBG");

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
  }

  update() {
    this.game.events.emit(events.ON_UPDATE);
  }

  resize() {
    this.updateCamera();
  }
}

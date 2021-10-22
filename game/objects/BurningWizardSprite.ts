import { IMAGE_NOBG_BASE_URL } from "../../constants";

export class BurningWizardSprite extends Phaser.GameObjects.Sprite {
  defaultFrame: string;

  enabled: boolean = true;

  wizardId: number = -1;

  burnAnimationTimer: any;

  static fromWizardId({
    scene,
    wizardId,
    cb,
  }: {
    scene: Phaser.Scene;
    wizardId: number;
    cb: any;
  }) {
    const wizUrl = `${IMAGE_NOBG_BASE_URL}${wizardId}.png`;
    const wizardImageKey = `wizard:nobg:${wizardId}`;
    const wizardImageKeyBlack = `wizard:nobg:${wizardId}:black`;
    const wizardImageKeyRed = `wizard:nobg:${wizardId}:red`;
    const wizardImageKeyWhite = `wizard:nobg:${wizardId}:white`;

    scene.load.image(wizardImageKey, wizUrl); // add task
    scene.load.once("complete", () => {
      console.log("loaded", wizardImageKey);

      const originalTexture = scene.textures
        .get(wizardImageKey)
        .getSourceImage();

      function createRecolor({ originalTexture, newKey, processPixels }: any) {
        let newTexture = scene.textures.createCanvas(
          newKey,
          originalTexture.width,
          originalTexture.height
        );
        if (!newTexture) return;

        let context = (newTexture.getSourceImage() as any).getContext("2d");
        context.drawImage(originalTexture, 0, 0);

        var pixels = context.getImageData(
          0,
          0,
          originalTexture.width,
          originalTexture.height
        );

        for (let i = 0; i < pixels.data.length / 4; i++) {
          let index = i * 4;
          processPixels(pixels.data, index);
        }
        context.putImageData(pixels, 0, 0);
      }

      createRecolor({
        newKey: wizardImageKeyBlack,
        originalTexture,
        processPixels: (data: any, index: number) => {
          data[index] = 0;
          data[index + 1] = 0;
          data[index + 2] = 0;
        },
      });

      createRecolor({
        newKey: wizardImageKeyRed,
        originalTexture,
        processPixels: (data: any, index: number) => {
          data[index] = 255;
          data[index + 1] = 0;
          data[index + 2] = 0;
        },
      });

      createRecolor({
        newKey: wizardImageKeyWhite,
        originalTexture,
        processPixels: (data: any, index: number) => {
          data[index] = 255;
          data[index + 1] = 255;
          data[index + 2] = 255;
        },
      });

      const sprite = new BurningWizardSprite(
        scene,
        0,
        0,
        wizardImageKey,
        wizardId
      );

      cb({ sprite });
    });
    scene.load.start(); // start loading
  }

  constructor(
    scene: any,
    x: number,
    y: number,
    defaultFrame: string,
    wizardId: number
  ) {
    super(scene, x, y, defaultFrame);
    this.defaultFrame = defaultFrame;
    this.wizardId = wizardId;
  }

  destroy() {
    this.burnAnimationTimer.remove();
    super.destroy();
  }

  playBurn() {
    const wizardImageKeyBlack = `wizard:nobg:${this.wizardId}:black`;
    const wizardImageKeyRed = `wizard:nobg:${this.wizardId}:red`;
    const wizardImageKeyWhite = `wizard:nobg:${this.wizardId}:white`;

    let frames = [wizardImageKeyBlack, wizardImageKeyRed, wizardImageKeyWhite];
    let currentFrame = 0;

    this.burnAnimationTimer = this.scene.time.addEvent({
      delay: 70,
      callback: () => {
        try {
          this.setTexture(frames[currentFrame % frames.length]);
          // currentFrame += 1;
        } catch (err) {
          console.log("err: ", err);
          //
          // idk why
        }
      },
      startAt: 0,
      loop: true,
    });
  }
}

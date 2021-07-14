export class ImageButton extends Phaser.GameObjects.Sprite {
  defaultFrame: string;
  hoverFrame: string;

  constructor(
    scene: any,
    x: number,
    y: number,
    sheet: string,
    defaultFrame: string,
    hoverFrame: string,
    callback: any
  ) {
    super(scene, x, y, sheet, defaultFrame);
    this.defaultFrame = defaultFrame;
    this.hoverFrame = hoverFrame;

    this.setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        this.setFrame(hoverFrame);
      })
      .on("pointerout", () => {
        this.setFrame(defaultFrame);
      })
      .on("pointerdown", () => {
        this.setAlpha(0.6);
      })
      .on("pointerup", () => {
        this.setAlpha(1);
        callback();
      });
  }
}

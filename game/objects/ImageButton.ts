export class ImageButton extends Phaser.GameObjects.Sprite {
  defaultFrame: string;
  hoverFrame: string;

  enabled: boolean = true;

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
        if (this.enabled) {
          this.setFrame(hoverFrame);
        }
      })
      .on("pointerout", () => {
        if (this.enabled) {
          this.setFrame(defaultFrame);
        }
      })
      .on("pointerdown", () => {
        if (this.enabled) {
          this.setAlpha(0.6);
        }
      })
      .on("pointerup", () => {
        if (this.enabled) {
          this.setAlpha(1);
          callback({ btn: this });
        }
      });
  }
}

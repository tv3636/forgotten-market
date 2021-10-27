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
    callback: any,
    opts?: { hoverSound?: string; clickSound?: string }
  ) {
    super(scene, x, y, sheet, defaultFrame);
    this.defaultFrame = defaultFrame;
    this.hoverFrame = hoverFrame;

    const { hoverSound, clickSound } = opts || {};
    let _hoverSound: any;
    if (hoverSound) {
      _hoverSound = scene.sound.add(hoverSound);
    }

    let _clickSound: any;
    if (clickSound) {
      _clickSound = scene.sound.add(clickSound);
    }

    this.setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        if (this.enabled) {
          if (_hoverSound) {
            _hoverSound.play({
              repeat: -1,
            });
          }
          this.setFrame(hoverFrame);
        }
      })
      .on("pointerout", () => {
        if (_hoverSound) {
          _hoverSound.stop();
        }

        if (this.enabled) {
          this.setFrame(defaultFrame);
        }
      })
      .on("pointerdown", () => {
        if (_hoverSound) {
          _hoverSound.stop();
        }

        if (this.enabled) {
          if (_clickSound) {
            _clickSound.play({});
          }
          this.setAlpha(0.6);
        }
      })
      .on("pointerup", () => {
        if (_hoverSound) {
          _hoverSound.stop();
        }

        if (this.enabled) {
          this.setAlpha(1);
          callback({ btn: this });
        }
      });
  }
}

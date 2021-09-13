import { fixHackyBraveText } from "../../../gameUtils";

export class BuyButtonRow {
  scene: Phaser.Scene;

  baseY: number;
  baseName: string;
  displayPrice: string;

  priceDelay: number;

  onClick: () => void;

  constructor({
    scene,
    baseY,
    baseName,
    displayPrice,
    priceDelay,
    onClick,
  }: {
    scene: Phaser.Scene;
    baseY: number;
    baseName: string;
    displayPrice: string;
    priceDelay: number;
    onClick: () => void;
  }) {
    this.scene = scene;
    this.baseY = baseY;
    this.baseName = baseName;
    this.displayPrice = displayPrice;
    this.priceDelay = priceDelay;
    this.onClick = onClick;
  }

  preload() {
    const scene = this.scene;
  }

  create() {
    const scene = this.scene;
    const width = scene.scale.gameSize.width;
    const height = scene.scale.gameSize.height;
    const centerX = Math.floor(scene.cameras.main.width / 2);
    const centerY = height / 2;

    const button = scene.add.sprite(
      centerX - 90,
      this.baseY,
      "buttons",
      `${this.baseName}_default.png`
    );
    button
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => {
        button.setFrame(`${this.baseName}_hover.png`);
      })
      .on("pointerout", () => {
        button.setFrame(`${this.baseName}_default.png`);
      })
      .on("pointerdown", () => {
        button.setAlpha(0.6);
      })
      .on("pointerup", () => {
        button.setAlpha(1);
        console.log("clicked");
        this.onClick();
      });

    const ethsymbol = scene.add.sprite(
      centerX + 40,
      this.baseY + 3,
      "buttons",
      `ethsymbol.png`
    );

    const priceText = scene.add.text(100, 0, "", {
      fontFamily: "Pixel-NES",
      fontSize: "27px",
      color: "#E1DECD",
      metrics: {
        fontSize: 28,
        ascent: 27,
        descent: 1,
      },
    });
    console.log("pricetext", priceText.getTextMetrics());
    priceText.setOrigin(0, 0.5);
    priceText.setPosition(centerX + 90, this.baseY);

    const rexTextTyping = scene.plugins.get("rexTextTyping") as any;
    // console.log("rexTextTyping: ", rexTextTyping);
    if (rexTextTyping) {
      const typing = rexTextTyping.add(priceText, {
        speed: 45,
      });

      scene.time.addEvent({
        delay: this.priceDelay,
        callback: () => {
          typing.start(this.displayPrice);
        },
        startAt: 0,
      });
    }
  }

  update() {}
}

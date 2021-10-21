import { fixHackyBraveText, isBrave } from "../gameUtils";

export class Toast {
  constructor() {}
  create({
    scene,
    message,
    duration,
  }: {
    scene: Phaser.Scene;
    message: string;
    duration: number;
  }) {
    const worldView: Phaser.Geom.Rectangle = scene.cameras.main.worldView;
    const bottomY = worldView.height;
    const centerY = worldView.height / 2;
    const rightX = worldView.width;
    const centerX = worldView.centerX;

    console.log("Toast Message:", message);

    const summonText = scene.add.text(0, 0, message, {
      fontFamily: "Pixel-NES",
      fontSize: "24px",
      color: "#440C1D",
      wordWrap: { width: 300, useAdvancedWrap: true },
      align: "right",
      metrics: {
        fontSize: 25,
        ascent: 24,
        descent: 1,
      }, // +
    });

    summonText.setScale(0.5);
    summonText.setOrigin(1, 0);
    summonText.setPosition(worldView.right - 10, 20);

    summonText.depth = 2;
    summonText.setAlpha(0);

    const fadeInTime = 500;

    scene.tweens.add({
      targets: summonText,
      alpha: { value: 1, duration: fadeInTime, ease: "Power1" },
    });

    scene.tweens.add({
      targets: summonText,
      alpha: { value: 0, duration: 500, ease: "Power1" },
      delay: fadeInTime + duration,
    });
  }
}

// const toast = new Toast();
// toast.create({
//   scene: this,
//   message:
//     "Hello there, this is a long error message and unfortunately you're a dummy bye",
//   duration: 3000
// });

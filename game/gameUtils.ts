export function fadeIn(
  scene: Phaser.Scene,
  gameObject: Phaser.GameObjects.Sprite,
  duration = 500
) {
  gameObject.setAlpha(0);
  scene.tweens.add({
    targets: gameObject,
    alpha: { value: 1, duration, ease: "Power1" },
  });
}

export function fixHackyBraveText(text: any, amount: any, yPos: number = 0) {
  try {
    // if (isBrave()) {
    if (true) {
      console.log("isBrave", true);
      // text.setLineSpacing(amount);
      text.updateText();
      // text.baselineY(0);
      // text.setPosition(text.x)
      // text.yPos = text.yPos + yPos;

      text
        .setInteractive({ draggable: true, useHandCursor: false })
        .on("pointerup", () => {
          // console.log("drag zone up", this.parentScene);
          console.log("Text pos", text.x, text.y);
        })
        .on("drag", (pointer: any, dragX: number, dragY: number) => {
          // console.log("drag zone drag", this.parentScene);
          text.x = dragX;
          text.y = dragY;
        });
    }
  } catch (err) {
    console.log("err: ", err);
  }
}

export function isBraveOnWindows() {
  return isBrave() && window.navigator.platform.match(/Win/i);
}

export function isBrave() {
  if ((window.navigator as any).brave != undefined) {
    if ((window.navigator as any).brave.isBrave.name == "isBrave") {
      return true;
    }
  } else {
    return false;
  }
}

export function linearmap(
  value: number,
  istart: number,
  istop: number,
  ostart: number,
  ostop: number
) {
  return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

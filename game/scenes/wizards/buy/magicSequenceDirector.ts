export class MagicSequenceDirector {
  bgScene: Phaser.Scene;
  buyScene: Phaser.Scene;
  homeScene: Phaser.Scene;

  constructor({
    bgScene,
    buyScene,
    homeScene,
  }: {
    bgScene: Phaser.Scene;
    buyScene: Phaser.Scene;
    homeScene: Phaser.Scene;
  }) {
    this.bgScene = bgScene;
    this.buyScene = buyScene;
    this.homeScene = homeScene;
  }
}

export function buildAnimationParticleClass({ anim }: { anim: any }) {
  return class AnimationParticle extends Phaser.GameObjects.Particles.Particle {
    t: number;
    i: number;
    constructor(emitter: any) {
      super(emitter);
      this.t = 0;
      this.i = 0;
    }
    update(delta: any, step: any, processors: any) {
      var result = super.update(delta, step, processors);
      this.t += delta;
      if (this.t >= anim.msPerFrame) {
        this.i++;
        if (this.i > anim.frames.length - 1) {
          this.i = 0;
        }
        this.frame = anim.frames[this.i].frame;
        this.t -= anim.msPerFrame;
      }
      return result;
    }
  };
}

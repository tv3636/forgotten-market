import Phaser from "phaser";
const GetFastValue = Phaser.Utils.Objects.GetFastValue;
const GetValue = Phaser.Utils.Objects.GetValue;

/*
 * Creates animations from aseprite exports but scoped to layers.
 *
 * This loader requires that you have an animation tag. E.g. just right click and add a frame "play".
 *
 * For export settings, use the same as recommended, except use the name:
 *
 * {layer}-{frame}
 *
 * **NEVER CHECK "extrude"!**
 *
 * See also:
 * - https://github.com/photonstorm/phaser3-examples/blob/master/public/src/plugins/custom%20file%20type.js
 * - https://github.com/photonstorm/phaser3-examples/blob/master/public/src/plugins/scene%20plugin%20test%201.js
 *
 * If you want to import aesprite the "normal" way, see brain.md or
 * https://github.com/photonstorm/phaser/blob/3dc66c3a4331a1a96584019da2cbe5c977471640/src/animations/AnimationManager.js
 */

export class AsepriteLayersAnimationLoaderPlugin extends Phaser.Plugins
  .BasePlugin {
  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);
  }

  createFromAsepriteWithLayers(key: string, tags: string[] = []) {
    var output: any[] = [];

    var data = this.game.cache.json.get(key);
    // console.log("createFromAsepriteWithLayers data:", data);

    if (!data) {
      return output;
    }

    // var _this = this;
    var _this = this.game.anims;

    var meta = GetValue(data, "meta", null);
    var frames = GetValue(data, "frames", null);

    if (meta && frames) {
      var frameTags = GetValue(meta, "frameTags", []);
      var layers = GetValue(meta, "layers", []);

      frameTags.forEach(function (tag: any) {
        layers.forEach(function (layer: any) {
          var animFrames: any[] = [];

          var layerName = GetFastValue(layer, "name", null);
          var frameName = GetFastValue(tag, "name", null);
          var from = GetFastValue(tag, "from", 0);
          var to = GetFastValue(tag, "to", 0);
          var direction = GetFastValue(tag, "direction", "forward");

          if (!frameName || !layerName) {
            //  Skip if no name
            return;
          }

          //  Get all the frames for this tag
          var tempFrames = [];
          var minDuration = Number.MAX_SAFE_INTEGER;

          for (var i = from; i <= to; i++) {
            var frameIdx = i.toString();
            var frameKey = `${layerName}-${frameIdx}`;
            var frame = frames[frameKey];

            if (frame) {
              var frameDuration = GetFastValue(
                frame,
                "duration",
                Number.MAX_SAFE_INTEGER
              );

              if (frameDuration < minDuration) {
                minDuration = frameDuration;
              }

              tempFrames.push({ frame: frameKey, duration: frameDuration });
            }
          }

          tempFrames.forEach(function (entry) {
            animFrames.push({
              key: key,
              frame: entry.frame,
              duration: minDuration - entry.duration,
            });
          });

          var totalDuration = minDuration * animFrames.length;

          if (direction === "reverse") {
            animFrames = animFrames.reverse();
          }

          //  Create the animation
          var configKey = `${layerName}-${frameName}`;
          // console.log("animation: ", configKey);
          var createConfig = {
            key: configKey,
            frames: animFrames,
            duration: totalDuration,
            yoyo: direction === "pingpong",
          };

          var result = _this.create(createConfig);

          if (result) {
            output.push(result);
          }
        });
      });
    }

    return output;
  }

  // via https://github.com/photonstorm/phaser/blob/3dc66c3a4331a1a96584019da2cbe5c977471640/src/animations/AnimationManager.js

  createFromAseprite(key: string, tags: string[] | null = null) {
    var output: any[] = [];

    var data = this.game.cache.json.get(key);
    // console.log("data: ", data);

    if (!data) {
      return output;
    }

    var _this = this.game.anims;

    var meta = GetValue(data, "meta", null);
    var frames = GetValue(data, "frames", null);

    if (meta && frames) {
      var frameTags = GetValue(meta, "frameTags", []);

      frameTags.forEach(function (tag: any) {
        var animFrames: any[] = [];

        var name = GetFastValue(tag, "name", null);
        var from = GetFastValue(tag, "from", 0);
        var to = GetFastValue(tag, "to", 0);
        var direction = GetFastValue(tag, "direction", "forward");

        if (!name) {
          //  Skip if no name
          return;
        }

        if (!tags || (tags && tags.indexOf(name) > -1)) {
          //  Get all the frames for this tag
          var tempFrames = [];
          var minDuration = Number.MAX_SAFE_INTEGER;

          for (var i = from; i <= to; i++) {
            var frameKey = i.toString();
            var frame = frames[frameKey];

            if (frame) {
              var frameDuration = GetFastValue(
                frame,
                "duration",
                Number.MAX_SAFE_INTEGER
              );

              if (frameDuration < minDuration) {
                minDuration = frameDuration;
              }

              tempFrames.push({ frame: frameKey, duration: frameDuration });
            }
          }

          tempFrames.forEach(function (entry) {
            animFrames.push({
              key: key,
              frame: entry.frame,
              duration: entry.duration - minDuration,
            });
          });

          var totalDuration = minDuration * animFrames.length;

          if (direction === "reverse") {
            animFrames = animFrames.reverse();
          }

          //  Create the animation
          var createConfig = {
            key: name,
            frames: animFrames,
            duration: totalDuration,
            yoyo: direction === "pingpong",
          };

          var result = _this.create(createConfig);

          if (result) {
            output.push(result);
          }
        }
      });
    }

    return output;
  }
}

# Spritesheet info

## The Tower Backgrounds

`BootScene.ts`

Has individual images for background.

You export them using the original layers export plugin.

## The Tower Itself

`tower.ts`

Uses aseprite sheet.
see: `game/plugins/asepriteLayersAnimationLoaderPlugin.ts` for instructions

Which is: `{layer}-{frame}`

# TexturePacker

Then use

```
    scene.load.multiatlas("floaters", "floaters.json");
    scene.load.atlas("squarerot", "squarerot.png", "squarerot.json");
```

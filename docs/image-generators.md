# Wizard Packs

For the Wizard NFT character packs, we have:

- for each size `{50,200,400,1024}`
- each trait as a layer. For Wizards: `[background, body, head, prop, familiar, rune]`
- all layers composite with no background
- all layers composite with no background, with sepia added
- all layers composite with background

### So the routes are something like:

- [+] `/art/:tokenSlug/trait/:traitSlug/:traitName.png` - the trait layer for the collection (e.g. "Wizzy Head.png")
- [-] `/art/:tokenSlug/:tokenId.zip` - downloadable package, everything, including sprites & layers with preset resizes
- [+] `/art/:tokenSlug/:tokenId.png` - regular image of the wizard add default size 400px
- [-] `/art/:tokenSlug/:tokenId/spritesheet.png` - full spritesheet
- [-] `/art/:tokenSlug/:tokenId/spritesheet.json` - full spritesheet.json
- [+] `/art/:tokenSlug/:tokenId/trait/:traitSlug.png` - a "wizard's" trait layer
- [+] `/art/:tokenSlug/:tokenId/:style.png` - stylized image
- [-] `/art/:tokenSlug/:tokenId/frame/:animationTag/:frameName.png` - full layers for an anim pos: "Kobald 0 left"
- [-] `/art/:tokenSlug/:tokenId/frame/:animationTag/:frameName/:traitName.png` - e.g. "head of kobald 0 facing left"
  head, walk, up

### With Parameters:

- `tokenSlug` - `{wizards,souls,warriors,...}` - slug name of token
- `tokenId` - A number, representing the token serial number
- `width` - A number for the width you want to generate
- `style` - `{full,parchment,nobg,...}` - The style of image you want. Logic is built into this name in code
- `traitSlug` - `{background,body,head,prop,familiar,rune,...}`
- `animationTag` - `{std,walk,swing,...}`
- `frameName` - `{default,up,r,...}`

### Examples

- http://localhost:3005/api/art/wizards/487/trait/head.png
- http://localhost:3005/api/art/wizards/107/default.png
- http://localhost:3005/api/art/wizards/107/nobg.png?width=700
- http://localhost:3005/api/art/wizards/108.png
- http://localhost:3005/api/art/wizards/108/sepia.png
- http://localhost:3005/api/art/wizards/trait/head/Prophet.png?trim=true

### Exporting Spritesheets

`{title}-{layer}-{tag}-{frame}.{extension}`

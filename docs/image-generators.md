# Wizard Packs

For the Wizard NFT character packs, we have:

- for each size `{50,200,400,1024}`
- each trait as a layer. For Wizards: `[background, body, head, prop, familiar, rune]`
- all layers composite with no background
- all layers composite with no background, with sepia added
- all layers composite with background

### So the routes are something like:

- `/art/:tokenSlug/trait/:width/:traitSlug/:traitName.png` - the trait layer for the collection (e.g. "Wizzy Head.png")

- `/art/:tokenSlug/:tokenId.zip` - downloadable package, everything, including sprites & layers with preset resizes
- `/art/:tokenSlug/:tokenId.png` - regular image of the wizard
- `/art/:tokenSlug/:tokenId/spritesheet.png` - full spritesheet
- `/art/:tokenSlug/:tokenId/spritesheet.json` - full spritesheet.json
- `/art/:tokenSlug/:tokenId/:width/frame/:animationTag/:frameName.png` - full layers for an animation position - e.g. "Kobald 0 facing left"
- `/art/:tokenSlug/:tokenId/:width/frame/:animationTag/:frameName/:traitName.png` - e.g. "head of kobald 0 facing left"
- `/art/:tokenSlug/:tokenId/:width/:style.png` - stylized image
- `/art/:tokenSlug/:tokenId/:width/:traitSlug.png` - a "wizard's" trait layer
  head, walk, up

### With Parameters:

- `tokenSlug` - `{wizards,souls,warriors,...}` - slug name of token
- `tokenId` - A number, representing the token serial number
- `width` - A number for the width you want to generate
- `style` - `{full,parchment,nobg,...}` - The style of image you want. Logic is built into this name in code
- `traitSlug` - `{background,body,head,prop,familiar,rune,...}`
- `animationTag` - `{std,walk,swing,...}`
- `frameName` - `{default,up,r,...}`

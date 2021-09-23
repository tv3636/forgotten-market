import sharp from "sharp";
import path from "path";
import wizardLayers from "../../public/static/nfts/wizards/wizards-layers.json";
import { keyBy } from "lodash";

// public/static/nfts/wizards/forgotten-runes-wizards-cult-traits.png

/*
### So the routes are something like:

- [-] `/art/:tokenSlug/trait/:width/:traitSlug/:traitName.png` - the trait layer for the collection (e.g. "Wizzy Head.png")
- [-] `/art/:tokenSlug/:tokenId.zip` - downloadable package, everything, including sprites & layers with preset resizes
- [+] `/art/:tokenSlug/:tokenId.png` - regular image of the wizard add default size 400px
- [-] `/art/:tokenSlug/:tokenId/spritesheet.png` - full spritesheet
- [-] `/art/:tokenSlug/:tokenId/spritesheet.json` - full spritesheet.json
- [+] `/art/:tokenSlug/:tokenId/trait/:traitSlug.png` - a "wizard's" trait layer
- [+] `/art/:tokenSlug/:tokenId/:style.png` - stylized image
- [-] `/art/:tokenSlug/:tokenId/:width/frame/:animationTag/:frameName.png` - full layers for an anim pos: "Kobald 0 left"
- [-] `/art/:tokenSlug/:tokenId/:width/frame/:animationTag/:frameName/:traitName.png` - e.g. "head of kobald 0 facing left"
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

*/

export const ROOT_PATH = path.join(process.cwd());

export const stripExtension = (s: string) => s.replace(/\.[^/.]+$/, "");

// Wizard-specific configs
export const wizardLayersIdx: { [key: string]: any } = keyBy(
  wizardLayers,
  "idx"
);

export async function getWizardPartsBuffer() {
  return sharp(
    path.join(
      ROOT_PATH,
      "public/static/nfts/wizards/forgotten-runes-wizards-cult-traits.png"
    )
  )
    .png()
    .toBuffer();
}
export const wizardLayerNames = [
  "background",
  "body",
  "familiar",
  "head",
  "prop",
  "rune",
];

export const tokenLayerNames: { [key: string]: string[] } = {
  wizards: wizardLayerNames,
};

export async function extractWizardFrame({
  partsBuffer,
  frameNum,
}: {
  partsBuffer: Buffer;
  frameNum: number;
}) {
  const COLUMNS = 19,
    // ROWS = 18,
    width = 50,
    height = 50;

  if (frameNum === 7777) {
    return;
  }

  const row = Math.floor(frameNum / COLUMNS);
  const col = frameNum % COLUMNS;
  const top = row * height;
  const left = col * width;

  const buffer = await sharp(partsBuffer)
    .extract({ left, top, width, height })
    .png()
    .toBuffer();
  return buffer;
}

// Routing functions

export async function getTokenPartsBuffer({
  tokenSlug,
}: {
  tokenSlug: string;
}) {
  switch (tokenSlug) {
    default:
    case "wizards": {
      return getWizardPartsBuffer();
    }
  }
}

export async function getTokenLayersData({
  tokenSlug,
  tokenId,
}: {
  tokenSlug: string;
  tokenId: string;
}) {
  switch (tokenSlug) {
    default:
    case "wizards": {
      return wizardLayersIdx[tokenId];
    }
  }
}

// --------

export async function getTraitLayerBuffer({
  tokenSlug,
  tokenId,
  width,
  traitSlug,
  trim,
}: {
  tokenSlug: string;
  tokenId: string;
  width: number;
  traitSlug: string;
  trim?: boolean;
}) {
  const partsBuffer = await getTokenPartsBuffer({ tokenSlug });
  const wizardLayerData = await getTokenLayersData({ tokenSlug, tokenId });

  // todo generalize
  const frameNum: number =
    wizardLayerData[traitSlug]?.length > 0
      ? parseInt(wizardLayerData[traitSlug])
      : -1;

  if (frameNum < 0) {
    throw new Error(`Unknown trait ${traitSlug}`);
  }

  const layerPartBuffer = await extractWizardFrame({
    partsBuffer,
    frameNum,
  });

  const size = width;
  let buffer = await sharp(layerPartBuffer)
    .resize(size, size, {
      fit: sharp.fit.fill,
      kernel: sharp.kernel.nearest,
    })
    .toBuffer();

  if (trim) {
    buffer = await sharp(buffer).trim().toBuffer();
  }

  return buffer;
}

export type GetStyledTokenBufferProps = {
  tokenSlug: string;
  tokenId: string;
  width: number;
  style: string;
  trim?: boolean;
  noBg?: boolean;
};

export async function getStyledTokenBuffer({
  tokenSlug,
  tokenId,
  width,
  style,
  trim,
  noBg,
}: GetStyledTokenBufferProps) {
  const partsBuffer = await getTokenPartsBuffer({ tokenSlug });
  const wizardLayerData = await getTokenLayersData({ tokenSlug, tokenId });

  const layerNames = tokenLayerNames[tokenSlug];

  let buffers: Buffer[] = [];

  for (let i = 0; i < layerNames.length; i++) {
    const traitSlug = layerNames[i];
    const frameNum: number =
      wizardLayerData[traitSlug]?.length > 0
        ? parseInt(wizardLayerData[traitSlug])
        : -1;

    if (frameNum < 0 || frameNum == 7777) {
      continue;
    }

    const layerPartBuffer = await extractWizardFrame({
      partsBuffer,
      frameNum,
    });

    if (layerPartBuffer) {
      buffers = [...buffers, layerPartBuffer];
    }
  }

  if (noBg) {
    buffers.shift(); // remove bg
  }

  let [bgBuffer, ...rest] = buffers;

  const restBuffers = rest.map((r: any) => ({ input: r }));
  const canvas = await sharp(bgBuffer).composite(restBuffers).png().toBuffer();

  const size = width;
  let buffer = await sharp(canvas)
    .resize(size, size, {
      fit: sharp.fit.fill,
      kernel: sharp.kernel.nearest,
    })
    .toBuffer();

  if (trim) {
    buffer = await sharp(buffer).trim().toBuffer();
  }

  return buffer;
}

import { NextApiRequest, NextApiResponse } from "next";
import request from "request";
import fs from "fs";
import * as os from "os";
import stream, { PassThrough } from "stream";
import {
  buildReadme,
  buildSpritesheet,
  getAllFamiliarTurnaroundFrameBuffers,
  getAllTurnaroundFrameBuffers,
  getRidingTokenBodyBuffer,
  getStyledTokenBuffer,
  GetStyledTokenBufferProps,
  getTokenFrameNumber,
  getTokenLayersData,
  getTraitLayerBufferForTokenId,
  slugify,
  stripExtension,
  tokenLayerNames,
  tokenTraitsByIndex,
} from "../../../../lib/art/artGeneration";
import archiver from "archiver"; // https://github.com/archiverjs/node-archiver
import { forEach, isNumber, size } from "lodash";
import sharp from "sharp";

function bufferToStream(buffer: Buffer) {
  var bufferStream = new stream.PassThrough();
  bufferStream.end(buffer);
  return bufferStream;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(404);
  }

  let { tokenSlug, tokenId, width, trim } = req.query;
  let trimOption = !trim || trim === "0" ? false : true;
  let widthOption = !width ? 400 : parseInt(width as string);
  let isZip = false;

  if ((tokenId as string).match(/\.zip$/)) {
    isZip = true;
  }
  tokenId = stripExtension(tokenId as string);
  const tokenData = await getTokenLayersData({
    tokenSlug: tokenSlug as string,
    tokenId: tokenId as string,
  });

  if (isZip) {
    const sizes = [50, 400, 1024];
    const scales = [1, 8, 20.48];

    let zipFiles = [];

    for (let i = 0; i < sizes.length; i++) {
      const size = sizes[i];
      const scale = scales[i];

      // single token buffer
      let genOptions: GetStyledTokenBufferProps = {
        tokenSlug: tokenSlug as string,
        tokenId: tokenId as string,
        width: size,
        trim: trimOption,
      };
      const singleTokenBuffer = await getStyledTokenBuffer(genOptions);
      zipFiles.push([
        bufferToStream(singleTokenBuffer),
        { name: `${size}/${tokenId}-${slugify(tokenData.name)}.png` },
      ]);

      // build layers
      const tokenTraitLayerNames = tokenLayerNames[tokenSlug as string];
      for (let j = 0; j < tokenTraitLayerNames.length; j++) {
        const traitSlug = tokenTraitLayerNames[j];
        const frameNum = await getTokenFrameNumber({
          tokenSlug: tokenSlug as string,
          tokenId,
          traitSlug,
        });
        if (frameNum < 0 || frameNum == 7777) {
          continue;
        }

        const layerDescription =
          tokenTraitsByIndex[tokenSlug as string][frameNum.toString()];
        const layerBuffer = await getTraitLayerBufferForTokenId({
          tokenSlug: tokenSlug as string,
          tokenId: tokenId as string,
          width: size,
          traitSlug: traitSlug,
          trim: trimOption,
        });

        zipFiles.push([
          bufferToStream(layerBuffer),
          {
            name: `${size}/${traitSlug}-${slugify(layerDescription.label)}.png`,
          },
        ]);
      }

      // build nobg
      let noBgGenOptions: GetStyledTokenBufferProps = {
        tokenSlug: tokenSlug as string,
        tokenId: tokenId as string,
        width: size,
        trim: trimOption,
        noBg: true,
      };
      const noBgTokenBuffer = await getStyledTokenBuffer(noBgGenOptions);

      zipFiles.push([
        bufferToStream(noBgTokenBuffer),
        { name: `${size}/${tokenId}-${slugify(tokenData.name)}-nobg.png` },
      ]);

      // build sepia
      let parchmentGenOptions: GetStyledTokenBufferProps = {
        tokenSlug: tokenSlug as string,
        tokenId: tokenId as string,
        width: size,
        trim: trimOption,
        sepia: true,
      };
      const parchmentTokenBuffer = await getStyledTokenBuffer(
        parchmentGenOptions
      );
      zipFiles.push([
        bufferToStream(parchmentTokenBuffer),
        { name: `${size}/${tokenId}-${slugify(tokenData.name)}-parchment.png` },
      ]);

      // build turnarounds
      const turnarounds = await getAllTurnaroundFrameBuffers({
        tokenId,
        tokenSlug: tokenSlug as string,
        size,
      });
      turnarounds.forEach(({ name, buffer }) => {
        zipFiles.push([
          bufferToStream(buffer),
          { name: `${size}/turnarounds/${name}` },
        ]);
      });

      // build rider
      const ridingBodyBuffer = await getRidingTokenBodyBuffer({
        tokenSlug: tokenSlug as string,
        tokenId: tokenId as string,
        scale,
      });
      zipFiles.push([
        bufferToStream(ridingBodyBuffer),
        { name: `${size}/${tokenId}-${slugify(tokenData.name)}-riding.png` },
      ]);

      // right here

      // build familiars
      const wizardLayerData = await getTokenLayersData({
        tokenSlug: tokenSlug as string,
        tokenId,
      });

      const hasFamiliar =
        isNumber(parseInt(wizardLayerData.familiar)) &&
        parseInt(wizardLayerData.familiar) !== 7777;

      if (hasFamiliar) {
        const familiarTurnarounds = await getAllFamiliarTurnaroundFrameBuffers({
          tokenId,
          tokenSlug: tokenSlug as string,
          size,
        });
        familiarTurnarounds.forEach(({ name, buffer }) => {
          zipFiles.push([
            bufferToStream(buffer),
            { name: `${size}/familiar-turnarounds/${name}` },
          ]);
        });
      }
    }

    // build spritesheet
    let genOptions = {
      tokenSlug: tokenSlug as string,
      tokenId: tokenId as string,
      width: 50,
      image: true,
    };
    const { buffer, frameFiles } = await buildSpritesheet(genOptions);

    // resize here
    for (let i = 0; i < sizes.length; i++) {
      const size = sizes[i];
      for (let f = 0; f < frameFiles.length; f++) {
        const frameFile = frameFiles[f];
        const { filename, buffer: frameFileBuffer } = frameFile;

        const imgSharp = await sharp(frameFileBuffer);
        const imgMetadata = await imgSharp.metadata();
        const newImgWidth = Math.floor((imgMetadata.width || 50) * scales[i]);
        const newImgHeight = Math.floor((imgMetadata.height || 50) * scales[i]);

        const resizedBuffer = await imgSharp
          .resize(newImgWidth, newImgHeight, {
            fit: sharp.fit.fill,
            kernel: sharp.kernel.nearest,
          })
          .toBuffer();

        zipFiles.push([
          bufferToStream(resizedBuffer),
          { name: `${size}/spritesheet/${filename}` },
        ]);
      }
    }

    // build readme
    const readmeText = await buildReadme({
      tokenSlug: tokenSlug as string,
      tokenId: tokenId as string,
    });
    zipFiles.push([readmeText, { name: "README.md" }]);

    // Tell the browser that this is a zip file.
    res.writeHead(200, {
      "Content-Type": "application/zip",
      "Content-disposition": `attachment; filename=${tokenId}.zip`,
    });

    // create the zipfile
    const zip = archiver("zip");
    zip.pipe(res); // Pipe the zip file to the response
    forEach(zipFiles, ([buffer, opts]) => {
      zip.append(buffer as stream.Readable, opts as any);
    });
    zip.finalize();
  } else {
    // show the single Wizard token
    let genOptions: GetStyledTokenBufferProps = {
      tokenSlug: tokenSlug as string,
      tokenId: tokenId as string,
      width: widthOption,
      trim: trimOption,
    };
    const singleTokenBuffer = await getStyledTokenBuffer(genOptions);

    const bufferStream = new stream.PassThrough();
    bufferStream.end(singleTokenBuffer);
    return bufferStream.pipe(res);
  }
}

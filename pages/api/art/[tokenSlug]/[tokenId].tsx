import { NextApiRequest, NextApiResponse } from "next";
import request from "request";
import fs from "fs";
import * as os from "os";
import stream, { PassThrough } from "stream";
import {
  buildReadme,
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
import { forEach } from "lodash";

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
  console.log("req.query: ", req.query);

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

  // single token buffer
  let genOptions: GetStyledTokenBufferProps = {
    tokenSlug: tokenSlug as string,
    tokenId: tokenId as string,
    width: widthOption,
    trim: trimOption,
  };
  const singleTokenBuffer = await getStyledTokenBuffer(genOptions);

  let zipFiles = [
    [
      bufferToStream(singleTokenBuffer),
      { name: `${tokenId}-${slugify(tokenData.name)}.png` },
    ],
  ];

  if (isZip) {
    // build readme
    const readmeText = await buildReadme({
      tokenSlug: tokenSlug as string,
      tokenId: tokenId as string,
    });

    // build layers
    const tokenTraitLayerNames = tokenLayerNames[tokenSlug as string];
    for (let i = 0; i < tokenTraitLayerNames.length; i++) {
      const traitSlug = tokenTraitLayerNames[i];
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
        width: widthOption,
        traitSlug: traitSlug,
        trim: trimOption,
      });
      zipFiles.push([
        bufferToStream(layerBuffer),
        { name: `${traitSlug}-${slugify(layerDescription.label)}.png` },
      ]);
    }

    // build nobg
    let noBgGenOptions: GetStyledTokenBufferProps = {
      tokenSlug: tokenSlug as string,
      tokenId: tokenId as string,
      width: widthOption,
      trim: trimOption,
      noBg: true,
    };
    const noBgTokenBuffer = await getStyledTokenBuffer(noBgGenOptions);

    zipFiles.push([
      bufferToStream(noBgTokenBuffer),
      { name: `${tokenId}-${slugify(tokenData.name)}-nobg.png` },
    ]);

    // build sepia
    let parchmentGenOptions: GetStyledTokenBufferProps = {
      tokenSlug: tokenSlug as string,
      tokenId: tokenId as string,
      width: widthOption,
      trim: trimOption,
      sepia: true,
    };
    const parchmentTokenBuffer = await getStyledTokenBuffer(
      parchmentGenOptions
    );
    zipFiles.push([
      bufferToStream(parchmentTokenBuffer),
      { name: `${tokenId}-${slugify(tokenData.name)}-parchment.png` },
    ]);

    res.writeHead(200, {
      // Tell the browser that this is a zip file.
      "Content-Type": "application/zip",
      "Content-disposition": `attachment; filename=${tokenId}.zip`,
    });

    // create the zipfile
    const zip = archiver("zip");
    zip.pipe(res); // Pipe the zip file to the response
    zip.append(readmeText, { name: "README.md" });
    forEach(zipFiles, ([buffer, opts]) => {
      zip.append(buffer as stream.Readable, opts as any);
    });
    zip.finalize();
  } else {
    // show the single Wizard token
    const bufferStream = new stream.PassThrough();
    bufferStream.end(singleTokenBuffer);
    return bufferStream.pipe(res);
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import request from "request";
import fs from "fs";
import * as os from "os";
import stream from "stream";
import {
  getRiderOnMountImageBuffer,
  getTraitLayerBuffer,
  getTraitLayerBufferForTokenId,
  getWizardPartsBuffer,
  stripExtension,
} from "../../../../../../../lib/art/artGeneration";
import sharp from "sharp";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(404);
  }

  let { tokenSlug, tokenId, ridingTokenSlug, ridingTokenId, width, trim } =
    req.query;

  let trimOption = !trim || trim === "0" ? false : true;
  let widthOption = !width ? 400 : parseInt(width as string);

  let buffer = await getRiderOnMountImageBuffer({
    tokenSlug: tokenSlug as string,
    tokenId: tokenId as string,
    ridingTokenSlug: ridingTokenSlug as string,
    ridingTokenId: ridingTokenId as string,
    width: widthOption,
    trim: trimOption,
  });

  buffer = await sharp(buffer)
    // .resize(500, 500, {
    //   fit: sharp.fit.fill,
    //   kernel: sharp.kernel.nearest,
    // })
    .toBuffer();

  var bufferStream = new stream.PassThrough();
  bufferStream.end(buffer);
  return bufferStream.pipe(res);
}

// http://localhost:3005/api/art/wizards/487/riding/pony/123

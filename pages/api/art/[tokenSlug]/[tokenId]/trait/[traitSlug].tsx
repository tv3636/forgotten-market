import { NextApiRequest, NextApiResponse } from "next";
import request from "request";
import fs from "fs";
import * as os from "os";
import stream from "stream";
import {
  getTraitLayerBuffer,
  getTraitLayerBufferForTokenId,
  getWizardPartsBuffer,
  stripExtension,
} from "../../../../../../lib/art/artGeneration";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(404);
  }
  console.log("req.query: ", req.query);

  let { tokenSlug, tokenId, width, traitSlug, trim } = req.query;
  let trimOption = !trim || trim === "0" ? false : true;
  let widthOption = !width ? 400 : parseInt(width as string);

  traitSlug = stripExtension(traitSlug as string);

  const buffer = await getTraitLayerBufferForTokenId({
    tokenSlug: tokenSlug as string,
    tokenId: tokenId as string,
    width: widthOption,
    traitSlug: traitSlug as string,
    trim: trimOption,
  });

  var bufferStream = new stream.PassThrough();
  bufferStream.end(buffer);
  return bufferStream.pipe(res);
}

import { NextApiRequest, NextApiResponse } from "next";
import request from "request";
import fs from "fs";
import * as os from "os";
import stream from "stream";
import {
  getTraitLayerBuffer,
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

  const url =
    "https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-417.png";

  traitSlug = stripExtension(traitSlug as string);

  // const buffer = await getWizardPartsBuffer();
  const buffer = await getTraitLayerBuffer({
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

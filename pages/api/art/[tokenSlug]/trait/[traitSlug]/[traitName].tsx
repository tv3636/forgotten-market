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

  let { tokenSlug, traitSlug, traitName, width, trim } = req.query;
  let trimOption = !trim || trim === "0" ? false : true;
  let widthOption = !width ? 400 : parseInt(width as string);

  traitName = stripExtension(traitName as string);

  const buffer = await getTraitLayerBuffer({
    tokenSlug: tokenSlug as string,
    traitSlug: traitSlug as string,
    traitName: traitName,
    width: widthOption,
    trim: trimOption,
  });

  var bufferStream = new stream.PassThrough();
  bufferStream.end(buffer);
  return bufferStream.pipe(res);
}

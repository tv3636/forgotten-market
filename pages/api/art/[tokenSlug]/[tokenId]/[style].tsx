import { NextApiRequest, NextApiResponse } from "next";
import request from "request";
import fs from "fs";
import * as os from "os";
import stream from "stream";
import {
  getStyledTokenBuffer,
  GetStyledTokenBufferProps,
  getTraitLayerBuffer,
  getWizardPartsBuffer,
  stripExtension,
  VALID_TOKEN_STYLES,
} from "../../../../../lib/art/artGeneration";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(404);
  }
  console.log("req.query: ", req.query);

  let { tokenSlug, tokenId, width, style, trim } = req.query;
  let trimOption = !trim || trim === "0" ? false : true;
  let widthOption = !width ? 400 : parseInt(width as string);

  const styleSlug = style ? stripExtension(style as string) : "default";
  if (!VALID_TOKEN_STYLES.includes(styleSlug)) {
    throw new Error(`${styleSlug} is not a valid style`);
  }

  let genOptions: GetStyledTokenBufferProps = {
    tokenSlug: tokenSlug as string,
    tokenId: tokenId as string,
    width: widthOption,
    // style: styleSlug,
    trim: trimOption,
  };

  if (styleSlug === "nobg") {
    genOptions.noBg = true;
  }

  if (styleSlug === "sepia") {
    genOptions.sepia = true;
  }

  const buffer = await getStyledTokenBuffer(genOptions);

  var bufferStream = new stream.PassThrough();
  bufferStream.end(buffer);
  return bufferStream.pipe(res);
}

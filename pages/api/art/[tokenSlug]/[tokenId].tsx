import { NextApiRequest, NextApiResponse } from "next";
import request from "request";
import fs from "fs";
import * as os from "os";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(404);
  }
  console.log("req.query: ", req.query);

  const { tokenSlug, tokenId } = req.query;

  const url =
    "https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-417.png";

  return request.get(url).pipe(res);
}

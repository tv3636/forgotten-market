import { NextApiRequest, NextApiResponse } from "next";
import request from "request";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(404);
  }

  const url =
    "https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-417.png";

  return request.get(url).pipe(res);
}

import { NextApiRequest, NextApiResponse } from "next";
import pinataSDK from "@pinata/sdk";

const pinata = pinataSDK(
  process.env.PINATA_ID || "",
  process.env.PINATA_SECRET_KEY || ""
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(404);
  }

  try {
    const response = await pinata.pinJSONToIPFS({
      name: req.body?.title,
      description: req.body?.story,
      background_color: req.body?.bg_color, // Note: needs to be without # for compliance with spec
      attributes: [
        { trait_type: "Artifact Address", value: req.body.address },
        { trait_type: "Artifact Token ID", value: req.body.token_id },
        { trait_type: "Pixel Art", value: req.body?.pixel_art ?? false },
      ],
    });
    return res.status(201).json({ hash: response.IpfsHash });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: "IPFS upload issue" });
  }
}

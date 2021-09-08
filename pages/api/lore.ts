import { NextApiRequest, NextApiResponse } from "next";
import pinataSDK from "@pinata/sdk";

// TODO: replace with .env vars
const pinata = pinataSDK(
  "8ffb530286f0f2abe486",
  "d6cb8112672ebd58416a834b88621656dbc27dad91cbe5d73a7f83f72dc1dbcd"
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
      background_color: req.body?.bg_color, // Note: needs to be without #
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

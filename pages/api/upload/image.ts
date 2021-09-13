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
  // TODO: can we validate the a signing of the wallet and add this as metadata, so that we can filter stuff out if we need to?
  const readStream = null;

  try {
    // https://github.com/PinataCloud/Pinata-SDK#pinFileToIPFS-anchor
    const response = await pinata.pinFileToIPFS(readStream, {
      pinataMetadata: {
        name: "filename",
        keyvalues: {
          uploader: "address-of-uploader-TODO",
        },
      },
    });
    return res.status(201).json({ hash: response.IpfsHash });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: "IPFS upload issue" });
  }
}

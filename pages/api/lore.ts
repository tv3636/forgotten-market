import { NextApiRequest, NextApiResponse } from "next";
import pinataSDK from "@pinata/sdk";
import { utils } from "ethers";
import { getProvider } from "../../hooks/useProvider";
import {
  getSoulsContract,
  getWizardsContract,
} from "../../contracts/ForgottenRunesWizardsCultContract";
import { getERC721Contract } from "../../contracts/ERC721Contract";

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

  if (!req.body?.signature || !req.body?.token_id || !req.body?.token_address) {
    const errorMessage = `Must have all set: signature ${req.body?.signature}, token_id ${req.body?.token_id} and token_address ${req.body?.token_address}`;
    console.error(errorMessage);
    return res.status(400).json({
      error: errorMessage,
    });
  }

  const tokenId = req.body.token_id;
  const tokenAdddress = req.body.token_address;
  console.log("Signature:", req.body.signature);
  console.log("Token Address:", tokenAdddress);
  console.log("Token ID:", tokenId);

  const signingAddress = utils.verifyMessage(
    tokenId.toString(),
    req.body.signature
  );

  const contract = await getERC721Contract({
    contractAddress: tokenAdddress,
    provider: getProvider(true),
  });

  const owner = await contract.ownerOf(tokenId);

  if (owner.toLowerCase() !== signingAddress.toLowerCase()) {
    const error_message = `Signature address ${signingAddress.toLowerCase()} is not the owner of token ${tokenId} in contract ${
      contract.address
    }. Real owner is: ${owner.toLowerCase()}`;
    console.error(error_message);
    return res.status(403).json({
      error: error_message,
    });
  }

  try {
    // console.log("pinning json");
    const response = await pinata.pinJSONToIPFS({
      name: req.body?.title,
      description: req.body?.story,
      background_color: req.body?.bg_color,
      attributes: [
        { trait_type: "Token Address", value: tokenAdddress },
        { trait_type: "Token ID", value: tokenId },
        { trait_type: "Creator", value: signingAddress },
      ],
    });
    return res.status(201).json({ hash: response.IpfsHash });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: "IPFS upload issue" });
  }
}
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

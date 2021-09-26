import { NextApiRequest, NextApiResponse } from "next";
import pinataSDK from "@pinata/sdk";
import { ethers, utils } from "ethers";
import { getProvider } from "../../hooks/useProvider";
import { getWizardsContract } from "../../contracts/ForgottenRunesWizardsCultContract";
import { recoverAddress } from "@ethersproject/transactions/src.ts/index";

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

  if (!req.body?.signature || !req.body?.wizard_id) {
    console.error(
      `No signature ${req.body?.signature} or wizard_id ${req.body?.wizard_id}`
    );
    return res.status(400).json({
      error:
        "You must supply both a signature and a wizard id that was signed...",
    });
  }

  console.log("Signature:", req.body.signature);
  console.log("Wizard ID:", req.body.wizard_id);

  const signingAddress = await utils.verifyMessage(
    req.body.wizard_id.toString(),
    req.body.signature
  );

  const wizardContract = getWizardsContract({ provider: getProvider(true) });
  const wizardOwner = await wizardContract.ownerOf(req.body.wizard_id);

  if (wizardOwner.toLowerCase() !== signingAddress.toLowerCase()) {
    console.error(
      `Wizard signature address ${signingAddress} is not owner ${wizardOwner}`
    );
    return res.status(403).json({
      error: `Address ${signingAddress} does not own wizard ${req.body.wizard_id}, ${wizardOwner} does instead.`,
    });
  }

  try {
    // console.log("pinning json");
    const response = await pinata.pinJSONToIPFS({
      name: req.body?.title,
      description: req.body?.story,
      background_color: req.body?.bg_color,
      attributes: [
        { trait_type: "Wizard ID", value: req.body.wizard_id },
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

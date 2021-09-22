import { toast } from "react-toastify";
import { getBookOfLoreContract } from "../../contracts/ForgottenRunesWizardsCultContract";
import { LoreAPISubmitParams } from "../../pages/lore/add";
import Bluebird from "bluebird";
import parseDataUrl from "parse-data-url";
import client from "../../lib/graphql";
import { gql } from "@apollo/client";
import { NORMALIZED_WIZARD_CONTRACT_ADDRESS } from "../Lore/loreSubgraphUtils";
import { getLoreUrl } from "../Lore/loreUtils";
import { NETWORK } from "../../constants";
import replaceAsync from "string-replace-async";
import axios from "axios";
import { Flex } from "rebass";

export const pinFileToIPFS = async (
  base64string: string,
  signature: string,
  tokenId: number,
  tokenContract: string
) => {
  const blob = await (await fetch(base64string)).blob();

  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  //we gather a local file for this example, but any valid readStream source will work here.
  let data = new FormData();
  data.append("file", blob);

  //pinataOptions are optional
  // data.append(
  //   "pinataOptions",
  //   JSON.stringify({
  //     wrapWithDirectory: true,
  //   })
  // );
  data.append(
    "pinataMetadata",
    JSON.stringify({
      name: "LoreImage",
      keyvalues: {
        signature: signature,
        token_id: tokenId,
        token_contract: tokenContract,
      },
    })
  );

  const uploadResponse = await axios.post(url, data, {
    maxBodyLength: Infinity, //this is needed to prevent axios from erroring out with large files
    headers: {
      // @ts-ignore
      "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
      pinata_api_key: process.env.NEXT_PUBLIC_LORE_IMAGES_PINATA_ID,
      pinata_secret_api_key:
        process.env.NEXT_PUBLIC_LORE_IMAGES_PINATA_SECRET_KEY,
    },
  });

  if (uploadResponse.status !== 200 && uploadResponse.status !== 201) {
    console.error(uploadResponse);
    throw Error(`Unable to upload image to ipfs: ${uploadResponse.statusText}`);
  }

  return uploadResponse.data;
};

export const onSubmitAddLoreForm = async ({
  values,
  currentWizard,
  setErrorMessage,
  setSubmitting,
  currentStory,
  currentTitle,
  currentBgColor,
  web3Settings,
  router,
}: any) => {
  console.log("onSubmit", currentWizard, values);
  setErrorMessage(null);

  if (!currentWizard?.tokenId) {
    toast.error(`Sorry, there was a problem: no wizard selected`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
    });

    console.log("currentWizard?.tokenId: ", currentWizard?.tokenId);
    setErrorMessage("No Wizard selected. Please select a Wizard above");
    setSubmitting(false);
    return false;
  }

  if (!currentStory) {
    toast.error(`Sorry, there was a problem: need either story to submit`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
    });
    setErrorMessage("Need a story to be present");
    return false;
  }

  setSubmitting(true);

  const provider = web3Settings.injectedProvider;
  const { chainId } = await provider.getNetwork();
  const appChainId = process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID || 4; // Rinkeby default
  const network = NETWORK(parseInt(appChainId as string));
  const appChainName = network?.name || "rinkeby";

  // console.log("appChainId: ", appChainId);
  // console.log("chainId: ", chainId);

  if (chainId.toString() !== appChainId.toString()) {
    toast.error(
      `Wrong Network. Please change your network to ${appChainName} and try again`,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      }
    );
    setSubmitting(false);
    return false;
  }

  const signer = provider.getSigner();

  const loreContract = await getBookOfLoreContract({
    provider: provider,
  });

  toast.info("Signing wizard ID to verify ownership...", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
  });

  let signature: string;

  try {
    signature = await signer.signMessage(currentWizard.tokenId);
  } catch (err: any) {
    console.log("err: ", err);
    toast.error(`Sorry, there was a problem when signing: ${err.message}`, {
      position: "top-right",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
    });
    setSubmitting(false);
    return false;
  }

  toast.dismiss();

  // Image upload
  let storyWithUploadedImages;
  try {
    toast.info("Uploading local images to IPFS...", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
    });
    storyWithUploadedImages = await replaceAsync(
      currentStory,
      /!\[(.*?)\]\(((?:data).*?)\)/gim,
      // @ts-ignore
      async (whole: string, alt: string, base64image: string) => {
        const res = await pinFileToIPFS(
          base64image,
          signature,
          currentWizard.tokenId,
          process.env.NEXT_PUBLIC_REACT_APP_WIZARDS_CONTRACT_ADDRESS as string
          // TODO: obvs will have to refactor above to more generic tokens/contracts
        );
        return `![${alt}](ipfs://${res.IpfsHash})`; // leaving as ipfs://  so we can use as-is, can always replace on frontend to another provider
      }
    );
  } catch (err: any) {
    console.log("err: ", err);
    toast.dismiss();
    toast.error(`Sorry, there was a problem when signing: ${err.message}`, {
      position: "top-right",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
    });
    setSubmitting(false);
    return false;
  }

  toast.dismiss();

  toast.info("Uploading lore...", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
  });

  let loreBody: LoreAPISubmitParams = {
    wizard_id: currentWizard.tokenId,
    signature: signature,
    title: currentTitle,
    story: storyWithUploadedImages,
    pixel_art: values?.pixelArt ?? false,
    bg_color: currentBgColor,
  };

  console.log("loreBody: ", loreBody);
  let response, apiResponse;

  try {
    response = await fetch("/api/lore", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loreBody),
    });

    apiResponse = await response.json();
  } catch (err: any) {
    console.error(err);
    toast.dismiss();
    toast.error(`Sorry, there was a problem: ${err?.message}`, {
      position: "top-right",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
    });
    setSubmitting(false);
    return false;
  }

  toast.dismiss();

  if (response.status !== 201 && response.status !== 200) {
    console.error(apiResponse);

    toast.error(`Sorry, there was a problem with IPFS upload`, {
      position: "top-right",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
    });
    setSubmitting(false);
    return false;
  }

  console.log(apiResponse);

  try {
    let toastMsg = "Confirming your lore on chain";
    let txToastId = toast.info(toastMsg, {
      position: "top-right",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: false,
      progress: 0,
    });

    const tx = await loreContract
      //@ts-ignore
      .connect(signer)
      .addLore(
        process.env.NEXT_PUBLIC_REACT_APP_WIZARDS_CONTRACT_ADDRESS,
        currentWizard.tokenId,
        0,
        values.nsfw,
        `ipfs://${apiResponse.hash}`,
        { gasLimit: 300000 } //TODO: actual gas limit
      );

    console.log("tx: ", tx);
    // TODO: this should read the connected network and use that block explorer, not an environment variable
    const etherscanURL = `${process.env.NEXT_PUBLIC_REACT_APP_BLOCK_EXPLORER}/tx/${tx.hash}`;

    toast.update(txToastId, {
      render: () => (
        <Flex flexDirection={"column"}>
          <p>{toastMsg}</p>
          <p>
            <a href={etherscanURL} target="_blank">
              View on Etherscan
            </a>
          </p>
        </Flex>
      ),
      type: toast.TYPE.INFO,
    });

    const receipt = await tx.wait();
    console.log(`receipt: ${JSON.stringify(receipt)}`);

    // right here
    // freeze the editor
    // pulse the text
    // make a loader
    // and redirect only after the page is done, go directly to the lore page
    // pass waiting for indexing / confetti
    if (receipt.status === 1) {
      await router.push(
        `/lore/add?waitForTxHash=${receipt.transactionHash}&wizardId=${currentWizard.tokenId}`
      );
      //
    } else {
      toast.update(txToastId, {
        render: () => (
          <div>
            <p>{`Sorry, it appears your transaction may have failed (?)`}</p>
            <p>
              <a href={etherscanURL} target="_blank">
                View on Etherscan
              </a>
            </p>
          </div>
        ),
        type: toast.TYPE.ERROR,
      });
      setSubmitting(false);
      return false;
    }
  } catch (err: any) {
    console.log("err: ", err);
    toast.error(`Sorry, there was a problem: ${err.message}`, {
      position: "top-right",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
    });
    setSubmitting(false);
    return false;
  }

  setSubmitting(false);
  return true;
};

export type ImageUploadAPIParams = {
  address: string;
  signature: string;
  wizardId: string;
  img: any;
};

export async function uploadBookOfLoreImage({
  imgDataUri,
  wizardId,
  toastId,
}: {
  wizardId: string; // just for metadata, not technically require
  imgDataUri: string;
  toastId: any;
}) {
  const address = "0x0";
  const signature = "0x0";
  // https://github.com/killmenot/parse-data-url
  const parsedImg = parseDataUrl(imgDataUri);
  const imgBuffer = parsedImg.toBuffer();

  // TODO all of this
  let imageUploadParams: ImageUploadAPIParams = {
    address,
    signature,
    wizardId,
    img: imgBuffer,
  };

  // const response = await fetch("/api/lore", {
  //   method: "post",
  //   headers: {
  //     Accept: "application/json",
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify(loreBody)
  // });
  const response = { status: 200 };

  // const apiResponse = await response.json();

  if (response.status !== 201 && response.status !== 200) {
    // console.error(apiResponse);
    // toast.error(`Sorry, there was a problem with IPFS upload`, {
    //   position: "top-right",
    //   autoClose: 5000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: false,
    //   progress: undefined
    // });
    // setSubmitting(false);
    // return false;
  } else {
    // toast.update("uploaded")
  }
}

// we can either do this from the blocks in markdown or maybe it's easier to
// just upload them when the user drags them over
export async function uploadBookOfLoreImages({
  imgDataUris,
  wizardId,
}: {
  imgDataUris: string[];
  wizardId: string;
}) {
  const toastId = toast.info("Uploading Lore Images", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    progress: 0,
  });
  await Bluebird.map(imgDataUris, async (imgDataUri) => {
    uploadBookOfLoreImage({ imgDataUri, toastId, wizardId });
  });
  toast.done(toastId);
}
export const titlePrompts = [
  "The Lore of",
  // "The Untold story of",
  // "The Adventures of",
  // "The Downfall of",
  // ??? ideas?
];

export const storyPrompts = [
  `Delete this text and write your Lore here`,
  //  `## Part 1
  // Our hero finds themselves surrounded by a...`,
  // `They weren't always a solitary Wizard until...`,
  // ??? ideas?
];

export const getPendingLoreTxHashRedirection = async ({
  waitForTxHash,
  wizardId,
}: {
  waitForTxHash: string;
  wizardId: string;
}) => {
  const { data } = await client.query({
    query: gql`
          query Lore{
              lores(where: { struck: false, nsfw: false, txHash: "${waitForTxHash}" }) {
                  id
                  index
                  txHash
              }
          }
      `,
    fetchPolicy: "no-cache",
  });

  if (data?.lores[0]) {
    const { data: wizardPageCount } = await client.query({
      query: gql`
          query Lore {
              lores( where: {tokenId: "${wizardId}", tokenContract: "${NORMALIZED_WIZARD_CONTRACT_ADDRESS}", struck: false, nsfw: false}) {
                  id
              }
          }
      `,
      fetchPolicy: "no-cache",
    });

    const pageNum = (wizardPageCount?.lores).length - 1;

    return {
      redirect: {
        destination: `/lore/add?lorePageToPrefetch=${
          pageNum % 2 === 0 ? pageNum : pageNum + 1
        }&wizardId=${wizardId}&client=true`,
      },
    };
  }

  return {
    redirect: {
      destination: `/lore/add?waitForTxHash=${waitForTxHash}&wizardId=${wizardId}&client=true`,
    },
  };
};

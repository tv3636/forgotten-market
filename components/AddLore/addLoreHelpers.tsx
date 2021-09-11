import { ToastContainer, toast } from "react-toastify";
import { getBookOfLoreContract } from "../../contracts/ForgottenRunesWizardsCultContract";
import { LoreAPISubmitParams } from "../../pages/lore/add";
import { AddressZero } from "@ethersproject/constants";

export const onSubmitAddLoreForm = async ({
  values,
  currentWizard,
  setErrorMessage,
  setSubmitting,
  currentArtifact,
  currentStory,
  currentTitle,
  currentBgColor,
  web3Settings,
  router
}: any) => {
  console.log("onSubmit", currentWizard);
  setErrorMessage(null);

  if (!currentWizard?.tokenId) {
    toast.error(`Sorry, there was a problem: no wizard selected`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined
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
      progress: undefined
    });
    setErrorMessage("Need a story to be present");
    return false;
  }

  setSubmitting(true);

  const provider = web3Settings.injectedProvider;
  const loreContract = await getBookOfLoreContract({
    provider: provider
  });

  console.log("toast.info");
  toast.info("Preparing your Lore", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined
  });

  let loreBody: LoreAPISubmitParams = {
    title: currentTitle,
    story: currentStory,
    pixel_art: values?.pixelArt ?? false,
    bg_color: currentBgColor
  };

  if (currentArtifact?.contractAddress && currentArtifact?.tokenId) {
    loreBody = {
      ...loreBody,
      address: currentArtifact.contractAddress,
      token_id: currentArtifact.tokenId
    };
  }

  const response = await fetch("/api/lore", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(loreBody)
  });

  const apiResponse = await response.json();

  if (response.status !== 201 && response.status !== 200) {
    console.error(apiResponse);

    toast.error(`Sorry, there was a problem with IPFS upload`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined
    });
    setSubmitting(false);
    return false;
  }

  console.log(apiResponse);

  try {
    toast.info("Submitting your lore on chain, please don't re-submit!", {
      position: "top-right",
      autoClose: 20000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined
    });
    const tx = await loreContract
      //@ts-ignore
      .connect(provider?.getSigner())
      .addLore(
        currentWizard.tokenId,
        currentArtifact?.contractAddress
          ? currentArtifact.contractAddress
          : AddressZero,
        currentArtifact?.tokenId ? currentArtifact?.tokenId : 0,
        0,
        values.isNsfw,
        `ipfs://${apiResponse.hash}`,
        { gasLimit: 300000 } //TODO: actual gas limit
      );

    const receipt = await tx.wait();

    console.log(`receipt: ${JSON.stringify(receipt)}`);

    if (receipt.status === 1) {
      await router.push(
        `/lore/add?waitForTxHash=${receipt.transactionHash}&wizardId=${currentWizard.tokenId}`
      );
    } else {
      toast.error(`Sorry, it appears your transaction may have failed (?)`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined
      });
      setSubmitting(false);
      return false;
    }
  } catch (err) {
    console.log("err: ", err);
    toast.error(`Sorry, there was a problem: ${err.message}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined
    });
    setSubmitting(false);
    return false;
  }

  setSubmitting(false);
  return true;
};

export const titlePrompts = [
  "The Tale of",
  "The Untold story of",
  "The Adventures of"
  // "The Downfall of",
  // ??? ideas?
];

export const storyPrompts = [
  `## Part 1
Our hero finds themselves surrounded by a...`,
  `They weren't always a solitary Wizard until...`
  // ??? ideas?
];

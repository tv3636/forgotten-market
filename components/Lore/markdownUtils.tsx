import { IndividualLorePageData } from "./types";
import { IPFS_SERVER } from "../../constants";
import productionWizardData from "../../data/nfts-prod.json";
import dayjs from "dayjs";
import { fetchFromIpfs } from "../../lib/web3Utils";

const wizData = productionWizardData as { [wizardId: string]: any };

export async function hydratePageDataFromMetadata(
  loreMetadataURI: string,
  createdAtTimestamp: number,
  creator: string,
  tokenId: number
): Promise<IndividualLorePageData> {
  // Check if special burn page
  if (
    creator.toLowerCase() ===
    (
      process.env.NEXT_PUBLIC_REACT_APP_SOULS_CONTRACT_ADDRESS as string
    ).toLowerCase()
  ) {
    const wizard = wizData[tokenId];

    //Note: we use the SOULS_API for images directly rather than lookup tokenURI from contract to ensure fast builds. In the future we can update this to be the IPFS base url etc
    return {
      firstImage: `${process.env.NEXT_PUBLIC_SOULS_API}/api/souls/img/${tokenId}`,
      isEmpty: false,
      bgColor: `#${wizard.background_color}`, //TODO: Hmm wiz colour, or some reddish hue?
      title: `Wizard ${tokenId} Burned`,
      story: `On ${dayjs.unix(createdAtTimestamp).format("D MMMM YYYY")}, ${
        wizard.name
      } passed through The Sacred Flame and became a Soul \n\n![Soul Image](${
        process.env.NEXT_PUBLIC_SOULS_API
      }/api/souls/img/${tokenId}) \n\n[Go to Lore for this Soul](/lore/souls/${tokenId}/0)`,
    };
  }

  const metadata = await fetchFromIpfs(loreMetadataURI);

  // We use first image for og metadata, and yes regex not the coolest method but it works :)
  let firstImage = metadata?.description?.match(
    /!\[(?:.*?)\]\((ipfs.*?)\)/im
  )?.[1];

  if (firstImage) {
    firstImage = firstImage.replace(/^ipfs:\/\//, `${IPFS_SERVER}/`);
  }

  // result.data
  return {
    firstImage: firstImage ?? null,
    isEmpty: false,
    bgColor: metadata?.background_color ?? "#000000",
    title: metadata?.name ?? "Untitled",
    story: (metadata?.description ?? "")
      // .replace(/([^\s]+)\n/gi, "$1  \n") // Markdown needs two spaces before a \n for line break but our editor doesn't do this if you c/p content into it...
      .replace("Delete this text and write your Lore here", ""),
  };
}

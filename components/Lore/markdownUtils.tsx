import { IndividualLorePageData } from "./types";
import { IPFS_SERVER } from "../../constants";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";

async function fetchLoreMetadata(loreMetadataURI: string | null): Promise<any> {
  if (!loreMetadataURI) return null;

  const ipfsURL = `${IPFS_SERVER}/${
    loreMetadataURI.match(/^ipfs:\/\/(.*)$/)?.[1]
  }`;
  // console.log("ipfsURL: ", ipfsURL);

  if (!ipfsURL || ipfsURL === "undefined") {
    return null;
  }

  //TODO: retries?
  return await fetch(ipfsURL).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      console.error("Bad IPFS request: " + res.statusText);
      return {};
    }
  });
}

export async function hydratePageDataFromMetadata(
  loreMetadataURI: string
): Promise<IndividualLorePageData> {
  const metadata = await fetchLoreMetadata(loreMetadataURI);

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
      .replace(/([^\s]+)\n/gi, "$1  \n") // Markdown needs two spaces before a \n for line break but our editor doesn't do this if you c/p content into it...
      .replace("Delete this text and write your Lore here", ""),
  };
}

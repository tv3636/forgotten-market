import { CHARACTER_CONTRACTS } from "../contracts/ForgottenRunesWizardsCultContract";
import { getLoreInChapterForm } from "../components/Lore/loreSubgraphUtils";
import { hydratePageDataFromMetadata } from "../components/Lore/markdownUtils";
import { IPFS_SERVER } from "../constants";
import path from "path";
import { promises as fs } from "fs";

async function backup() {
  for (const [loreTokenSlug, loreTokenContract] of Object.entries(
    CHARACTER_CONTRACTS
  )) {
    console.log(`Generating backups for ${loreTokenSlug} ${loreTokenContract}`);

    const loreInChapterForm = await getLoreInChapterForm(
      loreTokenContract as string,
      false
    );

    for (let i = 0; i < loreInChapterForm.length; i++) {
      const chapter = loreInChapterForm[i];
      const tokenId = chapter[i];

      for (let j = 0; j < chapter.lore.length; i++) {
        const loreEntry = chapter.lore[j];

        loreEntry.hydratedLore = await hydratePageDataFromMetadata(
          loreEntry.loreMetadataURI,
          loreEntry.createdAtTimestamp,
          loreEntry.creator,
          tokenId
        );

        const images = loreEntry.hydratedLore.story.match(
          /^ipfs:\/\//,
          `${IPFS_SERVER}/`
        );

        console.log(images);
      }
    }

    await fs.writeFile(
      path.join(".backup/", `BoL-data-file-${loreTokenSlug}`),
      JSON.stringify({
        timestamp: new Date().getTime(),
        data: loreInChapterForm,
      }),
      "utf-8"
    );
  }
}

backup();

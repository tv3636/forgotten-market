import { css, Global } from "@emotion/react";
import dynamic from "next/dynamic";
import React from "react";
import Layout from "../../components/Layout";
import BookCover from "../../components/Lore/BookCover";
import LoreSharedLayout from "../../components/Lore/LoreSharedLayout";
import productionWizardData from "../../data/nfts-prod.json";
import OgImage from "../../components/OgImage";

const wizData = productionWizardData as { [wizardId: string]: any };

const WizardMapLeaflet = dynamic(
  () => import("../../components/Lore/WizardMapLeaflet"),
  { ssr: false }
);

const BookOfLoreIndexPage = ({}: {}) => {
  return (
    <Layout title={`The Forgotten Runes Book of Lore`}>
      <OgImage
        title={`The Book of Lore`}
        images={
          "https://www.forgottenrunes.com/static/lore/book/closed_whole.png"
        }
      />

      <Global
        styles={css`
          html,
          body {
            background: radial-gradient(#3c324c, #0a080c);
          }
        `}
      />
      <LoreSharedLayout>
        <BookCover />
      </LoreSharedLayout>
      <WizardMapLeaflet wizardLore={{}} bookOfLore={true} />
    </Layout>
  );
};

export default BookOfLoreIndexPage;

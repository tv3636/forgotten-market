import { css, Global } from "@emotion/react";
import dynamic from "next/dynamic";
import Layout from "../../components/Layout";
import BookCover from "../../components/Lore/BookCover";
import LoreSharedLayout from "../../components/Lore/LoreSharedLayout";
import productionWizardData from "../../data/nfts-prod.json";

const wizData = productionWizardData as { [wizardId: string]: any };

const WizardMapLeaflet = dynamic(
  () => import("../../components/Lore/WizardMapLeaflet"),
  { ssr: false }
);

const BookOfLoreIndexPage = ({}: {}) => {
  return (
    <Layout>
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

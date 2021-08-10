import Layout from "../../../components/Layout";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import styled from "@emotion/styled";
import Book from "../../../components/Lore/Book";
import BookOfLoreControls from "../../../components/Lore/BookOfLoreControls";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { ResponsivePixelImg } from "../../../components/ResponsivePixelImg";
import productionWizardData from "../../../data/nfts-prod.json";
const wizData = productionWizardData as { [wizardId: string]: any };

const LoreWrapper = styled.div`
  padding: 1em;
`;

const Carousel = styled.div`
  box-sizing: border-box;
  position: relative;
  height: calc(100vh - 58px - 30px);
`;

const FirstPage = styled.div<{ bg?: string }>`
  background-color: ${(props) => props.bg || "#000000"};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Spread = styled.div<{}>`
  display: grid;
  gap: 0px 0px;
  height: 70%;

  grid-template-columns: 1fr 1fr;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LorePage = () => {
  const router = useRouter();
  const { wizardId, page } = router.query;
  const wizardData: any = wizData[wizardId.toString()];
  const bg = "#" + wizardData.background_color;

  return (
    <Layout
      title={`${wizardData.name} (${wizardId}) | Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs`}
    >
      <LoreWrapper>
        <Carousel>
          <Spread>
            <FirstPage bg={"#" + wizardData.background_color}>
              <ResponsivePixelImg
                src={`https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-${wizardId}.png`}
              />
            </FirstPage>

            <FirstPage bg={"#" + wizardData.background_color}>
              <ResponsivePixelImg
                src={`https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-${wizardId}.png`}
              />
            </FirstPage>
          </Spread>

          <BookOfLoreControls
            wizardId={wizardId as string}
            page={page as string}
          />
        </Carousel>
      </LoreWrapper>
    </Layout>
  );
};
export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: { wizardId: context?.query?.wizardId, page: context?.query?.page }
  };
}
export default LorePage;

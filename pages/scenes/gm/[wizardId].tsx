import Layout from "../../../components/Layout";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import styled from "@emotion/styled";
import Book from "../../../components/Lore/Book";
import { useRouter } from "next/router";
import productionWizardData from "../../../data/nfts-prod.json";
import { GetServerSidePropsContext } from "next";
import { ResponsivePixelImg } from "../../../components/ResponsivePixelImg";

const wizData = productionWizardData as { [wizardId: string]: any };

const GmWrapper = styled.div<{ bg: string }>`
  min-height: 100vh;
  background-color: ${(props) => props.bg || "#000000"};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WizardImageContainer = styled.div`
  max-width: 400px;
  position: relative;

  @media (min-width: 768px) {
    transform: translateX(25%);
  }
`;

const GmContainer = styled.div`
  margin-left: 10px;
  @media (min-width: 768px) {
    position: absolute;
    top: 0;
    left: 0;
    transform: translateX(-100%) translateY(-25%);
  }
`;

const GmImage = styled.img`
  max-width: 90vw;
  image-rendering: pixelated;
`;

const GmPage = () => {
  const router = useRouter();
  const { wizardId, page } = router.query;
  const wizardData: any = wizData[wizardId.toString()];
  const bg = "#" + wizardData.background_color;

  return (
    <Layout title="wtf | Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs">
      <GmWrapper bg={bg}>
        <WizardImageContainer>
          <GmContainer>
            <GmImage
              src={`/static/img/scenes/gm.png`}
              width="200px"
              height="auto"
            />
          </GmContainer>
          <ResponsivePixelImg
            src={`https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-${wizardId}.png`}
          />
        </WizardImageContainer>
      </GmWrapper>
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: { wizardId: context?.query?.wizardId }
  };
}

export default GmPage;

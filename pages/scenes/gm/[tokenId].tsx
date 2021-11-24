import { GetStaticPropsContext } from "next";
import { getSoulsContract } from "../../../contracts/ForgottenRunesWizardsCultContract";
import { getProvider } from "../../../hooks/useProvider";
import Layout from "../../../components/Layout";
import { ResponsivePixelImg } from "../../../components/ResponsivePixelImg";

import productionWizardData from "../../../data/nfts-prod.json";
import productionSoulsData from "../../../data/souls-prod.json";
import stagingSoulsData from "../../../data/souls-staging.json";

import styled from "@emotion/styled";

const wizData = productionWizardData as { [wizardId: string]: any };
const soulsData = (
  parseInt(process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID ?? "1") === 4
    ? stagingSoulsData
    : productionSoulsData
) as { [soulId: string]: any };

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

const GmPage = ({
  tokenId,
  collection,
}: {
  tokenId: string;
  collection: string;
}) => {
  const data: any =
    collection === "wizards" ? wizData[tokenId] : soulsData?.[tokenId] ?? {};
  const bg = "#" + (data?.background_color ?? "000000");

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
            src={
              collection === "wizards"
                ? `https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-${tokenId}.png`
                : `${process.env.NEXT_PUBLIC_SOULS_API}/api/souls/img/${tokenId}`
            }
          />
        </WizardImageContainer>
      </GmWrapper>
    </Layout>
  );
};

export async function getStaticProps(context: GetStaticPropsContext) {
  const tokenId = context.params?.tokenId;

  const soulsContract = await getSoulsContract({
    provider: getProvider(true),
  });

  console.log(`GM. Checking if soul or wizard for token ${tokenId}`);

  let collection;
  try {
    await soulsContract.ownerOf(tokenId);
    collection = "souls";
  } catch (e) {
    collection = "wizards";
  }

  return {
    props: {
      collection,
      tokenId: tokenId,
    },
    revalidate: 60 * 60 * 24, //A day long invalidation is ok for GM
  };
}

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export default GmPage;

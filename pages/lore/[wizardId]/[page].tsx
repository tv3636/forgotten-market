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

const text = `
“Well, your father gave me this to give to you; and if I have chosen my own 
time and way for handing it over, you can hardly blame me, considering the 
trouble I had to find you. Your father could not remember his own name when he 
gave me the paper, and he never told me yours; so on the whole I think I ought to 
be praised and thanked! Here it is,” said he handing the map to Thorin. 

“I don’t understand,” said Thorin, and Bilbo felt he would have liked to say 
the same. The explanation did not seem to explain. 

“Your grandfather,” said the wizard slowly and grimly, “gave the map to his 
son for safety before he went to the mines of Moria. Your father went away to 
try his luck with the map after your grandfather was killed; and lots of 
adventures of a most unpleasant sort he had, but he never got near the Mountain. 
How he got there I don’t know, but I found him a prisoner in the dungeons of the 
Necromancer.” 

“Whatever were you doing there?” asked Thorin with a shudder, and all the 
dwarves shivered. 

“Never you mind. I was finding things out, as usual; and a nasty dangerous 
business it was. Even I, Gandalf, only just escaped. I tried to save your father, 
but it was too late. He was witless and wandering, and had forgotten almost 
everything except the map and the key.” 

“We have long ago paid the goblins of Moria,” said Thorin; “we must give a 
thought to the Necromancer.” 

“Don’t be absurd! He is an enemy far beyond the powers of all the dwarves 
put together, if they could all be collected again from the four corners of the 
world. The one thing your father wished was for his son to read the map and use 
the key. The dragon and the Mountain are more than big enough tasks for you!” 

“Hear, hear!” said Bilbo, and accidentally said it aloud. 

“Hear what?” they all said turning suddenly towards him, and he was so 
flustered that he answered “Hear what I have got to say!” 

“What’s that?” they asked.`;

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
  height: 75vh;

  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TextPage = styled.div`
  color: white;
  font-size: 24px;
  column-width: 150px;
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
              {/* <ResponsivePixelImg
                src={`https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-${wizardId}.png`}
              /> */}
              <TextPage>{text}</TextPage>
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

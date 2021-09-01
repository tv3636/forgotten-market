import ReactMarkdown from "react-markdown";
import styled from "@emotion/styled";
import BookOfLoreControls from "./BookOfLoreControls";
import BookOfLorePage from "./BookOfLorePage";
import { ResponsivePixelImg } from "../../components/ResponsivePixelImg";
import PageHorizontalBreak from "../../components/PageHorizontalBreak";
import productionWizardData from "../../data/nfts-prod.json";

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

const BookElement = styled.div``;

const Carousel = styled.div`
  box-sizing: border-box;
  position: relative;
  /* height: calc(100vh - 58px - 30px); */
  padding: 0 40px;
`;

const Spread = styled.div<{ bg: string }>`
  display: grid;
  gap: 0px 0px;

  & > * {
    border: 1px solid red;
    /* background-color: ${(props) => props.bg}; */
  }

  /* 
  grid-template-areas:
    "lefttopcorner topborder lefttopbinding  righttopbinding  topborder righttopcorner"
    "leftborder    pagebody  leftpagebinding rightpagebinding pagebody  rightborder"
    "leftbotcorner botborder leftbotbinding  rightbotbinding  botborder rightbotcorner";
  */

  // the 300px here is the sum of:
  // top nav + top border row + bottom border row + pagination controls + any padding
  grid-template-rows: 74px minmax(0, calc(100vh - 350px)) 74px;
  grid-template-columns: 71px minmax(0, 1fr) 52px 52px minmax(0, 1fr) 71px;

  @media (max-width: 768px) {
    grid-template-columns: 71px minmax(0, 1fr) 52px 0px 0px 0px;
    grid-template-rows: 74px minmax(0, calc(100vh - 350px)) 74px;
  }
`;

const LeftTopCorner = styled.div`
  background-image: url("/static/lore/book/corner_topLeft.png");
  background-repeat: no-repeat;
  background-position: left bottom;
`;
const RightTopCorner = styled.div`
  background-image: url("/static/lore/book/corner_topRight.png");
  background-repeat: no-repeat;
  background-position: right bottom;
`;
const LeftBotCorner = styled.div`
  background-image: url("/static/lore/book/corner_bottomLeft.png");
  background-repeat: no-repeat;
  background-position: left bottom;
`;
const RightBotCorner = styled.div`
  background-image: url("/static/lore/book/corner_bottomRight.png");
  background-repeat: no-repeat;
  background-position: right bottom;
`;

const LeftBorder = styled.div`
  background-image: url("/static/lore/book/edge_Left_large.png");
  background-repeat: repeat-y;
  /* background-position: left center; */
  background-position: 2px 0px;
`;
const RightBorder = styled.div`
  background-image: url("/static/lore/book/edge_Right_large.png");
  background-repeat: repeat-y;
  background-position: right top;
`;

const TopBorder = styled.div``;
const BotBorder = styled.div`
  background-image: url("/static/lore/book/edge_bottom_Right_large.png");
  background-repeat: repeat-x;
  background-position: center bottom;
`;

const LeftPageBinding = styled.div`
  background-image: url("/static/lore/book/center_tile.png");
  background-position: left center;
`;
const RightPageBinding = styled.div`
  background-image: url("/static/lore/book/center_tile.png");
  background-position: right center;
`;

const LeftTopBinding = styled.div`
  background-image: url("/static/lore/book/center_top.png");
  background-position: left bottom;
`;
const RightTopBinding = styled.div`
  background-image: url("/static/lore/book/center_top.png");
  background-position: right bottom;
`;

const LeftBotBinding = styled.div`
  background-image: url("/static/lore/book/center_bottm.png");
  background-position: left bottom;
`;
const RightBotBinding = styled.div`
  background-image: url("/static/lore/book/center_bottm.png");
  background-position: right bottom;
`;

const PageBody = styled.div``;

const TextPage = styled.div`
  color: #e1decd;
  font-size: 24px;
  max-height: 70vh;
  overflow: scroll;
  padding: 1em;
  font-family: "Alagard", serif;
`;

export type Props = {
  wizardId: string;
  page: string;
};

const Book = ({ wizardId, page }: Props) => {
  const wizardData: any = wizData[wizardId.toString()];
  const bg = "#" + wizardData.background_color;

  return (
    <BookElement>
      <Carousel>
        <Spread bg={bg}>
          <LeftTopCorner />
          <TopBorder />
          <LeftTopBinding />
          <RightTopBinding />
          <TopBorder />
          <RightTopCorner />

          <LeftBorder />
          <PageBody>
            <BookOfLorePage wizardId={wizardId} page={page} bg={bg}>
              <ResponsivePixelImg
                src={`https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-${wizardId}.png`}
                style={{ maxWidth: "480px" }}
              />
            </BookOfLorePage>
          </PageBody>
          <LeftPageBinding />
          <RightPageBinding />
          <PageBody>
            <BookOfLorePage wizardId={wizardId} page={page} bg={bg}>
              <TextPage>
                <ReactMarkdown>{text}</ReactMarkdown>
              </TextPage>
            </BookOfLorePage>
          </PageBody>
          <RightBorder />

          <LeftBotCorner />
          <BotBorder />
          <LeftBotBinding />
          <RightBotBinding />
          <BotBorder />
          <RightBotCorner />
        </Spread>
      </Carousel>
      <BookOfLoreControls wizardId={wizardId as string} page={page as string} />
    </BookElement>
  );
};

export default Book;

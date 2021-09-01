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
  @media (max-width: 768px) {
    padding: 0 2px;
  }
`;

const Spread = styled.div<{ bg: string }>`
  display: grid;
  gap: 0px 0px;

  & > * {
    border: 1px solid red;
    /* background-color: ${(props) => props.bg}; */
  }

  grid-template-areas:
    "lefttopcorner topborder1 lefttopbinding  righttopbinding  topborder2 righttopcorner"
    "leftborder    pagebody1  leftpagebinding rightpagebinding pagebody2  rightborder"
    "leftbotcorner botborder1 leftbotbinding  rightbotbinding  botborder2 rightbotcorner";

  // the 300px here is the sum of:
  // top nav + top border row + bottom border row + pagination controls + any padding
  grid-template-rows: 74px minmax(0, calc(100vh - 350px)) 74px;
  grid-template-columns: 71px minmax(0, 1fr) 52px 52px minmax(0, 1fr) 71px;

  @media (max-width: 768px) {
    grid-template-areas:
      "lefttopcorner topborder1 topborder1 topborder1  topborder1 righttopcorner"
      "leftborder    pagebody1  pagebody1 pagebody1 pagebody1  rightborder"
      "leftborder    pagebody2  pagebody2 pagebody2 pagebody2  rightborder"
      "leftbotcorner botborder1 botborder1  botborder1  botborder1 rightbotcorner";

    grid-template-rows: 74px max-content max-content 74px;

    /* grid-template-columns: 71px minmax(0, 1fr) 52px 0px 0px 0px; */
    /* grid-template-rows: 74px minmax(0, calc(100vh - 350px)) 74px; */
  }
`;

const LeftTopCorner = styled.div`
  background-image: url("/static/lore/book/corner_topLeft.png");
  background-repeat: no-repeat;
  background-position: left bottom;
  grid-area: lefttopcorner;
`;
const RightTopCorner = styled.div`
  background-image: url("/static/lore/book/corner_topRight.png");
  background-repeat: no-repeat;
  background-position: right bottom;
  grid-area: righttopcorner;
`;
const LeftBotCorner = styled.div`
  background-image: url("/static/lore/book/corner_bottomLeft.png");
  background-repeat: no-repeat;
  background-position: left bottom;
  grid-area: leftbotcorner;
`;
const RightBotCorner = styled.div`
  background-image: url("/static/lore/book/corner_bottomRight.png");
  background-repeat: no-repeat;
  background-position: right bottom;
  grid-area: rightbotcorner;
`;

const LeftBorder = styled.div`
  background-image: url("/static/lore/book/edge_Left_large.png");
  background-repeat: repeat-y;
  /* background-position: left center; */
  background-position: 2px 0px;
  grid-area: leftborder;
`;
const RightBorder = styled.div`
  background-image: url("/static/lore/book/edge_Right_large.png");
  background-repeat: repeat-y;
  background-position: right top;
  grid-area: rightborder;
`;

const TopBorder1 = styled.div`
  grid-area: topborder1;
`;
const TopBorder2 = styled.div`
  grid-area: topborder2;
`;

const BotBorder1 = styled.div`
  background-image: url("/static/lore/book/edge_bottom_Right_large.png");
  background-repeat: repeat-x;
  background-position: center bottom;
  grid-area: botborder1;
`;
const BotBorder2 = styled.div`
  background-image: url("/static/lore/book/edge_bottom_Right_large.png");
  background-repeat: repeat-x;
  background-position: center bottom;
  grid-area: botborder2;
`;

const LeftPageBinding = styled.div`
  background-image: url("/static/lore/book/center_tile.png");
  background-position: left center;
  grid-area: leftpagebinding;
`;
const RightPageBinding = styled.div`
  background-image: url("/static/lore/book/center_tile.png");
  background-position: right center;
  grid-area: rightpagebinding;
`;

const LeftTopBinding = styled.div`
  background-image: url("/static/lore/book/center_top.png");
  background-position: left bottom;
  grid-area: lefttopbinding;
`;
const RightTopBinding = styled.div`
  background-image: url("/static/lore/book/center_top.png");
  background-position: right bottom;
  grid-area: righttopbinding;
`;

const LeftBotBinding = styled.div`
  background-image: url("/static/lore/book/center_bottm.png");
  background-position: left bottom;
  grid-area: leftbotbinding;
`;
const RightBotBinding = styled.div`
  background-image: url("/static/lore/book/center_bottm.png");
  background-position: right bottom;
  grid-area: rightbotbinding;
`;

const PageBody1 = styled.div`
  grid-area: pagebody1;
`;
const PageBody2 = styled.div`
  grid-area: pagebody2;
`;

const TextPage = styled.div`
  color: #e1decd;
  font-size: 24px;
  /* max-height: 70vh; */
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
          <TopBorder1 />
          <LeftTopBinding />
          <RightTopBinding />
          <TopBorder2 />
          <RightTopCorner />

          <LeftBorder />
          <PageBody1>
            <BookOfLorePage wizardId={wizardId} page={page} bg={bg}>
              <ResponsivePixelImg
                src={`https://nftz.forgottenrunes.com/wizards/alt/400-nobg/wizard-${wizardId}.png`}
                style={{ maxWidth: "480px" }}
              />
            </BookOfLorePage>
          </PageBody1>
          <LeftPageBinding />
          <RightPageBinding />
          <PageBody2>
            <BookOfLorePage wizardId={wizardId} page={page} bg={bg}>
              <TextPage>
                <ReactMarkdown>{text}</ReactMarkdown>
              </TextPage>
            </BookOfLorePage>
          </PageBody2>
          <RightBorder />

          <LeftBotCorner />
          <BotBorder1 />
          <LeftBotBinding />
          <RightBotBinding />
          <BotBorder2 />
          <RightBotCorner />
        </Spread>
      </Carousel>
      <BookOfLoreControls wizardId={wizardId as string} page={page as string} />
    </BookElement>
  );
};

export default Book;

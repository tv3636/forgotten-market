import ReactMarkdown from "react-markdown";
import styled from "@emotion/styled";
import BookOfLoreControls from "./BookOfLoreControls";
import BookOfLorePage from "./BookOfLorePage";
import { ResponsivePixelImg } from "../ResponsivePixelImg";
import PageHorizontalBreak from "../PageHorizontalBreak";
import productionWizardData from "../../data/nfts-prod.json";
import { motion } from "framer-motion";

const wizData = productionWizardData as { [wizardId: string]: any };

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

const Spread = styled.div<{ bg: string }>``;

const All = styled.div`
  background-color: #201c27;
  width: 680px;
  height: 680px;
  margin-left: auto;
  margin-right: auto;
`;

const PageFlip = styled.div`
  background-color: green;
  position: absolute;
  padding: 40px 40px 40px 340px;
  width: 300px;
  height: 400px;
  overflow: hidden;
`;

const R1 = styled.div`
  background-color: #093a09;
  position: absolute;
  z-index: 2;
  -webkit-transform-origin: 1315px 500px;
  -webkit-transform: tranform(-1030px, -500px) rotate(-32deg);
  -webkit-transition-property: -webkit-transform, -webkit-transform-origin;
  -webkit-transition-duration: 1s;
`;

const P1 = styled.div`
  background-color: #531b1b;
  width: 1285px;
  height: 1388px;
  overflow: hidden;

  & > div {
    -webkit-transform-origin: 285px 0;
    -webkit-transform: translate(1030px, 500px) rotate(32deg);
    -webkit-transition-property: -webkit-transform, -webkit-transform-origin;
    -webkit-transition-duration: 1s;
    width: 285px;
    height: 388px;
    background-color: #0a4db1;
  }
  & > div > div {
    width: 10px;
    height: 388px;
    background: -webkit-gradient(
      linear,
      left top,
      right top,
      from(rgba(0, 0, 0, 0.25)),
      to(rgba(0, 0, 0, 0))
    );
  }
`;

export type Props = {
  wizardId: string;
  page: string;
};

const Book = ({ page }: Props) => {
  const wizardId = 0;
  const wizardData: any = wizData[wizardId.toString()];
  const bg = "#" + wizardData.background_color;

  return (
    <BookElement>
      <Carousel>
        <Spread bg={bg}>
          <All>
            <PageFlip>
              <R1 className="r1">
                <P1 className="p1">
                  <div>
                    <div>p1</div>
                  </div>
                </P1>
              </R1>
            </PageFlip>
          </All>
        </Spread>
      </Carousel>
    </BookElement>
  );
};

export default Book;

import styled from "@emotion/styled";
import productionWizardData from "../../data/nfts-prod.json";
import { ResponsivePixelImg } from "../ResponsivePixelImg";
import { BookElement, Carousel } from "./BookStyles";
import Link from "next/link";

export type Props = {};

const CoverContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 1em;
  margin-bottom: 1em;
  padding-top: 1em;
  min-height: 70vh;
`;

const StyledCoverImage = styled(ResponsivePixelImg)`
  height: auto;
  width: 50vw;
`;

const BookCover = ({}: Props) => {
  return (
    <BookElement>
      <Carousel layoutId="bookCarousel">
        <CoverContainer>
          <Link
            as={"/lore/wizards/0/0"}
            href={"/lore/wizards/0/0"}
            passHref={true}
          >
            <a>
              <StyledCoverImage src="/static/lore/book/closed_whole.png" />
            </a>
          </Link>
        </CoverContainer>
      </Carousel>
    </BookElement>
  );
};

export default BookCover;

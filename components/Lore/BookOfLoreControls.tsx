import * as React from "react";
import styled from "@emotion/styled";
import productionWizardData from "../../data/nfts-prod.json";
import Link from "next/link";
import { useHotkeys } from "react-hotkeys-hook";
import { useRouter } from "next/router";
import Image from "next/image";
import { Flex } from "rebass";
import PageHorizontalBreak from "../PageHorizontalBreak";
import Spacer from "../Spacer";
import Button from "../ui/Button";
import { WizardLorePageRoute } from "./loreUtils";

const wizData = productionWizardData as { [wizardId: string]: any };

type Props = {
  wizardId: string;
  page: string;
  nextPageRoute: WizardLorePageRoute | null;
  previousPageRoute: WizardLorePageRoute | null;
};

const WizardNameWrapper = styled.div`
  background-image: url("/static/lore/book/page_border_header_top.png");
  background-repeat: no-repeat;
  background-size: cover;
  width: 320px;
  min-width: 320px;
  min-height: 60px;
  padding: 12px 20px 12px 26px;
  font-family: "Alagard", serif;
  word-break: break-word;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BookOfLoreControlsElement = styled.div`
  position: relative;
  margin: 10px 40px; // this x-margin should match the outer container of Book.tsx
  padding: 10px 10px;
  padding-bottom: 80px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const WriteContainer = styled.div`
  position: absolute;
  right: 0px;
  top: 10px;

  @media (max-width: 768px) {
    position: relative;
  }
`;

const PreviousPageContainer = styled.div`
  display: flex;
  align-items: center;
  padding-right: 1em;
`;
const NextPageContainer = styled.div`
  display: flex;
  align-items: center;
  padding-left: 1em;
`;

const WriteButton = styled(Button)`
  background-color: #27222f;
  border-radius: 5px;
  @media (max-width: 768px) {
    margin-top: 30px;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function BookOfLoreControls({
  wizardId,
  page,
  nextPageRoute,
  previousPageRoute
}: Props) {
  const wizardData: any = wizData[wizardId.toString()];
  const wizardNum = parseInt(wizardId);
  const pageNum = parseInt(page);

  // This isn't quite right because the pagination is Lore only
  // const previousWizardNumber = wizardNum > 0 ? wizardNum - 1 : 0;
  // const nextWizardNumber = wizardNum < 9999 ? wizardNum + 1 : 9999;

  const prevPageUrl = previousPageRoute?.as;
  const nextPageUrl = nextPageRoute?.as;
  const router = useRouter();

  useHotkeys(
    "left",
    () => {
      router.push(prevPageUrl);
      return true;
    },
    [wizardNum, pageNum]
  );

  useHotkeys(
    "right",
    () => {
      router.push(nextPageUrl);
      return true;
    },
    [wizardNum, pageNum]
  );

  return (
    <BookOfLoreControlsElement>
      <PaginationContainer>
        <PreviousPageContainer>
          {prevPageUrl && (
            <Link href={prevPageUrl} passHref>
              <a>
                <Image
                  src={"/static/lore/book/arrow_L.png"}
                  width={"12px"}
                  height={"25px"}
                />
              </a>
            </Link>
          )}
        </PreviousPageContainer>
        <WizardNameWrapper>
          {wizardData.name} (#{wizardId})
        </WizardNameWrapper>
        <NextPageContainer>
          {nextPageUrl && (
            <Link href={nextPageUrl} passHref>
              <a>
                <Image
                  src={"/static/lore/book/arrow_R.png"}
                  width={"12px"}
                  height={"25px"}
                />
              </a>
            </Link>
          )}
        </NextPageContainer>
      </PaginationContainer>
      <WriteContainer>
        <Link href="/lore/add" passHref={true}>
          <WriteButton size="medium">Write Your Lore</WriteButton>
        </Link>
      </WriteContainer>
    </BookOfLoreControlsElement>
  );
}

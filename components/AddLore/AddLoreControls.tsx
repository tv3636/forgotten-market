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
import { ResponsivePixelImg } from "../ResponsivePixelImg";
import { BackgroundColorPickerField, NSFWField } from "./AddLoreFields";
import { WizardNameWrapper } from "../Lore/BookSharedComponents";

const wizData = productionWizardData as { [wizardId: string]: any };

const BookOfLoreControlsElement = styled.div`
  position: relative;
  margin: 10px 40px; // this x-margin should match the outer container of Book.tsx
  padding: 10px 10px;
  padding-bottom: 80px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const WriteContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-end;

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

export const WriteButton = styled(Button)`
  background-color: #27222f;
  border-radius: 5px;
  @media (max-width: 768px) {
    margin-top: 30px;
  }
`;

const PaginationContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NoPageSpacer = styled.div`
  width: 12px;
  display: block;
`;

const SocialContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;

  @media (max-width: 768px) {
    position: relative;
    top: 0;
    margin-bottom: 15px;
  }
`;

const SocialItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.4em;
`;

const MidControls = styled.div`
  margin-right: 2em;
`;

type Props = {
  wizardId?: string;
  onSubmit: any;
  onBackgroundColorChanged: (color?: string | null | undefined) => void;
  onNsfwChanged: (newNsfw: boolean) => void;
};
export default function AddLoreControls({
  wizardId,
  onSubmit,
  onBackgroundColorChanged,
  onNsfwChanged
}: Props) {
  const wizardData: any = wizardId ? wizData[wizardId.toString()] : {};
  const wizardNum = parseInt(wizardId || "0");

  return (
    <BookOfLoreControlsElement>
      <PaginationContainer>
        <PreviousPageContainer>
          {/* {prevPageUrl ? (
            <Link href={prevPageUrl} passHref>
              <a>
                <Image
                  src={"/static/lore/book/arrow_L.png"}
                  width={"12px"}
                  height={"25px"}
                />
              </a>
            </Link>
          ) : (
            <NoPageSpacer />
          )} */}
        </PreviousPageContainer>
        <WizardNameWrapper layout layoutId="wizardName">
          {wizardData?.name && (
            <>
              <span>{wizardData.name}</span> <span>(#{wizardId})</span>
            </>
          )}
        </WizardNameWrapper>
        <NextPageContainer>
          {/* {nextPageUrl ? (
            <Link href={nextPageUrl} passHref>
              <a>
                <Image
                  src={"/static/lore/book/arrow_R.png"}
                  width={"12px"}
                  height={"25px"}
                />
              </a>
            </Link>
          ) : (
            <NoPageSpacer />
          )} */}
        </NextPageContainer>
      </PaginationContainer>
      <WriteContainer>
        <Link href={"/lore/63/0"} passHref>
          <a>test visiting lore</a>
        </Link>
        <MidControls>
          <BackgroundColorPickerField
            name="bgColor"
            onChange={onBackgroundColorChanged}
          />
          <NSFWField name="isNsfw" onChange={onNsfwChanged} />
        </MidControls>

        <WriteButton size="medium" onClick={onSubmit}>
          Save Your Lore
        </WriteButton>
      </WriteContainer>
    </BookOfLoreControlsElement>
  );
}

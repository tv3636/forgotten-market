import * as React from "react";
import styled from "@emotion/styled";
import productionWizardData from "../../data/nfts-prod.json";
import productionSoulsData from "../../data/souls-prod.json";
import stagingSoulsData from "../../data/souls-staging.json";

import Button from "../ui/Button";
import { BackgroundColorPickerField, NSFWField } from "./AddLoreFields";
import { LoreNameWrapper } from "../Lore/BookSharedComponents";
import {
  isSoulsContract,
  isWizardsContract,
} from "../../contracts/ForgottenRunesWizardsCultContract";

const wizData = productionWizardData as { [wizardId: string]: any };
const soulsData = (
  parseInt(process.env.NEXT_PUBLIC_REACT_APP_CHAIN_ID ?? "1") === 4
    ? stagingSoulsData
    : productionSoulsData
) as { [soulId: string]: any };

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
  cursor: pointer;
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
const RightControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  a.how {
    margin-top: 1em;
    margin-bottom: 1em;
    color: white;
    opacity: 0.7;
    font-style: italic;
    font-size: 0.9em;
  }
`;

type Props = {
  tokenAddress?: string;
  tokenId?: string;
  onSubmit: any;
  onBackgroundColorChanged: (color?: string | null | undefined) => void;
  currentBackgroundColor: string | null | undefined;
  onNsfwChanged: (newNsfw: boolean) => void;
  isEditing?: boolean;
};
export default function AddLoreControls({
  tokenAddress,
  tokenId,
  onSubmit,
  currentBackgroundColor,
  onBackgroundColorChanged,
  onNsfwChanged,
  isEditing,
}: Props) {
  let name;
  if (tokenAddress && isWizardsContract(tokenAddress)) {
    const wizardData: any = tokenId ? wizData[tokenId.toString()] : {};
    name = wizardData?.name;
  } else if (tokenAddress && isSoulsContract(tokenAddress)) {
    const soulData: any = tokenId ? soulsData?.[tokenId.toString()] ?? {} : {};
    name = soulData?.name ?? "Soul";
  } else {
    name = "Unknown";
  }

  return (
    <BookOfLoreControlsElement>
      <PaginationContainer>
        <PreviousPageContainer />
        <LoreNameWrapper layout layoutId="wizardName">
          <>
            <span>{name}</span> <span>(#{tokenId})</span>
          </>
        </LoreNameWrapper>
        <NextPageContainer />
      </PaginationContainer>
      <WriteContainer>
        <MidControls>
          <BackgroundColorPickerField
            name="bgColor"
            onChange={onBackgroundColorChanged}
            currentBackgroundColor={currentBackgroundColor}
          />
          {!isEditing && <NSFWField name="isNsfw" onChange={onNsfwChanged} />}
        </MidControls>
        <RightControls>
          <WriteButton size="medium" onClick={onSubmit}>
            Save Your Lore
          </WriteButton>
          <a
            href="/posts/writing-in-the-book-of-lore"
            target="_blank"
            className="how"
          >
            How does this work?
          </a>
        </RightControls>
      </WriteContainer>
    </BookOfLoreControlsElement>
  );
}

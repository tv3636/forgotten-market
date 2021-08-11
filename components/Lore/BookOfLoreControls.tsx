import * as React from "react";
import { useState } from "react";
import styled from "@emotion/styled";
import productionWizardData from "../../data/nfts-prod.json";
const wizData = productionWizardData as { [wizardId: string]: any };
import Link from "next/link";
import { useHotkeys } from "react-hotkeys-hook";
import { useRouter } from "next/router";

type Props = {
  wizardId: string;
  page: string;
};

const BookOfLoreControlsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  gap: 0px 0px;
  margin-top: 1em;
`;

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

function BookOfLorePaginator({}: {}) {}

export default function BookOfLoreControls({ wizardId, page }: Props) {
  const wizardData: any = wizData[wizardId.toString()];
  const wizardNum = parseInt(wizardId);
  const pageNum = parseInt(page);
  const prevPageUrl = `/lore/${wizardNum - 1}/0`;
  const nextPageUrl = `/lore/${wizardNum + 1}/0`;
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
    <BookOfLoreControlsWrapper>
      <div>{/* Socials */}</div>
      <PaginationWrapper>
        <Link href={prevPageUrl} passHref>
          <a>back</a>
        </Link>
        <span>
          {wizardData.name} (#{wizardId})
        </span>
        <Link href={nextPageUrl} passHref>
          <a>next</a>
        </Link>
      </PaginationWrapper>
      <div>{/* more */}</div>
    </BookOfLoreControlsWrapper>
  );
}

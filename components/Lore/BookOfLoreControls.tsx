import * as React from "react";
import styled from "@emotion/styled";
import productionWizardData from "../../data/nfts-prod.json";
import Link from "next/link";
import { useHotkeys } from "react-hotkeys-hook";
import { useRouter } from "next/router";
import Image from "next/image";
import { Flex } from "rebass";
import { PageHorizontalBreak, Spacer } from "./Page";

const wizData = productionWizardData as { [wizardId: string]: any };

type Props = {
  wizardId: string;
  page: string;
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
`;

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
    <Flex flexDirection={"column"} justifyContent={"top"} alignItems={"center"}>
      <Flex justifyContent={"center"} alignItems={"flex-start"} width={"100%"}>
        <PageHorizontalBreak />
        <WizardNameWrapper>
          {wizardData.name} (#{wizardId})
        </WizardNameWrapper>
        <PageHorizontalBreak />
      </Flex>
      <Spacer mb={2} />
      <Flex>
        <Link href={prevPageUrl} passHref>
          <Image
            src={"/static/lore/book/arrow_L.png"}
            width={"12px"}
            height={"25px"}
          />
        </Link>
        <Spacer ml={3} />
        <Link href={nextPageUrl} passHref>
          <Image
            src={"/static/lore/book/arrow_R.png"}
            width={"12px"}
            height={"25px"}
          />
        </Link>
      </Flex>
    </Flex>
  );
}

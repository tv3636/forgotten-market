import Layout from "../../../components/Layout";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import Book from "../../../components/Lore/Book";
import LoreAnimations from "../../../components/Lore/LoreAnimations";
import client from "../../../lib/graphql";
import { gql } from "@apollo/client";
import { WizardLorePages } from "../../../components/Lore/types";
import wizardLorePagesTestData from "../../../data/lore-test.json";

const LorePage = ({
  wizardLorePages,
}: {
  wizardLorePages: WizardLorePages;
}) => {
  const router = useRouter();
  const { wizardId, page } = router.query;

  return (
    <Layout>
      <LoreAnimations>
        <Book
          wizardId={wizardId as string}
          page={page as string}
          wizardLorePages={wizardLorePages}
        />
      </LoreAnimations>
    </Layout>
  );
};

const COMMON_LORE_FIELDS = `
  id
  index
  creator
  assetAddress
  loreMetadataURI
  parentLoreId
  tokenId
  struck
  nsfw
  createdAtBlock
  createdAtTimestamp
`;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const wizardId = (context?.query?.wizardId as string) || "0";
  const wizardNum = parseInt(wizardId);
  const pageNum = parseInt((context?.query?.page as string) || "0");
  const pageIsEven = pageNum % 2 == 0;
  const leftPageNum = pageIsEven ? pageNum - 1 : pageNum;
  const rightPageNum = pageIsEven ? pageNum : pageNum + 1;

  let queryString = `
      rightPage: lores(skip: ${rightPageNum}, first: 1, orderBy: createdAtBlock, orderDirection: asc, where: {wizard: "${wizardNum}", struck: false, nsfw: false}) {
        ${COMMON_LORE_FIELDS}
      }
  `;

  // Add left page to query unless we on very first page (instead wiz is shown)
  if (leftPageNum > 0) {
    queryString = `${queryString}
         leftPage: lores(skip: ${leftPageNum}, first: 1, orderBy: createdAtBlock, orderDirection: asc, where: {wizard: "${wizardNum}", struck: false, nsfw: false}) {
            ${COMMON_LORE_FIELDS}
          }
     `;
  }

  // Add previous two pages if we in middle of book
  if (leftPageNum > 2) {
    queryString = `${queryString}
      prevLeftPage: lores(skip: ${
        leftPageNum - 2
      }, first: 1, orderBy: createdAtBlock, orderDirection: asc, where: {wizard: "${wizardNum}", struck: false, nsfw: false}) {
            ${COMMON_LORE_FIELDS}
      }
      prevRightPage: lores(skip: ${
        leftPageNum - 1
      }, first: 1, orderBy: createdAtBlock, orderDirection: asc, where: {wizard: "${wizardNum}", struck: false, nsfw: false}) {
            ${COMMON_LORE_FIELDS}
      }
    `;
  } else {
    queryString = `${queryString}
      prevLeftPage: lores(skip: 2, first: 1, orderBy: createdAtBlock, orderDirection: desc, where: {wizard: "${
        wizardNum - 1
      }", struck: false, nsfw: false}) {
            ${COMMON_LORE_FIELDS}
      }
      prevRightPage: lores(skip: 1, first: 1, orderBy: createdAtBlock, orderDirection: desc, where: {wizard: "${
        wizardNum - 1
      }", struck: false, nsfw: false}) {
            ${COMMON_LORE_FIELDS}
      }
    `;
  }

  //Add next two pages
  queryString = `${queryString}
      nextLeftPage: lores(skip: ${
        rightPageNum + 1
      }, first: 1, orderBy: createdAtBlock, orderDirection: asc, where: {wizard: "${wizardNum}", struck: false, nsfw: false}) {
            ${COMMON_LORE_FIELDS}
      }
      nextRightPage: lores(skip: ${
        rightPageNum + 2
      }, first: 1, orderBy: createdAtBlock, orderDirection: asc, where: {wizard: "${wizardNum}", struck: false, nsfw: false}) {
            ${COMMON_LORE_FIELDS}
      }
    `;

  // Add next first page of next wizard always (as hard to tell if we on last two pages of current wizard upfront)
  queryString = `${queryString}
      nextWizardRightPage: lores(skip: 0, first: 1, orderBy: createdAtBlock, orderDirection: asc, where: {wizard: "${
        wizardNum + 1
      }", struck: false, nsfw: false}) {
            ${COMMON_LORE_FIELDS}
      }
    `;

  const { data } = await client.query({
    query: gql`
      query WizardLore {
        ${queryString}
      }
    `,
  });

  // console.log(data);
  console.log({
    leftPage: data?.leftPage?.[0], // If null then show wizard here (i.e. its the first page)
    rightPage: data?.rightPage?.[0], // Could be null if wizard has no lore
    prevLeftPage: data?.prevLeftPage?.[0], // If null then show previous wizard here
    prevRightPage: data?.prevRightPage?.[0], // Could be null if previous wizard has no lore
    nextLeftPage: data?.nextLeftPage?.[0],
    nextRightPage: data?.nextRightPage?.[0],
    //  If both next left and next right are null then you know nextLeft is wizard+1 and and nextRight is below
    nextWizardRightPage: data?.nextWizardRightPage?.[0],
  });

  const loreData: any = wizardLorePagesTestData.data;
  const wizardLorePages = {
    previousWizardLore:
      wizardNum > 0 ? loreData[(wizardNum - 1).toString()] : null,
    currentWizardLore: loreData[wizardId],
    nextWizardLore: loreData[(wizardNum + 1).toString()] || null,
  };

  return {
    props: {
      wizardId: context?.query?.wizardId,
      page: context?.query?.page,
      lore: data.wizard?.lore ?? [],
      wizardLorePages,
    },
  };
}
export default LorePage;

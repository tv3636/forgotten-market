import Layout from "../../../components/Layout";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import Book from "../../../components/Lore/Book";

const LorePage = () => {
  const router = useRouter();
  const { wizardId, page } = router.query;

  return (
    <Layout>
      <Book wizardId={wizardId as string} page={page as string} />
    </Layout>
  );
};
export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: { wizardId: context?.query?.wizardId, page: context?.query?.page }
  };
}
export default LorePage;

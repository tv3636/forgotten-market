import { GetServerSidePropsContext } from "next";

const Index = () => {
  return <></>;
};
export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    redirect: {
      destination: `/lore/${context?.query?.wizardId}/0`,
    },
  };
}
export default Index;

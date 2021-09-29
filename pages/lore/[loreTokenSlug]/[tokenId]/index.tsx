import { GetServerSidePropsContext } from "next";
import { getLoreUrl } from "../../../../components/Lore/loreUtils";

const Index = () => {
  return <></>;
};
export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    redirect: {
      destination: getLoreUrl(
        context.query?.loreTokenSlug as string,
        parseInt(context.query?.tokenId as string),
        0
      ),
    },
  };
}
export default Index;

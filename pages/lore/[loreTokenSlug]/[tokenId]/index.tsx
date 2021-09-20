import { GetServerSidePropsContext } from "next";
import { getLoreUrl } from "../../../../components/Lore/loreUtils";

const Index = () => {
  return <></>;
};
export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    redirect: {
      destination: getLoreUrl(
        "wizards",
        parseInt(context?.query?.wizardId as string),
        0
      ),
    },
  };
}
export default Index;

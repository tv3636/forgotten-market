import { GetServerSidePropsContext } from "next";
import { WizardLorePages } from "../../../components/Lore/types";

const Index = ({ wizardLorePages }: { wizardLorePages: WizardLorePages }) => {
  return <></>;
};
export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    redirect: {
      destination: `/lore/${context?.query?.wizardId}/0`
    }
  };
}
export default Index;

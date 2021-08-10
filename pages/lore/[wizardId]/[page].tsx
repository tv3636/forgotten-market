import Layout from "../../../components/Layout";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import styled from "@emotion/styled";
import Book from "../../../components/Lore/Book";
import { useRouter } from "next/router";

const LoreWrapper = styled.div`
  padding: 1em;
`;

const LorePage = () => {
  const router = useRouter();
  const { wizardId, page } = router.query;

  return (
    <Layout title="wtf | Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs">
      <LoreWrapper>
        {/* <Book wizardId={wizardId} page={page} /> */}
      </LoreWrapper>
    </Layout>
  );
};

export default LorePage;

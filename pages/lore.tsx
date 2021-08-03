import Layout from "../components/Layout";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import styled from "@emotion/styled";
import Book from "../components/Lore/Book";
import dynamic from "next/dynamic";

const LoreWrapper = styled.div`
  padding: 1em;
`;

const LorePage = () => (
  <Layout title="wtf | Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs">
    <LoreWrapper>
      <Book />
    </LoreWrapper>
  </Layout>
);

export default LorePage;

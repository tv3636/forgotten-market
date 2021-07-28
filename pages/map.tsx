import Layout from "../components/Layout";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import styled from "@emotion/styled";
import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("../components/Map"), {
  ssr: false // leaflet doesn't like Next.js SSR
});

const MapWrapper = styled.div`
  height: 90vh;
`;

const MapPage = () => (
  <Layout title="A World Map Fragment of Forgotten Runes | Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs">
    <MapWrapper>
      <DynamicMap />
    </MapWrapper>
  </Layout>
);

export default MapPage;

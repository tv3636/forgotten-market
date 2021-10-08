import Layout from "../components/Layout";
import dynamic from "next/dynamic";
import styled from "@emotion/styled";

const DynamicMap = dynamic(() => import("../components/Map"), {
  ssr: false, // leaflet doesn't like Next.js SSR
});

const Filler = styled.div`
  min-height: 100vh;
`;

const MapPage = () => (
  <Layout title="A World Map Fragment of Forgotten Runes | Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs">
    <Filler>
      <DynamicMap />
    </Filler>
  </Layout>
);

export default MapPage;

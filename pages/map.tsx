import Layout from "../components/Layout";
import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("../components/Map"), {
  ssr: false, // leaflet doesn't like Next.js SSR
});

const MapPage = () => (
  <Layout title="A World Map Fragment of Forgotten Runes | Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs">
    <DynamicMap />
  </Layout>
);

export default MapPage;

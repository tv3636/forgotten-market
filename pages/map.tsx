import Layout from "../components/Layout";
import dynamic from "next/dynamic";
import styled from "@emotion/styled";

const DynamicMap = dynamic(() => import("../components/Map"), {
  ssr: false, // leaflet doesn't like Next.js SSR
});

const MapStyles = styled.div`
  height: 100%;
  .leaflet-container {
    background-color: black;
  }
  img.leaflet-image-layer {
    image-rendering: pixelated;
  }
  .leaflet-bar a,
  .leaflet-bar a:hover {
    background-color: #000000;
    color: #ececec;
  }
  .leaflet-bar a:hover {
    background-color: #18151e;
  }

  .leaflet-touch .leaflet-control-layers,
  .leaflet-touch .leaflet-bar {
    border: none;
  }
`;

export const MapWrapper = styled.div`
  height: 90vh;
`;

const Filler = styled.div`
  min-height: 100vh;
`;

const MapPage = () => (
  <Layout title="A World Map Fragment of Forgotten Runes | Forgotten Runes Wizard's Cult: 10,000 on-chain Wizard NFTs">
    <Filler>
      <MapWrapper>
        <MapStyles>
          <DynamicMap center={[0,0]} zoom={7} height={"100%"} width={"100%"} />
        </MapStyles>
      </MapWrapper>
    </Filler>
  </Layout>
);

export default MapPage;

import styled from "@emotion/styled";
import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("../../components/Map"), {
  ssr: false, // leaflet doesn't like Next.js SSR
});

const MapContainer = styled.div`
  margin-left: 2vw;
  @media only screen and (max-width: 600px) {
    margin-top: 3vh;
  }
`;

const MapStylesBlur = styled.div`
  .leaflet-container {
    // filter: blur(5px);
  }
`;

const MapStyles = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  position: relative;

  .leaflet-container {
    background-color: black;
    border-weight: 10px;
    border-style: dashed;
    border-color: var(--mediumGray);
    border-radius: 16px;
    :hover {
      border-color: var(--lightGray);
    }
  }

  img.leaflet-image-layer {
    image-rendering: pixelated;
  }
  .leaflet-bar a,
  .leaflet-bar a:hover {
    display: none;
  }
  .leaflet-bar a:hover {
    background-color: #18151e;
  }

  .leaflet-touch .leaflet-control-layers,
  .leaflet-touch .leaflet-bar {
    border: none;
  }
`;

const MapOverlay = styled.div`
  position: absolute;
  top: 48%;
  z-index: 1;

  font-family: Alagard;
  font-size: 17px;
  color: black;
  text-shadow: 0 0 2px #e0d1a7;
`;

function MapBlur({ center }: { center: any }) {
  const zoom = 7;
  const width = "250px";
  const height = "230px"

  if (center[0] == 0 && center[1] == 0) {
    return (
      <MapStylesBlur>
        <MapStyles>
          <MapOverlay>Location unrevealed</MapOverlay>
          <DynamicMap center={center} zoom={zoom} width={width} height={height} />
        </MapStyles>
      </MapStylesBlur>
    );
  } else {
    return (
      <MapStyles>
        <DynamicMap center={center} zoom={zoom} width={width} height={height} />
      </MapStyles>
    );
  }
}

const Minimap = ({ center }: { center: [number, number] }) => {
  return (
    <MapContainer>
      <MapBlur center={center} />
    </MapContainer>
  );
};

export default Minimap;

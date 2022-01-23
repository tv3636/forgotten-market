import styled from "@emotion/styled";
import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("../../components/Map"), {
  ssr: false, // leaflet doesn't like Next.js SSR
});

const MapContainer = styled.div`
  margin-top: 2vh;
  max-height: 250px;
`;

const MapStylesBlur = styled.div`
  .leaflet-container {
    filter: blur(5px);
  }
`;

const MapStyles = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  position: relative;

  .leaflet-container {
    background-color: black;
    border-style: dashed;
    border-radius: 10%;
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

function MapBlur({ center }: { center: any }) {
  if (center[0] == 0 && center[1] == 0) {
    return (
      <MapStylesBlur>
        <MapStyles>
          <div
            style={{
              fontFamily: "Alagard",
              position: "absolute",
              top: "48%",
              zIndex: 1,
              color: "black",
              fontSize: "17px",
              textShadow: "0 0 2px #e0d1a7",
            }}
          >
            Location unrevealed
          </div>
          <DynamicMap
            center={center}
            zoom={7}
            width={"200px"}
            height={"200px"}
          />
        </MapStyles>
      </MapStylesBlur>
    );
  } else {
    return (
      <MapStyles>
        <DynamicMap center={center} zoom={7} width={"200px"} height={"200px"} />
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

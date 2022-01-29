import styled from "@emotion/styled";
import dynamic from "next/dynamic";
import InfoTooltip from "./InfoToolTip";

const DynamicMap = dynamic(() => import("../../components/Map"), {
  ssr: false, // leaflet doesn't like Next.js SSR
});

const MapContainer = styled.div`
  margin-left: 2vw;
  
  @media only screen and (max-width: 600px) {
    margin-top: 3vh;
    margin-left: 0px;
  }
`;

const MapStylesBlur = styled.div`
  width: 250px;
  height: 230px;

  background-color: var(--darkGray);
  border-weight: 10px;
  border-style: dashed;
  border-color: var(--mediumGray);
  border-radius: 16px;
`;

const MapStyles = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
  font-family: Alagard;
  font-size: 17px;
  color: var(--lightGray);
`;

const OverlayMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function MapBlur({ center }: { center: any }) {
  const zoom = 7;
  const width = "250px";
  const height = "230px"

  if (center[0] == 0 && center[1] == 0) {
    return (
      <MapStylesBlur>
        <MapStyles>
          <MapOverlay>
            <OverlayMessage>
              <InfoTooltip tooltip={'So far, only about 25% of the Runiverse has been revealed on the map. The rest remains to be seen.'}/>
              <div style={{marginTop: 'var(--sp-1'}}>
                Location not yet charted on map
              </div>
            </OverlayMessage>
          </MapOverlay>
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
  if (center[0] == 404 && center[1] == 404) {
    return null;
  }
  
  return (
    <MapContainer>
      <MapBlur center={center} />
    </MapContainer>
  );
};

export default Minimap;

import styled from "@emotion/styled";
import InfoTooltip from "./InfoToolTip";
import { ImageOverlay, MapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { LatLngBounds } from "leaflet";

const width = 20;
const height = 16;
const scale = 1;

const bounds = new LatLngBounds(
  [(-height / 2) * scale, (-width / 2) * scale],
  [(height / 2) * scale, (width / 2) * scale]
);

const Container = styled.div`
  margin-left: 2vw;
  z-index: 0;
  
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

    transition: all 300ms;
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
              <a href="https://forgottenrunes.com/map" target="_blank">
                <InfoTooltip tooltip={'So far, only about 25% of the Runiverse has been revealed on the map. The rest remains to be seen.'}/>
              </a>
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
      <MapContainer
        center={center}
        zoom={zoom}
        maxZoom={9}
        minZoom={6}
        scrollWheelZoom={true}
        style={{ height: height, width: width }}
        attributionControl={false}
      >
        <ImageOverlay bounds={bounds} url="/static/img/map/map2.png" />
      </MapContainer>
      </MapStyles>
    );
  }
}

const Minimap = ({ center }: { center: [number, number] }) => {
  if (center[0] == 404 && center[1] == 404) {
    return null;
  }
  
  return (
    <Container>
      <MapBlur center={center} />
    </Container>
  );
};

export default Minimap;

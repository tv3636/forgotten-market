import Layout from "../components/Layout";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import styled from "@emotion/styled";
import {
  MapContainer,
  TileLayer,
  ImageOverlay,
  Marker,
  Popup
} from "react-leaflet";

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
    background-color: #393245;
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

const Map = () => (
  <MapStyles>
    <MapContainer
      center={[0, 0]}
      zoom={7}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
      attributionControl={false}
    >
      <ImageOverlay bounds={bounds} url="/static/img/map/map.png" />
    </MapContainer>
  </MapStyles>
);

export default Map;

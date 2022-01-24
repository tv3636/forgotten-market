import { ImageOverlay, MapContainer } from "react-leaflet";
import styled from "@emotion/styled";
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

export const MapWrapper = styled.div`
  height: 90vh;
`;

type Props = {
  center: [number, number];
  zoom: number;
  height: string;
  width: string;
};

const Map = ({
  center = [0, 0],
  zoom = 7,
  height = "100%",
  width = "100%",
}: Props) => (
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
);

export default Map;

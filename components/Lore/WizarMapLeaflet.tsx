import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import styled from "@emotion/styled";
import "leaflet/dist/leaflet.css";
import L, { CRS } from "leaflet";
import productionWizardData from "../../data/nfts-prod.json";
import { renderToString } from "react-dom/server";
import { useRouter } from "next/router";
import { GeoJsonObject } from "geojson";

const wizData = productionWizardData as { [wizardId: string]: any };

const MapStyles = styled.div`
  .leaflet-container {
    background-color: mediumvioletred;
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

const WizardPopup = ({ name, index }: { name: string; index: number }) => {
  return (
    <>
      <h3>{index}</h3>
      <h3>{name}</h3>
      <a href={`/lore/${index}/0`} target={"_blank"}>
        View lore
      </a>
    </>
  );
};

const Layers = () => {
  const map = useMap();

  const router = useRouter();
  const { wizardIndex } = router.query;

  useEffect(() => {
    if (!map) return;
    const features = [];
    for (let i = 0; i < 10000; i++) {
      const x = (i % 100) * 50;
      const y = Math.floor(i / 100.0) * 50;

      const point1 = map.unproject([x, y], map.getZoom());
      const point2 = map.unproject([x + 50, y + 50], map.getZoom());

      const featureGeoJson = L.rectangle([
        [point1.lat, point1.lng],
        [point2.lat, point2.lng],
      ]).toGeoJSON();

      featureGeoJson.properties.style = {
        color: "black",
        stroke: false,
        fillOpacity: 0,
      };

      featureGeoJson.properties.wizardData = wizData[i];
      featureGeoJson.properties.index = i;

      features.push(featureGeoJson);
    }

    const polygon: GeoJsonObject = {
      type: "FeatureCollection",
      // @ts-ignore
      features: features,
    };

    L.geoJSON(polygon, {
      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          renderToString(
            <WizardPopup
              name={feature.properties.wizardData.name as string}
              index={feature.properties.index}
            />
          )
        );
      },
      style: function (feature) {
        return feature?.properties.style;
      },
    }).addTo(map);
  }, [map]);

  useEffect(() => {
    if (!map || !wizardIndex) return;

    const x: number = (Number.parseInt(wizardIndex as string) % 100) * 50;
    const y: number =
      Math.floor(Number.parseInt(wizardIndex as string) / 100.0) * 50;

    const point1 = map.unproject([x, y], map.getZoom());
    const point2 = map.unproject([x + 50, y + 50], map.getZoom());

    map.fitBounds([
      [point1.lat, point1.lng],
      [point2.lat, point2.lng],
    ]);
  }, [wizardIndex]);

  const bounds = [
    map.unproject([0, 0], map.getZoom()),
    map.unproject([5000, 5000], map.getZoom()),
  ];

  return (
    <>
      <TileLayer
        noWrap={true}
        errorTileUrl={"/static/wizard-tiles/blank.png"}
        // @ts-ignore
        bounds={bounds}
        maxZoom={10}
        minZoom={3}
        url={"/static/wizard-tiles/{z}/{y}/{x}.png"}
      />
    </>
  );
};

const WizardMapLeaflet = () => {
  return (
    <MapStyles>
      <MapContainer
        preferCanvas={true}
        crs={CRS.Simple}
        zoom={5}
        center={[-78.125, 78.125]}
        scrollWheelZoom={false}
        style={{ height: "700px", width: "100%" }}
        attributionControl={false}
      >
        <Layers />
      </MapContainer>
    </MapStyles>
  );
};

export default WizardMapLeaflet;

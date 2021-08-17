import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import styled from "@emotion/styled";
import "leaflet/dist/leaflet.css";
import L, { CRS } from "leaflet";
import productionWizardData from "../../data/nfts-prod.json";
import { renderToString } from "react-dom/server";
import { useRouter } from "next/router";
import { GeoJsonObject } from "geojson";
import { MapWrapper } from "../Map";

const wizData = productionWizardData as { [wizardId: string]: any };

const MapStyles = styled.div`
  height: 100%;

  .leaflet-container {
    background-color: #18151e;
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

  .leaflet-popup-content-wrapper,
  .leaflet-popup-tip {
    background: #dfd1a8;
    color: black;
    opacity: 0.9;
  }

  .leaflet-popup-content-wrapper {
    border-radius: 2px;
  }
`;

const WizardPopup = ({
  name,
  index,
  hasLore,
}: {
  name: string;
  index: number;
  hasLore: boolean;
}) => {
  return (
    <>
      <h3>{index}</h3>
      <h3>{name}</h3>
      {hasLore && (
        <a href={`/lore/${index}/0`} target={"_blank"}>
          View lore
        </a>
      )}
    </>
  );
};

const Layers = () => {
  const map = useMap();
  const router = useRouter();
  const { id } = router.query;

  const wizardHasLore: boolean[] = new Array(10000).fill(true);
  // TODO: ^ populate with true/falses for wizard
  wizardHasLore[3] = false;
  wizardHasLore[3500] = false;

  useEffect(() => {
    if (!map) return;

    L.tileLayer(
      "https://nftz.forgottenrunes.com/tiles/wizards/{z}/{y}/{x}.png",
      {
        noWrap: true,
        errorTileUrl: "https://nftz.forgottenrunes.com/tiles/wizards/blank.png",
        maxZoom: 8,
        minZoom: 3,
      }
    ).addTo(map);

    const backgrounds = []; // Background rectangles and click area for popup

    for (let i = 0; i < 10000; i++) {
      const x = (i % 100) * 50;
      const y = Math.floor(i / 100.0) * 50;

      const point1 = map.unproject([x, y], map.getZoom());
      const point2 = map.unproject([x + 50, y + 50], map.getZoom());

      const background = L.rectangle([
        [point1.lat, point1.lng],
        [point2.lat, point2.lng],
      ]);

      const featureGeoJson = background.toGeoJSON();

      const hasLore = Math.random() > 0.3;
      // TODO: use proper array for prod

      featureGeoJson.properties.style = {
        color: hasLore ? `#${wizData[i].background_color}` : "grey",
        stroke: false,
        fillOpacity: 1,
      };

      featureGeoJson.properties.wizardData = wizData[i];
      featureGeoJson.properties.index = i;
      featureGeoJson.properties.hasLore = hasLore;

      backgrounds.push(featureGeoJson);
    }

    const geoJson: GeoJsonObject = {
      type: "FeatureCollection",
      // @ts-ignore
      features: backgrounds,
    };

    map.createPane("underlays");
    // @ts-ignore
    map.getPane("underlays").style.zIndex = -1;

    L.geoJSON(geoJson, {
      pane: "underlays",
      onEachFeature: function (feature, layer) {
        const popup = L.popup({
          className: "wizard-gallery-popup",
        }).setContent(
          renderToString(
            <WizardPopup
              name={feature.properties.wizardData.name as string}
              index={feature.properties.index}
              hasLore={feature.properties.hasLore}
            />
          )
        );

        layer.bindPopup(popup);

        layer.on("click", function (e) {
          e.target.openPopup(e.target.getBounds().getCenter());
        });
      },
      style: function (feature) {
        return feature?.properties.style;
      },
    }).addTo(map);
  }, [map]);

  useEffect(() => {
    if (!map || !id) return;

    const x: number = (Number.parseInt(id as string) % 100) * 50;
    const y: number = Math.floor(Number.parseInt(id as string) / 100.0) * 50;

    const point1 = map.unproject([x, y], map.getZoom());
    const point2 = map.unproject([x + 50, y + 50], map.getZoom());

    map.fitBounds([
      [point1.lat, point1.lng],
      [point2.lat, point2.lng],
    ]);
  }, [map, id]);

  return (
    <>
      {/* We using raw leaflet for tile and layer adding for performance reasons*/}
    </>
  );
};

const WizardMapLeaflet = () => {
  return (
    <MapWrapper>
      <MapStyles>
        <MapContainer
          preferCanvas={true}
          crs={CRS.Simple}
          zoom={5}
          center={[-78.125, 78.125]}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          attributionControl={false}
          zoomSnap={0.25}
        >
          <Layers />
        </MapContainer>
      </MapStyles>
    </MapWrapper>
  );
};

export default WizardMapLeaflet;

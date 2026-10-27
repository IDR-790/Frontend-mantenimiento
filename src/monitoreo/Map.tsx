import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function MapView() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {

  const map = new maplibregl.Map({
    container: mapContainer.current,
    // style: "https://tiles.openfreemap.org/styles/bright",
    center: [-99.13, 19.43],
    zoom: 12
  });

  map.on("load", () => {
  // console.log("Mapa listo");
    // map.addSource("vehicles", {
    //   type: "geojson",
    //   data: {
    //     type: "FeatureCollection",
    //     features: []
    //   }
    });

    // map.addLayer({
    //   id: "vehicles",
    //   type: "symbol",
    //   source: "vehicles",
    //   layout: {
    //     "icon-image": "car-icon",
    //     "icon-rotate": ["get", "heading"]
    //   }
    // });

//   });

}, []);

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "100vh" }}
    />
  );
}

export function addVehiclesLayer(map) {

  map.addSource("vehicles", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: []
    }
  });

  map.addLayer({
    id: "vehicles-layer",
    type: "symbol",
    source: "vehicles",
    layout: {
      "icon-image": "car-icon",
      "icon-size": 0.6,
      "icon-rotate": ["get", "heading"],
      "icon-allow-overlap": true
    }
  });
}

function updateVehicles(map, vehicles) {

  const features = vehicles.map(v => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [v.lng, v.lat]
    },
    properties: {
      heading: v.heading,
      id: v.id
    }
  }));

  const source = map.getSource("vehicles");

  source.setData({
    type: "FeatureCollection",
    features
  });
}
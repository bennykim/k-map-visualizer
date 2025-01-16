import { GeoKoreaInitializer } from "./lib/GeoKoreaInitializer";

const geoKoreaRenderer = new GeoKoreaInitializer();

if (typeof window !== "undefined") {
  window.GeoKoreaRenderer = geoKoreaRenderer;
}

export default geoKoreaRenderer;

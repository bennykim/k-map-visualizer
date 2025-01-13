import { MapInitializer } from "./lib/MapInitializer";

const mapRenderer = new MapInitializer();

if (typeof window !== "undefined") {
  window.MapRenderer = mapRenderer;
}

export default mapRenderer;

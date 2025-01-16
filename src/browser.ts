import { KMapInitializer } from "./lib/KMapInitializer";

const mapRenderer = new KMapInitializer();

if (typeof window !== "undefined") {
  window.MapRenderer = mapRenderer;
}

export default mapRenderer;

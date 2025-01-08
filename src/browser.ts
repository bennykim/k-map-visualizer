import { KMapVisualizer } from "./lib/KMapVisualizer";

const d3MapLib = new KMapVisualizer();

if (typeof window !== "undefined") {
  window.D3MapLib = d3MapLib;
}

export default d3MapLib;

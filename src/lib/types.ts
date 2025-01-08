import type { KMapVisualizer } from "./KMapVisualizer";

declare global {
  interface Window {
    D3MapLib: KMapVisualizer;
  }
}

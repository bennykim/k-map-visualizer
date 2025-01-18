import type { GeoGeometryObjects } from "d3-geo";

import type { GeoKoreaInitializer } from "./GeoKoreaInitializer";

declare global {
  interface Window {
    GeoKoreaRenderer: GeoKoreaInitializer;
  }
}

export type Point = {
  type: string;
  name: string;
  region: string;
  location: string;
  coordinates: number[];
  radius?: number;
  color?: string;
};

export type MapOptions = {
  width: number;
  height: number;
  center?: [number, number];
  scale?: number;
  points?: Point[];
  colors?: {
    region?: string;
    regionHover?: string;
    point?: string;
    pointHover?: string;
    selected?: string;
    border?: string;
  };
  onRegionClick?: (name: string) => void;
};

export type GeoFeature = {
  type: "Feature";
  properties: {
    name: string;
    [key: string]: any;
  };
  geometry: GeoGeometryObjects;
};

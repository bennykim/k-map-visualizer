import type { GeoGeometryObjects } from "d3-geo";

import type { GeoKorea } from "./GeoKorea";
import type { GeoKoreaInitializer } from "./GeoKoreaInitializer";
import type { LANGUAGE } from "./constants";

declare global {
  interface Window {
    GeoKoreaRenderer: GeoKoreaInitializer;
  }
}

export type Language = (typeof LANGUAGE)[keyof typeof LANGUAGE];

export type Point = {
  type: string;
  name: string;
  region: string;
  location: string;
  coordinates: [number, number];
  radius?: number;
  color?: string;
};

export type MapOptions = {
  width: number;
  height: number;
  center?: [number, number];
  scale?: number;
  points?: Point[];
  colors?: ColorOptions;
  language?: Language;
  onRegionClick?: (name: string) => void;
  tooltipRenderer?: (point: Point) => string;
};

export type ColorOptions = {
  region?: string;
  regionHover?: string;
  point?: string;
  pointHover?: string;
  selected?: string;
  border?: string;
};

export type GeoFeature = {
  type: "Feature";
  properties: {
    name: string;
    [key: string]: any;
  };
  geometry: GeoGeometryObjects;
};

export type GeoKoreaInstance = {
  map: GeoKorea;
  destroy: () => void;
  updatePoints: (points: Point[]) => void;
  setTopoData: (topoData: any, objectName: string) => void;
};

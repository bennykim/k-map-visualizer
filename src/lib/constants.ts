import type { MapOptions } from "./types";

export const LANGUAGE = {
  EN: "en",
  KR: "kr",
} as const;

export const DEFAULT_OPTIONS: MapOptions = {
  width: 800,
  height: 600,
  center: [128.35, 37.68],
  scale: 5,
  points: [],
  colors: {
    region: "#2A2D35",
    regionHover: "#3F4046",
    point: "#5EEAD4",
    pointHover: "#6366F1",
    selected: "#6366F1",
    border: "#4A4B50",
  },
  language: LANGUAGE.EN,
};

export const CONFIG = {
  ZOOM: {
    MIN_SCALE: 0.5,
    MAX_SCALE: 8,
    MIN_ACTUAL_SCALE: 2000,
    MAX_ACTUAL_SCALE: 20000,
    MAX_REGION_SCALE: 5,
    TRANSITION_DURATION: 750,
  },
  POINT: {
    DEFAULT_RADIUS: 3,
    HOVER_SCALE: 2,
    TRANSITION_DURATION: 200,
    TOOLTIP_OFFSET: { X: 10, Y: 10 },
  },
  TOOLTIP: {
    COLORS: {
      BACKGROUND: "#1A1B1E",
      TEXT: "#FFFFFF",
    },
  },
} as const;

export const COLORS = {
  // Base colors
  DARK_BG: "#1A1B1E",
  SLATE_800: "#2A2D35",
  INDIGO_500: "#6366F1",
  VIOLET_400: "#A78BFA",
  TEAL_300: "#5EEAD4",
  NEUTRAL_300: "#D4D4D8",
  // Functional colors
  DEFAULT_REGION: "#2A2D35",
  HOVER_REGION: "#3F4046",
  SELECTED_REGION: "#6366F1",
  BORDER: "#4A4B50",
  POINT_DEFAULT: "#5EEAD4",
  TEXT: "#FFFFFF",
} as const;

export const DEFAULT_RADIUS = 3;

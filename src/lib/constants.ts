import type { MapOptions } from "./types";

export const DEFAULT_OPTIONS: MapOptions = {
  width: 800,
  height: 600,
  center: [128.35, 37.68],
  scale: 28000,
};

export const CONFIG = {
  ZOOM: {
    MIN_SCALE: 0.3,
    MAX_SCALE: 10,
    TRANSITION_DURATION: 750,
    MAX_REGION_SCALE: 8,
  },
  POINT: {
    DEFAULT_RADIUS: 3,
    HOVER_SCALE: 2,
    TRANSITION_DURATION: 200,
    TOOLTIP_OFFSET: { X: 15, Y: 15 },
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

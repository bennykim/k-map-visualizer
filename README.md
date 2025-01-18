# Geo Korea

Interactive map visualization library for Korea using TopoJSON data, built with D3.js. This library provides a flexible and customizable way to create interactive maps of South Korea with features like region highlighting, custom markers, and smooth animations.

## Features

- 🗺️ Interactive region visualization with hover and click effects
- 📍 Customizable point markers with tooltips
- 🔍 Smooth zoom in/out and region focus transitions
- 🎨 Comprehensive theming system with dark mode support
- 🎯 Custom TopoJSON data support
- ⚛️ React component support
- 🔄 TypeScript support with full type definitions

## Installation

```bash
npm install geo-korea
# or
yarn add geo-korea
# or
pnpm add geo-korea
```

## Basic Usage

### React Component

```typescript
import React, { useEffect, useRef } from "react";
import { GeoKoreaInitializer } from "geo-korea";

const Map: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      const renderer = new GeoKoreaInitializer();

      renderer.initializeMap(mapContainerRef.current, {
        width: 800,
        height: 600,
        points: [
          {
            type: "city",
            name: "Seoul",
            region: "서울",
            coordinates: [37.5665, 126.978],
            radius: 5,
            color: "#5EEAD4",
          },
        ],
        onRegionClick: (name) => console.log(`Clicked region: ${name}`),
      });
    }
  }, []);

  return <div ref={mapContainerRef} />;
};
```

### Vanilla JavaScript

```javascript
const container = document.getElementById("map-container");
const renderer = new GeoKoreaInitializer();

renderer.initializeMap(container, {
  width: 800,
  height: 600,
  scale: 5,
  colors: {
    region: "#2A2D35",
    regionHover: "#3F4046",
    point: "#5EEAD4",
    pointHover: "#6366F1",
  },
});
```

## Configuration Options

### MapOptions Interface

```typescript
type MapOptions = {
  // Required
  width: number; // Width of the map container
  height: number; // Height of the map container

  // Optional
  center?: [number, number]; // Center coordinates [longitude, latitude]
  scale?: number; // Map scale (0.5 to 8)
  points?: Point[]; // Array of point markers
  colors?: ColorOptions; // Custom color theme
  onRegionClick?: (name: string) => void; // Region click handler
};
```

### Point Interface

```typescript
type Point = {
  type: string; // Point type (e.g., "city", "landmark")
  name: string; // Point name
  region: string; // Region name
  location: string; // Location description
  coordinates: number[]; // [latitude, longitude]
  radius?: number; // Point size (default: 3)
  color?: string; // Custom point color
};
```

### ColorOptions Interface

```typescript
type ColorOptions = {
  region?: string; // Default region color
  regionHover?: string; // Region hover color
  point?: string; // Default point marker color
  pointHover?: string; // Point marker hover color
  selected?: string; // Selected region color
  border?: string; // Region border color
};
```

## Default Values

```javascript
const defaults = {
  width: 800,
  height: 600,
  center: [128.35, 37.68],
  scale: 5,
  colors: {
    region: "#2A2D35",
    regionHover: "#3F4046",
    point: "#5EEAD4",
    pointHover: "#6366F1",
    selected: "#6366F1",
    border: "#4A4B50",
  },
};
```

## Advanced Features

### Custom TopoJSON Data

You can provide your own TopoJSON data file:

```typescript
renderer.initializeMap(container, {
  topoJsonPath: "/path/to/custom-map-data.json",
});
```

### Custom Tooltip Renderer

```typescript
renderer.initializeMap(container, {
  tooltipRenderer: (point) => {
    return `
      <div>
        <strong>${point.name}</strong>
        <p>${point.location}</p>
      </div>
    `;
  },
});
```

## License

MIT © [MNIII]

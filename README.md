# Geo Korea

Interactive map visualization library for Korea using TopoJSON data, built with D3.js.

## Features

- Interactive region distinction with hover effects
- Customizable point markers
- Smooth zoom in/out and region focus
- Dark theme support
- Fully customizable color system
- React component support

## Installation

```bash
npm install geo-korea
# or
yarn add geo-korea
# or
pnpm add geo-korea
```

## Usage

### With React

```typescript
import React, { useEffect, useRef } from "react";
import { GeoKoreaInitializer } from "geo-korea";

const Map: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      const GeoKoreaRenderer = new GeoKoreaInitializer();

      GeoKoreaRenderer.initializeMap(mapContainerRef.current, {
        width: window.innerWidth,
        height: window.innerHeight,
        center: [128.35, 37.68],
        scale: 5,
        points: [],
        colors: {
          region: "#2A2D35", // Default region color
          regionHover: "#3F4046", // Hover color
          point: "#5EEAD4", // Point color
          pointHover: "#6366F1", // Point hover color
          selected: "#6366F1", // Selected region color
          border: "#4A4B50", // Border color
        },
      });
    }
  }, []);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
  );
};
```

### With Vanilla JavaScript

```javascript
const GeoKoreaRenderer = new GeoKoreaInitializer();

GeoKoreaRenderer.initializeMap("map-container", {
  width: window.innerWidth,
  height: window.innerHeight,
  scale: 5,
  points: cityHalls,
  colors: {
    region: "#2A2D35",
    regionHover: "#3F4046",
    point: "#5EEAD4",
    pointHover: "#6366F1",
    selected: "#6366F1",
    border: "#4A4B50",
  },
});
```

## Props

| Option          | Type                                  | Description              | Default         |
| --------------- | ------------------------------------- | ------------------------ | --------------- |
| width           | number                                | Map width                | 800             |
| height          | number                                | Map height               | 600             |
| center          | [number, number]                      | Center coordinates       | [128.35, 37.68] |
| scale           | number                                | Map scale (1-10)         | 5               |
| points          | Point[]                               | Point data array         | []              |
| topoJsonPath    | string?                               | Custom map data path     | Built-in data   |
| colors          | ColorOptions                          | Color settings           | Default colors  |
| onRegionClick   | (name: string) => void                | Region click handler     | -               |
| tooltipRenderer | (point: Point) => string\|HTMLElement | Tooltip content renderer | -               |

## Types

```typescript
type Point = {
  coordinates: [number, number]; // [latitude, longitude]
  radius?: number; // Point size
  color?: string; // Individual point color
  [key: string]: any; // Additional data
};
```

## License

MIT © [MNIII]

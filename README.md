# Geo Korea

Interactive map visualization library for Korea using TopoJSON data, built with D3.js. This library provides a flexible and customizable way to create interactive maps of South Korea with features like region highlighting, custom markers, and smooth animations.

### 🚀 [Live Demo](https://geo-korea.netlify.app)

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

## Usage

### Basic Usage

#### JavaScript

The simplest way to create a map is to just provide a container ID:

```javascript
// Most basic usage - all options will be set to defaults
const GeoKoreaRenderer = new GeoKoreaInitializer();
const map = await GeoKoreaRenderer.createMap("map-container");
```

#### React

Using React, you can create a map with a ref:

```typescript
import React, { useEffect, useRef } from "react";
import { GeoKoreaInitializer } from "geo-korea";

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Most basic usage - all options will be set to defaults
      const GeoKoreaRenderer = new GeoKoreaInitializer();
      const map = GeoKoreaRenderer.createMap(containerRef.current);

      return () => {
        map.destroy();
      };
    }
  }, []);

  return <div ref={containerRef} />;
};

export default App;
```

### Adding Options

You can enhance the map with various options:

```javascript
const GeoKoreaRenderer = new GeoKoreaInitializer();
const map = await GeoKoreaRenderer.createMap("map-container", {
  points: [
    {
      name: "Seoul City Hall",
      region: "Capital Area",
      location: "Seoul Metropolitan City",
      coordinates: [37.5666805, 126.9784147],
      type: "City Hall",
    },
  ],
  onRegionClick: (name) => console.log(`Clicked region: ${name}`),
});
```

### React Component

```typescript
import React, { useEffect, useRef } from "react";
import { GeoKoreaInitializer } from "geo-korea";

const Map: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      const GeoKoreaRenderer = new GeoKoreaInitializer();
      const map = GeoKoreaRenderer.createMap(mapContainerRef.current, {
        points: [
          {
            name: "Seoul City Hall",
            region: "Capital Area",
            location: "Seoul Metropolitan City",
            coordinates: [37.5666805, 126.9784147],
            type: "City Hall",
          },
        ],
        onRegionClick: (name) => console.log(`Clicked region: ${name}`),
      });

      return () => {
        map.destroy();
      };
    }
  }, []);

  return <div ref={mapContainerRef} />;
};
```

## Configuration

### Auto-Calculated Values & Default Colors

When you create a map without options, the library will:

1. **Auto-Calculate**:

   - `width` and `height`: Automatically set based on the container size
   - `center` and `scale`: Automatically adjusted to fit the map perfectly within the container

2. **Default Colors**:

```javascript
const defaultColors = {
  region: "#2A2D35",
  regionHover: "#3F4046",
  point: "#5EEAD4",
  pointHover: "#6366F1",
  selected: "#6366F1",
  border: "#4A4B50",
};
```

### Available Options

#### MapOptions Interface

```typescript
type MapOptions = {
  width?: number; // Width of the map container
  height?: number; // Height of the map container
  center?: [number, number]; // Center coordinates [longitude, latitude]
  scale?: number; // Map scale (0.5 to 8)
  points?: Point[]; // Array of point markers
  colors?: ColorOptions; // Custom color theme
  onRegionClick?: (name: string) => void; // Region click handler
  tooltipRenderer?: (point: Point) => string; // Custom tooltip renderer
};
```

#### Point Interface

```typescript
type Point = {
  type: string; // Point type (e.g., "city", "landmark")
  name: string; // Point name
  region: string; // Region name
  location: string; // Location description
  coordinates: [number, number]; // [latitude, longitude]
  radius?: number; // Point size (default: 3)
  color?: string; // Custom point color
};
```

#### ColorOptions Interface

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

## Advanced Features

### Custom TopoJSON Data

```typescript
const map = await GeoKoreaRenderer.createMap("map-container", {
  topoJsonPath: "/path/to/custom-map-data.json",
});
```

### Custom Tooltip Renderer

```typescript
const map = await GeoKoreaRenderer.createMap("map-container", {
  tooltipRenderer: (point) => {
    return `
      <div>
        <strong>${point.name}</strong>
        <p>${point.location}</p>
      </div>
    `;
  },
});
// or
// using React components
const map = GeoKoreaRenderer.createMap(mapContainerRef.current, {
  tooltipRenderer: (point) => {
    return `
      <div>
        <strong>${point.name}</strong>
        <p>${point.location}</p>
      </div>
    `;
  },
}
```

### Instance Methods

The `createMap` method returns a GeoKoreaInstance with the following methods:

```typescript
type GeoKoreaInstance = {
  map: GeoKorea; // Access to the underlying map instance
  destroy: () => void; // Clean up resources
  updatePoints: (points: Point[]) => void; // Update point markers
  setTopoData: (topoData: any, objectName: string) => void; // Update map data
};
```

## License

MIT © [MNIII]

import type { Topology } from "topojson-specification";
import { GeoKorea } from "./GeoKorea";
import { DEFAULT_OPTIONS } from "./constants";
import defaultMapData from "./data/K-City_2023.json";
import type { GeoKoreaInstance, MapOptions, Point } from "./types";

export class GeoKoreaInitializer {
  createMap(
    container: HTMLElement | string,
    options: Partial<MapOptions & { topoJsonPath?: string }> = {}
  ): GeoKoreaInstance {
    const containerElement = this.getContainerElement(container);
    if (!containerElement) {
      throw new Error("Container element not found");
    }

    const mergedOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    const mapInstance = new GeoKorea(containerElement, mergedOptions);

    if (options.topoJsonPath) {
      this.loadTopoData(options.topoJsonPath, mapInstance);
    } else {
      this.initializeDefaultData(mapInstance);
    }

    return {
      map: mapInstance,
      destroy: () => {
        mapInstance.destroy();
      },
      updatePoints: (points: Point[]) => {
        mapInstance.updatePoints(points);
      },
      setTopoData: (topoData: any, objectName: string) => {
        mapInstance.setTopoData(topoData, objectName);
      },
    };
  }

  private initializeDefaultData(mapInstance: GeoKorea): void {
    const topoData = defaultMapData as unknown as Topology;
    const objectName = this.getFirstObjectKey(topoData);
    mapInstance.setTopoData(topoData, objectName);
  }

  private loadTopoData(path: string, mapInstance: GeoKorea): void {
    fetch(path)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((topoData) => {
        const objectName = this.getFirstObjectKey(topoData);
        mapInstance.setTopoData(topoData, objectName);
      })
      .catch((error) => {
        console.error("Failed to load TopoJSON data:", error);
        this.initializeDefaultData(mapInstance);
      });
  }

  private getContainerElement(
    container: HTMLElement | string
  ): HTMLElement | null {
    if (typeof container === "string") {
      const element = document.getElementById(container);
      if (!element) {
        console.error(`Container element with id '${container}' not found`);
        return null;
      }
      return element;
    }

    if (!(container instanceof HTMLElement)) {
      console.error("Invalid container element");
      return null;
    }

    return container;
  }

  private getFirstObjectKey(data: Topology): string {
    const keys = Object.keys(data.objects);
    if (keys.length === 0) {
      throw new Error("No objects found in TopoJSON data");
    }
    return keys[0];
  }
}

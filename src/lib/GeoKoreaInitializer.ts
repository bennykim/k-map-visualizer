import type { Topology } from "topojson-specification";

import { GeoKorea } from "./GeoKorea";
import { DEFAULT_OPTIONS } from "./constants";
import { MapOptions } from "./types";

import defaultMapData from "./data/K-City_2023.json";

export class GeoKoreaInitializer {
  async initializeMap(
    container: HTMLElement | string,
    options: Partial<MapOptions & { topoJsonPath?: string }> = {}
  ): Promise<GeoKorea> {
    const containerElement =
      typeof container === "string"
        ? this.validateContainer(container)
        : container;

    if (!containerElement) {
      throw new Error("Container element is required");
    }

    const mergedOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
      onRegionClick: options.onRegionClick,
    };

    const map = new GeoKorea(containerElement, mergedOptions);

    try {
      const topoData = options.topoJsonPath
        ? await this.loadTopoJSON(options.topoJsonPath)
        : (defaultMapData as unknown as Topology);

      map.setTopoData(topoData, this.getFirstObjectKey(topoData));
      return map;
    } catch (error) {
      map.destroy();
      throw error;
    }
  }

  private validateContainer(containerId: string): HTMLElement {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container element with id '${containerId}' not found`);
    }
    return container;
  }

  private async loadTopoJSON(path: string): Promise<Topology> {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load TopoJSON data: ${response.statusText}`);
    }

    const topoData = (await response.json()) as Topology;
    return this.validateTopoJSON(topoData);
  }

  private validateTopoJSON(data: Topology): Topology {
    if (!data?.objects) {
      throw new Error("Invalid TopoJSON data: missing objects");
    }
    return data;
  }

  private getFirstObjectKey(data: Topology): string {
    const keys = Object.keys(data.objects);
    if (keys.length === 0) {
      throw new Error("No objects found in TopoJSON data");
    }
    return keys[0];
  }
}

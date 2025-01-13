import type { Topology } from "topojson-specification";

import { KMapVisualizer } from "./KMapVisualizer";
import { DEFAULT_OPTIONS } from "./constants";
import { MapOptions } from "./types";

export class MapInitializer {
  async initializeMap(
    containerId: string,
    topoJsonPath: string,
    options: Partial<MapOptions> = {}
  ): Promise<KMapVisualizer> {
    const container = this.validateContainer(containerId);

    const mergedOptions = {
      ...DEFAULT_OPTIONS,
      ...options,

      onRegionClick: options.onRegionClick,
    };

    const map = new KMapVisualizer(container, mergedOptions);

    try {
      const topoData = await this.loadTopoJSON(topoJsonPath);
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

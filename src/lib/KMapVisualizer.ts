import type { Topology } from "topojson-specification";

import { D3Map, MapOptions } from "../D3Map";
import { DEFAULT_OPTIONS } from "./constants";

export class KMapVisualizer {
  async initializeMap(
    containerId: string, // 지도를 그릴 DOM 요소의 ID
    topoJsonPath: string, // TopoJSON 데이터 경로
    options: Partial<MapOptions> = {} // 지도 설정 옵션
  ): Promise<D3Map> {
    // DOM 요소 검증
    const container = this.validateContainer(containerId);

    // 옵션 병합
    const mergedOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
      // 콘솔 로그는 기본 옵션에서 제거하고 필요한 경우만 options에서 전달
      onRegionClick: options.onRegionClick,
    };

    const map = new D3Map(container, mergedOptions);

    try {
      // TopoJSON 데이터 로드 및 검증
      const topoData = await this.loadTopoJSON(topoJsonPath);
      map.setTopoData(topoData, this.getFirstObjectKey(topoData));
      return map;
    } catch (error) {
      map.destroy();
      throw error;
    }
  }

  /**
   * DOM 컨테이너 검증
   */
  private validateContainer(containerId: string): HTMLElement {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container element with id '${containerId}' not found`);
    }
    return container;
  }

  /**
   * TopoJSON 데이터 로드 및 검증
   */
  private async loadTopoJSON(path: string): Promise<Topology> {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load TopoJSON data: ${response.statusText}`);
    }

    const topoData = (await response.json()) as Topology;
    return this.validateTopoJSON(topoData);
  }

  /**
   * TopoJSON 데이터 유효성 검증
   */
  private validateTopoJSON(data: Topology): Topology {
    if (!data?.objects) {
      throw new Error("Invalid TopoJSON data: missing objects");
    }
    return data;
  }

  /**
   * TopoJSON 객체의 첫 번째 키 반환
   */
  private getFirstObjectKey(data: Topology): string {
    const keys = Object.keys(data.objects);
    if (keys.length === 0) {
      throw new Error("No objects found in TopoJSON data");
    }
    return keys[0];
  }
}

import * as d3 from "d3";
import type { GeoGeometryObjects, GeoPath, GeoProjection } from "d3-geo";
import { feature, mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";

export interface MapOptions {
  width: number;
  height: number;
  center?: [number, number];
  scale?: number;
  onRegionClick?: (name: string) => void;
}

export interface GeoFeature {
  type: "Feature";
  properties: {
    adm_nm: string;
    [key: string]: any;
  };
  geometry: GeoGeometryObjects;
}

export class D3Map {
  private readonly svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private readonly g: d3.Selection<SVGGElement, unknown, null, undefined>;
  private readonly projection: GeoProjection;
  private readonly path: GeoPath;
  private readonly zoom: d3.ZoomBehavior<SVGSVGElement, unknown>;

  constructor(container: HTMLElement, private readonly options: MapOptions) {
    this.svg = d3
      .select(container)
      .append("svg")
      .attr("viewBox", [0, 0, options.width, options.height])
      .attr("width", options.width)
      .attr("height", options.height)
      .attr("style", "max-width: 100%; height: auto;");

    this.g = this.svg.append("g");

    this.projection = d3
      .geoMercator()
      .center(options.center || [128.35, 37.68])
      .scale(options.scale || 28000)
      .translate([options.width / 2, options.height / 2]);

    this.path = d3.geoPath(this.projection);

    this.zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 10])
      .on("zoom", this.handleZoom);

    this.svg.call(this.zoom).on("click", (event) => {
      if (event.target === this.svg.node()) {
        this.reset();
      }
    });
  }

  public setTopoData(topoData: Topology, objectName: string): void {
    const geojson = feature(
      topoData,
      topoData.objects[objectName] as GeometryCollection<
        GeoFeature["properties"]
      >
    ) as { type: "FeatureCollection"; features: GeoFeature[] };

    this.g.selectAll("*").remove();

    // 지역 그리기
    this.g
      .append("g")
      .attr("fill", "#444")
      .attr("cursor", "pointer")
      .selectAll<SVGPathElement, GeoFeature>("path")
      .data(geojson.features)
      .join("path")
      .attr("d", this.path)
      .on("click", this.handleRegionClick)
      .append("title")
      .text((d) => d.properties.adm_nm);

    // 경계선 그리기
    this.g
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr(
        "d",
        this.path(
          mesh(
            topoData,
            topoData.objects[objectName] as GeometryCollection,
            (a, b) => a !== b
          )
        )
      );
  }

  private handleRegionClick = (event: MouseEvent, d: GeoFeature): void => {
    event.stopPropagation();

    if (this.options.onRegionClick) {
      this.options.onRegionClick(d.properties.adm_nm);
    }

    const paths = this.g.selectAll<SVGPathElement, GeoFeature>("path");
    paths.style("fill", null);
    d3.select(event.currentTarget as SVGPathElement).style("fill", "#181818");

    const [[x0, y0], [x1, y1]] = this.path.bounds(d);
    const scale = Math.min(
      8,
      0.5 /
        Math.max(
          (x1 - x0) / this.options.width,
          (y1 - y0) / this.options.height
        )
    );

    this.svg
      .transition()
      .duration(750)
      .call(
        this.zoom.transform,
        d3.zoomIdentity
          .translate(this.options.width / 2, this.options.height / 2)
          .scale(scale)
          .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
      );
  };

  private handleZoom = (
    event: d3.D3ZoomEvent<SVGSVGElement, unknown>
  ): void => {
    const { transform } = event;
    this.g
      .attr("transform", transform.toString())
      .attr("stroke-width", `${1 / transform.k}`);
  };

  private reset(): void {
    this.g.selectAll<SVGPathElement, GeoFeature>("path").style("fill", null);

    if (this.options.onRegionClick) {
      this.options.onRegionClick("");
    }

    this.svg
      .transition()
      .duration(750)
      .call(this.zoom.transform, d3.zoomIdentity);
  }

  public destroy(): void {
    this.svg.remove();
  }
}

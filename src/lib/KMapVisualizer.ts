import * as d3 from "d3";
import type { GeoPath, GeoProjection } from "d3-geo";
import { feature, mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";

import { COLORS, DEFAULT_RADIUS } from "./constants";
import type { GeoFeature, MapOptions, Point } from "./types";

export class KMapVisualizer {
  private readonly svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private readonly g: d3.Selection<SVGGElement, unknown, null, undefined>;
  private readonly labelGroup: d3.Selection<
    SVGGElement,
    unknown,
    null,
    undefined
  >;
  private readonly pointGroup: d3.Selection<
    SVGGElement,
    unknown,
    null,
    undefined
  >;
  private readonly tooltipDiv: d3.Selection<
    HTMLDivElement,
    unknown,
    null,
    undefined
  >;
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
    this.labelGroup = this.svg.append("g").attr("class", "labels");
    this.pointGroup = this.svg.append("g").attr("class", "points");

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

    this.tooltipDiv = d3
      .select(container)
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", COLORS.DARK_BG)
      .style("color", COLORS.TEXT)
      .style("padding", "12px")
      .style("border-radius", "8px")
      .style("font-size", "14px")
      .style("max-width", "300px")
      .style(
        "box-shadow",
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      )
      .style("z-index", "1000")
      .style("pointer-events", "none");

    this.svg.call(this.zoom).on("click", (event) => {
      if (event.target === this.svg.node()) {
        this.reset();
      }
    });

    if (options.points?.length) {
      this.renderPoints(options.points);
    }
  }

  private formatTooltipContent(point: Point): string {
    return `
      <div style="margin-bottom: 8px;">
        <strong style="color: ${COLORS.TEAL_300}">${point.name}</strong>
      </div>
      <div style="margin-bottom: 4px;">
        <span style="color: ${COLORS.NEUTRAL_300}">지역:</span> ${point.region}
      </div>
      <div style="margin-bottom: 4px;">
        <span style="color: ${COLORS.NEUTRAL_300}">위치:</span> ${
      point.location
    }
      </div>
      <div style="margin-bottom: 4px;">
        <span style="color: ${
          COLORS.NEUTRAL_300
        }">산업:</span> ${point.industries.join(", ")}
      </div>
      <div style="margin-bottom: 4px;">
        <span style="color: ${
          COLORS.NEUTRAL_300
        }">기업 수:</span> ${point.companies.toLocaleString()}개
      </div>
      <div>
        <span style="color: ${
          COLORS.NEUTRAL_300
        }">주요기업:</span> ${point.majorCompanies.join(", ")}
      </div>
    `;
  }

  private calculatePointRadius(
    baseRadius: number,
    zoomLevel: number,
    isHovered: boolean = false
  ): number {
    // Reduce base size by 1/2, scaling proportionally to zoom level
    const adjustedRadius = (baseRadius / 2) * zoomLevel;
    return isHovered ? adjustedRadius * 1.5 : adjustedRadius;
  }

  private renderPoints(points: Point[]): void {
    this.pointGroup.selectAll("circle").remove();

    points.forEach((point) => {
      const [latitude, longitude] = point.coordinates;
      const [x, y] = this.projection([longitude, latitude])!;
      const baseRadius = point.radius || 3;

      this.pointGroup
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", baseRadius)
        .attr("data-original-radius", baseRadius) // Save original radius
        .attr("fill", point.color || COLORS.POINT_DEFAULT)
        .style("cursor", "pointer")
        .on("mouseenter", (event) => {
          const currentZoom = d3.zoomTransform(this.svg.node()!).k;
          const currentRadius = this.calculatePointRadius(
            baseRadius,
            currentZoom
          );

          d3.select(event.target)
            .transition()
            .duration(200)
            .attr("r", currentRadius * 2)
            .attr("fill", "red");

          this.tooltipDiv
            .html(this.formatTooltipContent(point))
            .style("visibility", "visible")
            .style("left", `${event.pageX + 15}px`)
            .style("top", `${event.pageY - 15}px`);
        })
        .on("mousemove", (event) => {
          this.tooltipDiv
            .style("left", `${event.pageX + 15}px`)
            .style("top", `${event.pageY - 15}px`);
        })
        .on("mouseleave", (event) => {
          const currentZoom = d3.zoomTransform(this.svg.node()!).k;
          const currentRadius = this.calculatePointRadius(
            baseRadius,
            currentZoom
          );

          d3.select(event.target)
            .transition()
            .duration(200)
            .attr("r", currentRadius)
            .attr("fill", COLORS.POINT_DEFAULT);

          this.tooltipDiv.style("visibility", "hidden");
        });
    });
  }

  public updatePoints(points: Point[]): void {
    this.renderPoints(points);
  }

  private showLabel(d: GeoFeature, event: MouseEvent): void {
    this.labelGroup.selectAll("text").remove();
    const centroid = this.path.centroid(d);

    this.labelGroup
      .append("text")
      .attr("x", centroid[0])
      .attr("y", centroid[1])
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("fill", COLORS.TEXT)
      .attr("font-weight", "medium")
      .attr("font-size", "12px")
      .attr("pointer-events", "none")
      .text(d.properties.name);
  }

  private hideLabel(): void {
    this.labelGroup.selectAll("text").remove();
  }

  public setTopoData(topoData: Topology, objectName: string): void {
    const geojson = feature(
      topoData,
      topoData.objects[objectName] as GeometryCollection<
        GeoFeature["properties"]
      >
    ) as { type: "FeatureCollection"; features: GeoFeature[] };

    this.g.selectAll("*").remove();

    // Draw regions
    this.g
      .append("g")
      .attr("fill", COLORS.DEFAULT_REGION)
      .attr("cursor", "pointer")
      .selectAll<SVGPathElement, GeoFeature>("path")
      .data(geojson.features)
      .join("path")
      .attr("d", this.path)
      .on("click", this.handleRegionClick)
      .on("mouseenter", (event, d) => {
        const target = d3.select(event.currentTarget);
        if (target.style("fill") !== COLORS.SELECTED_REGION) {
          target.style("fill", COLORS.HOVER_REGION);
        }
        this.showLabel(d, event);
      })
      .on("mouseleave", (event) => {
        const target = d3.select(event.currentTarget);
        if (target.style("fill") !== COLORS.SELECTED_REGION) {
          target.style("fill", COLORS.DEFAULT_REGION);
        }
        this.hideLabel();
      });

    // Draw borders
    this.g
      .append("path")
      .attr("fill", "none")
      .attr("stroke", COLORS.BORDER)
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

    if (this.options.points?.length) {
      this.renderPoints(this.options.points);
    }
  }

  private handleRegionClick = (event: MouseEvent, d: GeoFeature): void => {
    event.stopPropagation();

    if (this.options.onRegionClick) {
      this.options.onRegionClick(d.properties.name);
    }

    const paths = this.g.selectAll<SVGPathElement, GeoFeature>("path");
    paths.style("fill", null);
    d3.select(event.currentTarget as SVGPathElement).style(
      "fill",
      COLORS.SELECTED_REGION
    );

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

    this.labelGroup.attr("transform", transform.toString());
    this.pointGroup
      .attr("transform", transform.toString())
      .selectAll("circle")
      .attr("r", (_, i, nodes) => {
        const circle = d3.select(nodes[i]);
        const baseRadius = parseFloat(
          circle.attr("data-original-radius") || DEFAULT_RADIUS.toString()
        );
        const isHovered = circle.classed("hovered");
        return this.calculatePointRadius(baseRadius, transform.k, isHovered);
      });
  };

  private reset(): void {
    this.g.selectAll<SVGPathElement, GeoFeature>("path").style("fill", null);
    this.hideLabel();

    if (this.options.onRegionClick) {
      this.options.onRegionClick("");
    }

    this.svg
      .transition()
      .duration(750)
      .call(this.zoom.transform, d3.zoomIdentity);
  }

  public destroy(): void {
    this.tooltipDiv.remove();
    this.svg.remove();
  }
}

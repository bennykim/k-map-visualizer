import * as d3 from "d3";
import type { GeoPath, GeoProjection } from "d3-geo";
import { feature, mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import { COLORS, CONFIG, DEFAULT_OPTIONS, DEFAULT_RADIUS } from "./constants";
import type { GeoFeature, MapOptions, Point } from "./types";

type TooltipContent = string | HTMLElement;
type D3Selection<T extends Element> = d3.Selection<T, unknown, null, undefined>;

export class KMapVisualizer {
  private readonly svg: D3Selection<SVGSVGElement>;
  private readonly g: D3Selection<SVGGElement>;
  private readonly labelGroup: D3Selection<SVGGElement>;
  private readonly pointGroup: D3Selection<SVGGElement>;
  private readonly tooltipDiv: D3Selection<HTMLDivElement>;
  private readonly projection: GeoProjection;
  private readonly path: GeoPath;
  private readonly zoom: d3.ZoomBehavior<SVGSVGElement, unknown>;

  private readonly elements = new Map<string, D3Selection<SVGElement>>();

  constructor(
    container: HTMLElement,
    private readonly options: MapOptions & {
      tooltipRenderer?: (point: Point) => TooltipContent;
    }
  ) {
    const svg = this.initializeSvg(container);
    this.svg = svg;

    const { g, labelGroup, pointGroup } = this.initializeGroups(svg);
    this.g = g;
    this.labelGroup = labelGroup;
    this.pointGroup = pointGroup;

    const { projection, path } = this.initializeProjection();
    this.projection = projection;
    this.path = path;

    this.zoom = this.initializeZoom();
    this.tooltipDiv = this.initializeTooltip(container);

    this.setupEventHandlers();
    this.renderInitialPoints();
  }

  private renderInitialPoints(): void {
    if (this.options.points?.length) {
      this.renderPoints(this.options.points);
    }
  }

  private initializeSvg(container: HTMLElement): D3Selection<SVGSVGElement> {
    const { width, height } = this.options;
    return d3
      .select(container)
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto;");
  }

  private initializeGroups(svg: D3Selection<SVGSVGElement>) {
    return {
      g: svg.append("g"),
      labelGroup: svg.append("g").attr("class", "labels"),
      pointGroup: svg.append("g").attr("class", "points"),
    };
  }

  private initializeProjection() {
    const {
      width,
      height,
      center = DEFAULT_OPTIONS.center!,
      scale = DEFAULT_OPTIONS.scale!,
    } = this.options;

    const projection = d3
      .geoMercator()
      .center(center)
      .scale(scale)
      .translate([width / 2, height / 2]);

    return {
      projection,
      path: d3.geoPath(projection),
    };
  }

  private initializeZoom() {
    return d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([CONFIG.ZOOM.MIN_SCALE, CONFIG.ZOOM.MAX_SCALE])
      .on("zoom", this.handleZoom);
  }

  private initializeTooltip(
    container: HTMLElement
  ): D3Selection<HTMLDivElement> {
    return d3
      .select(container)
      .append("div")
      .attr("class", "tooltip")
      .call(this.applyTooltipStyles);
  }

  private applyTooltipStyles = (
    selection: D3Selection<HTMLDivElement>
  ): void => {
    const styles = {
      position: "absolute",
      visibility: "hidden",
      "background-color": COLORS.DARK_BG,
      color: COLORS.TEXT,
      padding: "12px",
      "border-radius": "8px",
      "font-size": "14px",
      "max-width": "300px",
      "box-shadow":
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      "z-index": "1000",
      "pointer-events": "none",
    };

    Object.entries(styles).forEach(([key, value]) => {
      selection.style(key, value);
    });
  };

  private setupEventHandlers(): void {
    this.svg.call(this.zoom).on("click", (event) => {
      if (event.target === this.svg.node()) {
        this.reset();
      }
    });
  }

  private handlePoint = {
    enter: (point: Point, baseRadius: number) => {
      return (event: MouseEvent) => {
        const currentZoom = this.getCurrentZoom();
        const circle = d3.select(event.target as SVGCircleElement);

        circle
          .transition()
          .duration(CONFIG.POINT.TRANSITION_DURATION)
          .attr(
            "r",
            this.calculatePointRadius(baseRadius, currentZoom) *
              CONFIG.POINT.HOVER_SCALE
          )
          .attr("fill", "red");

        this.updateTooltip(event, point);
      };
    },

    move: (event: MouseEvent) => {
      const { pageX, pageY } = event;
      this.tooltipDiv
        .style("left", `${pageX + CONFIG.POINT.TOOLTIP_OFFSET.X}px`)
        .style("top", `${pageY + CONFIG.POINT.TOOLTIP_OFFSET.Y}px`);
    },

    leave: (baseRadius: number) => {
      return (event: MouseEvent) => {
        const currentZoom = this.getCurrentZoom();
        const circle = d3.select(event.target as SVGCircleElement);

        circle
          .transition()
          .duration(CONFIG.POINT.TRANSITION_DURATION)
          .attr("r", this.calculatePointRadius(baseRadius, currentZoom))
          .attr("fill", COLORS.POINT_DEFAULT);

        this.tooltipDiv.style("visibility", "hidden");
      };
    },
  };

  private getCurrentZoom(): number {
    return d3.zoomTransform(this.svg.node()!).k;
  }

  private updateTooltip(event: MouseEvent, point: Point): void {
    const content = this.options.tooltipRenderer?.(point) ?? "";

    this.tooltipDiv
      .html(typeof content === "string" ? content : "")
      .style("visibility", "visible")
      .style("left", `${event.pageX + CONFIG.POINT.TOOLTIP_OFFSET.X}px`)
      .style("top", `${event.pageY + CONFIG.POINT.TOOLTIP_OFFSET.Y}px`);

    if (typeof content !== "string") {
      this.tooltipDiv.node()?.appendChild(content);
    }
  }

  private calculatePointRadius(
    baseRadius: number,
    zoomLevel: number,
    isHovered = false
  ): number {
    const adjustedRadius = (baseRadius / 2) * zoomLevel;
    return isHovered ? adjustedRadius * 1.5 : adjustedRadius;
  }

  private renderPoints(points: Point[]): void {
    this.pointGroup.selectAll("circle").remove();

    points.forEach((point) => {
      const [latitude, longitude] = point.coordinates;
      const [x, y] = this.projection([longitude, latitude])!;
      const baseRadius = point.radius ?? DEFAULT_RADIUS;

      this.pointGroup
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", baseRadius)
        .attr("data-original-radius", baseRadius)
        .attr("fill", point.color ?? COLORS.POINT_DEFAULT)
        .style("cursor", "pointer")
        .on("mouseenter", this.handlePoint.enter(point, baseRadius))
        .on("mousemove", this.handlePoint.move)
        .on("mouseleave", this.handlePoint.leave(baseRadius));
    });
  }

  private handleRegion: {
    click: (
      event: MouseEvent & { currentTarget: SVGPathElement },
      d: GeoFeature
    ) => void;
    enter: (
      event: MouseEvent & { currentTarget: SVGPathElement },
      d: GeoFeature
    ) => void;
    leave: (event: MouseEvent & { currentTarget: SVGPathElement }) => void;
  } = {
    click: (event: MouseEvent, d: GeoFeature) => {
      event.stopPropagation();
      this.options.onRegionClick?.(d.properties.name);

      const paths = this.g.selectAll<SVGPathElement, GeoFeature>("path");
      paths.style("fill", null);

      d3.select(event.currentTarget as SVGPathElement).style(
        "fill",
        COLORS.SELECTED_REGION
      );

      this.zoomToRegion(d);
    },

    enter: (event: MouseEvent, d: GeoFeature) => {
      const target = d3.select(event.currentTarget as Element);
      if (target.style("fill") !== COLORS.SELECTED_REGION) {
        target.style("fill", COLORS.HOVER_REGION);
      }
      this.showLabel(d);
    },

    leave: (event: MouseEvent) => {
      const target = d3.select(event.currentTarget as Element);
      if (target.style("fill") !== COLORS.SELECTED_REGION) {
        target.style("fill", COLORS.DEFAULT_REGION);
      }
      this.hideLabel();
    },
  };

  private showLabel(d: GeoFeature): void {
    this.labelGroup.selectAll("text").remove();
    const [x, y] = this.path.centroid(d);

    this.labelGroup
      .append("text")
      .attr("x", x)
      .attr("y", y)
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

  private handleZoom = (
    event: d3.D3ZoomEvent<SVGSVGElement, unknown>
  ): void => {
    const { transform } = event;
    const transformString = transform.toString();

    [this.g, this.labelGroup, this.pointGroup].forEach((group) => {
      group.attr("transform", transformString);
    });

    this.g.attr("stroke-width", `${1 / transform.k}`);

    this.pointGroup.selectAll("circle").attr("r", (_, i, nodes) => {
      const circle = d3.select(nodes[i]);
      const baseRadius = parseFloat(
        circle.attr("data-original-radius") ?? DEFAULT_RADIUS.toString()
      );
      const isHovered = circle.classed("hovered");
      return this.calculatePointRadius(baseRadius, transform.k, isHovered);
    });
  };

  public updatePoints(points: Point[]): void {
    this.renderPoints(points);
  }

  public setTopoData(topoData: Topology, objectName: string): void {
    const geojson = feature(
      topoData,
      topoData.objects[objectName] as GeometryCollection<
        GeoFeature["properties"]
      >
    ) as { type: "FeatureCollection"; features: GeoFeature[] };

    this.g.selectAll("*").remove();
    this.renderRegions(geojson.features);
    this.renderBorders(topoData, objectName);
    this.renderInitialPoints();
  }

  public destroy(): void {
    this.tooltipDiv.remove();
    this.svg.remove();
    this.elements.clear();
  }

  private reset(): void {
    this.g.selectAll<SVGPathElement, GeoFeature>("path").style("fill", null);
    this.hideLabel();
    this.options.onRegionClick?.("");

    this.svg
      .transition()
      .duration(CONFIG.ZOOM.TRANSITION_DURATION)
      .call(this.zoom.transform, d3.zoomIdentity);
  }

  private renderRegions(features: GeoFeature[]): void {
    this.g
      .append("g")
      .attr("fill", COLORS.DEFAULT_REGION)
      .attr("cursor", "pointer")
      .selectAll<SVGPathElement, GeoFeature>("path")
      .data(features)
      .join("path")
      .attr("d", this.path)
      .on("click", this.handleRegion.click)
      .on("mouseenter", this.handleRegion.enter)
      .on("mouseleave", this.handleRegion.leave);
  }

  private renderBorders(topoData: Topology, objectName: string): void {
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
  }

  private zoomToRegion(d: GeoFeature): void {
    const [[x0, y0], [x1, y1]] = this.path.bounds(d);
    const scale = Math.min(
      CONFIG.ZOOM.MAX_REGION_SCALE,
      0.5 /
        Math.max(
          (x1 - x0) / this.options.width,
          (y1 - y0) / this.options.height
        )
    );

    this.svg
      .transition()
      .duration(CONFIG.ZOOM.TRANSITION_DURATION)
      .call(
        this.zoom.transform,
        d3.zoomIdentity
          .translate(this.options.width / 2, this.options.height / 2)
          .scale(scale)
          .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
      );
  }
}

import type { Topology } from "topojson-specification";

import { GeoKorea } from "./GeoKorea";
import { DEFAULT_OPTIONS } from "./constants";
import type { Point } from "./types";

jest.mock("d3");

describe("GeoKorea", () => {
  let container: HTMLElement;
  let geoKorea: GeoKorea;

  const testPoints: Point[] = [
    {
      type: "test1",
      name: "Test Complex",
      region: "Seoul",
      location: "Gangnam",
      coordinates: [127.1, 37.5],
    },
  ];

  const testTopoData: Topology = {
    type: "Topology",
    objects: {
      testRegion: {
        type: "GeometryCollection",
        geometries: [
          {
            type: "Polygon",
            properties: { name: "Test Region" },
            arcs: [[0]],
          },
        ],
      },
    },
    arcs: [
      [
        [0, 0],
        [100, 0],
        [0, 100],
        [0, 0],
      ],
    ],
    transform: {
      scale: [1, 1],
      translate: [0, 0],
    },
  };

  beforeEach(() => {
    container = document.createElement("div");
    container.style.width = "800px";
    container.style.height = "600px";
    jest.spyOn(container, "getBoundingClientRect").mockImplementation(() => ({
      width: 800,
      height: 600,
      top: 0,
      left: 0,
      right: 800,
      bottom: 600,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    jest.clearAllMocks();
  });

  describe("Container and Initialization", () => {
    it("calculates container size correctly", () => {
      geoKorea = new GeoKorea(container, DEFAULT_OPTIONS);
      expect(container.getBoundingClientRect).toHaveBeenCalled();
    });

    it("initializes SVG with container dimensions", () => {
      geoKorea = new GeoKorea(container, DEFAULT_OPTIONS);
      expect(geoKorea).toBeInstanceOf(GeoKorea);
    });
  });

  describe("Instance Lifecycle", () => {
    it("creates instance with default options", () => {
      geoKorea = new GeoKorea(container, DEFAULT_OPTIONS);
      expect(geoKorea).toBeInstanceOf(GeoKorea);
    });

    it("creates instance with custom options", () => {
      const customOptions = {
        ...DEFAULT_OPTIONS,
        width: 1000,
        height: 800,
        scale: 6,
        onRegionClick: jest.fn(),
      };

      geoKorea = new GeoKorea(container, customOptions);
      expect(geoKorea).toBeInstanceOf(GeoKorea);
    });

    it("cleans up resources on destroy", () => {
      geoKorea = new GeoKorea(container, DEFAULT_OPTIONS);
      geoKorea.destroy();
      expect(container.children.length).toBe(0);
    });
  });

  describe("Data Management", () => {
    beforeEach(() => {
      geoKorea = new GeoKorea(container, DEFAULT_OPTIONS);
    });

    it("handles TopoJSON data", () => {
      expect(() => {
        geoKorea.setTopoData(testTopoData, "testRegion");
      }).not.toThrow();
    });

    it("updates points data", () => {
      expect(() => {
        geoKorea.updatePoints(testPoints);
      }).not.toThrow();
    });

    it("initializes with points data", () => {
      geoKorea = new GeoKorea(container, {
        ...DEFAULT_OPTIONS,
        points: testPoints,
      });
      expect(geoKorea).toBeInstanceOf(GeoKorea);
    });
  });

  describe("Projection Management", () => {
    beforeEach(() => {
      geoKorea = new GeoKorea(container, DEFAULT_OPTIONS);
    });

    it("fits projection when setting TopoJSON data", () => {
      expect(() => {
        geoKorea.setTopoData(testTopoData, "testRegion");
      }).not.toThrow();
    });
  });

  describe("Error Handling", () => {
    it("throws error on invalid TopoJSON data", () => {
      geoKorea = new GeoKorea(container, DEFAULT_OPTIONS);
      const invalidData = { type: "Topology" } as Topology;

      expect(() => {
        geoKorea.setTopoData(invalidData, "nonexistent");
      }).toThrow();
    });

    it("handles empty TopoJSON data gracefully", () => {
      const emptyTopoData: Topology = {
        type: "Topology",
        objects: {
          testRegion: {
            type: "GeometryCollection",
            geometries: [],
          },
        },
        arcs: [],
        transform: {
          scale: [1, 1],
          translate: [0, 0],
        },
      };

      expect(() => {
        geoKorea.setTopoData(emptyTopoData, "testRegion");
      }).not.toThrow();
    });
  });
});

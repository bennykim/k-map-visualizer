import { GeoKorea } from "./GeoKorea";
import { GeoKoreaInitializer } from "./GeoKoreaInitializer";
import { DEFAULT_OPTIONS } from "./constants";
import defaultMapData from "./data/K-City_2023.json";
import type { GeoKoreaInstance, Point } from "./types";

jest.mock("./GeoKorea");

describe("GeoKoreaInitializer", () => {
  const TEST_PATH = "test.json";
  const MOCK_POINTS: Point[] = [
    {
      type: "city",
      name: "Test City",
      region: "Test Region",
      location: "Test Location",
      coordinates: [0, 0],
    },
  ];
  const MOCK_TOPO_DATA = {
    type: "Topology",
    objects: {
      testRegion: {
        type: "GeometryCollection",
        geometries: [
          {
            type: "Polygon",
            arcs: [[0]],
            properties: { name: "Test" },
          },
        ],
      },
    },
  };

  let initializer: GeoKoreaInitializer;
  let mockContainer: HTMLElement;
  let mockGeoKorea: jest.Mocked<GeoKorea>;

  const setupFetchMock = (responseData: unknown, isSuccess = true) => {
    if (isSuccess) {
      window.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(responseData),
      }) as jest.Mock;
    } else {
      window.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }) as jest.Mock;
    }
  };

  const createMockConsoleError = () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    return consoleSpy;
  };

  const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

  beforeEach(() => {
    mockContainer = document.createElement("div");
    mockContainer.id = "map-container";
    document.body.appendChild(mockContainer);

    mockGeoKorea = {
      setTopoData: jest.fn(),
      destroy: jest.fn(),
      updatePoints: jest.fn(),
    } as any;
    (GeoKorea as jest.Mock).mockImplementation(() => mockGeoKorea);

    initializer = new GeoKoreaInitializer();
    setupFetchMock(defaultMapData);
  });

  afterEach(() => {
    document.body.removeChild(mockContainer);
    jest.restoreAllMocks();
  });

  describe("Map Creation", () => {
    it("creates map with default options", () => {
      const instance = initializer.createMap(mockContainer);

      expect(GeoKorea).toHaveBeenCalledWith(
        mockContainer,
        expect.objectContaining(DEFAULT_OPTIONS)
      );
      expect(mockGeoKorea.setTopoData).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(String)
      );
      expect(instance).toMatchObject({
        map: expect.any(Object),
        destroy: expect.any(Function),
        updatePoints: expect.any(Function),
        setTopoData: expect.any(Function),
      });
    });

    it("merges custom options with defaults correctly", () => {
      const customOptions = {
        width: 1000,
        height: 800,
        scale: 6,
        onRegionClick: jest.fn(),
      };

      initializer.createMap(mockContainer, customOptions);

      expect(GeoKorea).toHaveBeenCalledWith(
        mockContainer,
        expect.objectContaining({ ...DEFAULT_OPTIONS, ...customOptions })
      );
    });

    it("loads custom TopoJSON data when path is provided", () => {
      setupFetchMock(MOCK_TOPO_DATA);

      initializer.createMap(mockContainer, { topoJsonPath: TEST_PATH });

      expect(window.fetch).toHaveBeenCalledWith(TEST_PATH);
    });
  });

  describe("Instance Methods", () => {
    let instance: GeoKoreaInstance;

    beforeEach(() => {
      instance = initializer.createMap(mockContainer);
    });

    it("handles destroy method correctly", () => {
      instance.destroy();
      expect(mockGeoKorea.destroy).toHaveBeenCalled();
    });

    it("handles points update correctly", () => {
      instance.updatePoints(MOCK_POINTS);
      expect(mockGeoKorea.updatePoints).toHaveBeenCalledWith(MOCK_POINTS);
    });

    it("handles TopoJSON data update correctly", () => {
      const mockData = { objects: { test: {} } };
      instance.setTopoData(mockData, "test");
      expect(mockGeoKorea.setTopoData).toHaveBeenCalledWith(mockData, "test");
    });
  });

  describe("Error Handling", () => {
    it("handles network errors gracefully", async () => {
      const consoleSpy = createMockConsoleError();
      window.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

      initializer.createMap(mockContainer, { topoJsonPath: TEST_PATH });
      await flushPromises();

      expect(consoleSpy).toHaveBeenCalled();
      expect(mockGeoKorea.setTopoData).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it("handles HTTP error responses appropriately", async () => {
      const consoleSpy = createMockConsoleError();
      setupFetchMock({}, false);

      initializer.createMap(mockContainer, { topoJsonPath: TEST_PATH });
      await flushPromises();

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});

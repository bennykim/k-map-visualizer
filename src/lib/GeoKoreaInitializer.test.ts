import { GeoKorea } from "./GeoKorea";
import { GeoKoreaInitializer } from "./GeoKoreaInitializer";
import { DEFAULT_OPTIONS } from "./constants";
import defaultMapData from "./data/K-City_2023.json";

jest.mock("./GeoKorea");

describe("GeoKoreaInitializer", () => {
  const TEST_PATH = "test.json";

  let initializer: GeoKoreaInitializer;
  let mockContainer: HTMLElement;
  let mockGeoKorea: jest.Mocked<GeoKorea>;

  const setupFetchMock = (responseData: unknown) => {
    window.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(responseData),
    }) as jest.Mock;
  };

  beforeEach(() => {
    mockContainer = document.createElement("div");
    mockContainer.id = "map-container";
    document.body.appendChild(mockContainer);

    mockGeoKorea = { setTopoData: jest.fn(), destroy: jest.fn() } as any;
    (GeoKorea as jest.Mock).mockImplementation(() => mockGeoKorea);

    initializer = new GeoKoreaInitializer();
    setupFetchMock(defaultMapData);
  });

  afterEach(() => {
    document.body.removeChild(mockContainer);
    jest.restoreAllMocks();
  });

  describe("initializeMap", () => {
    it("should initialize map with default options", async () => {
      await initializer.initializeMap(mockContainer);

      expect(GeoKorea).toHaveBeenCalledWith(
        mockContainer,
        expect.objectContaining(DEFAULT_OPTIONS)
      );
      expect(mockGeoKorea.setTopoData).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(String)
      );
    });

    it("should properly merge custom options with defaults", async () => {
      const customOptions = {
        width: 1000,
        height: 800,
        scale: 6,
        onRegionClick: jest.fn(),
      };

      await initializer.initializeMap(mockContainer, customOptions);

      expect(GeoKorea).toHaveBeenCalledWith(
        mockContainer,
        expect.objectContaining({ ...DEFAULT_OPTIONS, ...customOptions })
      );
    });

    it("should validate TopoJSON data and use the first object key", async () => {
      const mockTopoData = {
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

      setupFetchMock(mockTopoData);

      await initializer.initializeMap(mockContainer, {
        topoJsonPath: TEST_PATH,
      });

      expect(mockGeoKorea.setTopoData).toHaveBeenCalledWith(
        mockTopoData,
        "testRegion"
      );
    });

    describe("error handling", () => {
      it("should throw error for invalid TopoJSON data structure", async () => {
        const invalidTopoData = { type: "Topology" };
        setupFetchMock(invalidTopoData);

        await expect(
          initializer.initializeMap(mockContainer, { topoJsonPath: TEST_PATH })
        ).rejects.toThrow("Invalid TopoJSON data: missing objects");

        expect(mockGeoKorea.destroy).toHaveBeenCalled();
      });

      it("should clean up resources on network error", async () => {
        window.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

        await expect(
          initializer.initializeMap(mockContainer, { topoJsonPath: TEST_PATH })
        ).rejects.toThrow();

        expect(mockGeoKorea.destroy).toHaveBeenCalled();
      });
    });
  });
});

require("@testing-library/jest-dom");

const mockSelection = {
  append: jest.fn().mockReturnThis(),
  attr: jest.fn().mockReturnThis(),
  style: jest.fn().mockReturnThis(),
  call: jest.fn().mockReturnThis(),
  on: jest.fn().mockReturnThis(),
  selectAll: jest.fn().mockReturnThis(),
  data: jest.fn().mockReturnThis(),
  join: jest.fn().mockReturnThis(),
  remove: jest.fn(),
  node: jest.fn(),
};

const projectionMock = jest.fn().mockReturnValue([0, 0]);
projectionMock.center = jest.fn().mockReturnThis();
projectionMock.scale = jest.fn().mockReturnThis();
projectionMock.translate = jest.fn().mockReturnThis();

const pathMock = jest.fn();
pathMock.bounds = jest.fn().mockReturnValue([
  [0, 0],
  [100, 100],
]);
pathMock.projection = jest.fn().mockReturnThis();

jest.mock("d3", () => ({
  select: jest.fn(() => mockSelection),
  geoPath: jest.fn(() => pathMock),
  geoMercator: jest.fn(() => projectionMock),
  zoom: jest.fn(() => ({
    scaleExtent: jest.fn().mockReturnThis(),
    on: jest.fn().mockReturnThis(),
    transform: jest.fn(),
  })),
  zoomIdentity: {
    translate: jest.fn().mockReturnThis(),
    scale: jest.fn().mockReturnThis(),
  },
}));

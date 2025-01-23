import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";

const libraryConfigs = [
  {
    input: "src/index.ts",
    output: {
      file: "dist/cjs/index.js",
      format: "cjs",
      sourcemap: true,
    },
    plugins: [resolve(), commonjs(), typescript(), json()],
    external: ["d3", "topojson-client"],
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/esm/index.js",
      format: "esm",
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        declaration: true,
        declarationDir: "dist/esm",
      }),
      json(),
    ],
    external: ["d3", "topojson-client"],
  },
];

const appConfig = [
  {
    input: "src/index.ts",
    output: {
      file: "public/bundle.js",
      format: "iife",
      name: "GeoKorea",
      globals: {
        d3: "d3",
        "topojson-client": "topojson",
      },
      sourcemap: true,
      extend: true,
    },
    plugins: [resolve({ browser: true }), commonjs(), typescript(), json()],
    external: ["d3", "topojson-client"],
  },
  {
    input: "public/main.js",
    output: {
      dir: "dist-app",
      format: "iife",
      sourcemap: true,
    },
    plugins: [
      resolve({ browser: true }),
      commonjs(),
      copy({
        targets: [
          { src: "public/index.html", dest: "dist-app" },
          { src: "public/assets/*", dest: "dist-app/assets" },
          { src: "public/main.css", dest: "dist-app" },
          { src: "public/K-City_2023.json", dest: "dist-app" },
          { src: "public/bundle.js", dest: "dist-app" },
          { src: "public/cityHalls.js", dest: "dist-app" },
          { src: "public/main.js", dest: "dist-app" },
        ],
        hook: "writeBundle",
      }),
    ],
  },
];

export default () => {
  return process.env.BUILD_TARGET === "app" ? appConfig : libraryConfigs;
};

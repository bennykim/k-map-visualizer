import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default [
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
      ,
      json(),
    ],
    external: ["d3", "topojson-client"],
  },
];

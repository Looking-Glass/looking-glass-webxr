import replace from "@rollup/plugin-replace"
import typescript from "@rollup/plugin-typescript"
import path, { resolve } from "path"
import { typescriptPaths } from "rollup-plugin-typescript-paths"
import license from "rollup-plugin-license"

import { defineConfig } from "vite"
const plugins = [
  typescriptPaths({
    preserveExtensions: true,
  }),
  typescript({
    sourceMap: false,
    declaration: true,
    outDir: "dist",
  }),
]

export default defineConfig(({ mode }) => {
  // if dev, we want to bundle the dependencies into the webXR library so it can be used in script tags.
  if (mode === "dev") {
    return {
      server: {
        port: 5173,
        https: false,
      },
      publicDir: "public",
      build: {
        minify: false,
        lib: {
          entry: resolve(__dirname, "src/LookingGlassWebXRPolyfill.ts"),
          name: "Looking Glass WebXR",
          // the proper extensions will be added
          fileName: "bundle/webxr",
        },
        emptyOutDir: false,
        rollupOptions: {
          output: {
            sourcemapExcludeSources: true,
            // Provide global variables to use in the UMD build
            // for externalized deps
          },
          // specically fix an issue when bundling the webxr-polyfill library
          plugins: [
            ...plugins,
            replace({
              "process.env.NODE_ENV": JSON.stringify("production"),
            }),
            license({
              thirdParty: {
                output: path.join(__dirname, "dist/bundle", "dependencies.txt"),
                includePrivate: true, // Default is false.
              },
            }),
          ],
        },
      },
    }
  }
  // if build, build the normal non-bundled version of the library. This is the version installed from npm
  else if (mode === "build") {
    return {
      publicDir: "public", // Ensure public directory is set
      build: {
        minify: true,
        lib: {
          entry: resolve(__dirname, "src/LookingGlassWebXRPolyfill.ts"),
          name: "Looking Glass WebXR",
          // the proper extensions will be added
          fileName: "webxr",
        },
        emptyOutDir: false,
        rollupOptions: {
          // make sure to externalize deps that shouldn't be bundled
          // into your library
          external: (id) => !id.startsWith(".") && !path.isAbsolute(id),
          output: {
            sourcemapExcludeSources: true,
            // Provide global variables to use in the UMD build
            // for externalized deps
            globals: {
              "@lookingglass/webxr-polyfill/src/WebXRPolyfill": "@lookingglass/webxr-polyfill/src/WebXRPolyfill",
              "@lookingglass/webxr-polyfill/src/api/index": "@lookingglass/webxr-polyfill/src/api/index",
              "@lookingglass/webxr-polyfill/src/api/XRSpace": "@lookingglass/webxr-polyfill/src/api/XRSpace",
              "@lookingglass/webxr-polyfill/src/api/XRSystem": "@lookingglass/webxr-polyfill/src/api/XRSystem",
              "@lookingglass/webxr-polyfill/src/devices/XRDevice": "@lookingglass/webxr-polyfill/src/devices/XRDevice",
              "@lookingglass/webxr-polyfill/src/api/XRWebGLLayer": "@lookingglass/webxr-polyfill/src/api/XRWebGLLayer",
              "gl-matrix": "glMatrix",
              "holoplay-core": "holoPlayCore",
              "holoplay-core/dist/holoplaycore.module.js": "holoPlayCore",
            },
          },
          plugins,
        },
      },
    };
  }
  // If no argument is passed, build the library normally, without bundling. Note, the mode argument should always be passed in, if this is called there's an error in the package.json
  else {
    console.log("you didn't pass a build argument in, please make sure the package.json file is configured properly");
  }
});

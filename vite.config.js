import { resolve } from 'path';
import path from 'path';
import { defineConfig } from 'vite';

const entry = resolve(__dirname, 'src/LookingGlassWebXRPolyfill.js');

export default defineConfig({
  resolve: {
    alias: {
      '@lookingglass/webxr': entry
    }
  },
  build: {
    minify: true,
    lib: {
      entry,
      name: 'Looking Glass WebXR',
      // the proper extensions will be added
      fileName: '@lookingglass/webxr'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: (id) => !id.startsWith('.') && !path.isAbsolute(id),
      output: {
        sourcemapExcludeSources: true,
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          '@lookingglass/webxr-polyfill/src/WebXRPolyfill': '@lookingglass/webxr-polyfill/src/WebXRPolyfill',
          '@lookingglass/webxr-polyfill/src/api/index': '@lookingglass/webxr-polyfill/src/api/index',
          '@lookingglass/webxr-polyfill/src/api/XRSpace': '@lookingglass/webxr-polyfill/src/api/XRSpace',
          '@lookingglass/webxr-polyfill/src/api/XRSystem': '@lookingglass/webxr-polyfill/src/api/XRSystem',
          '@lookingglass/webxr-polyfill/src/devices/XRDevice': '@lookingglass/webxr-polyfill/src/devices/XRDevice',
          '@lookingglass/webxr-polyfill/src/api/XRWebGLLayer': '@lookingglass/webxr-polyfill/src/api/XRWebGLLayer',
          'gl-matrix': 'glMatrix',
          'holoplay-core': 'holoPlayCore',
          'holoplay-core/dist/holoplaycore.module.js': 'holoPlayCore'
        }
      }
    }
  }
});
// vite.config.ts
import { defineConfig, loadEnv } from "file:///D:/share12/three-template-master/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/share12/three-template-master/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import vueJsx from "file:///D:/share12/three-template-master/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import svgLoader from "file:///D:/share12/three-template-master/node_modules/vite-svg-loader/index.js";
import UnoCSS from "file:///D:/share12/three-template-master/node_modules/unocss/dist/vite.mjs";
var __vite_injected_original_dirname = "D:\\share12\\three-template-master";
var resolve = path.resolve;
var isProduction = process.env.NODE_ENV === "production";
var timestamp = (/* @__PURE__ */ new Date()).getTime();
var prodRollupOptions = {
  output: {}
};
var vite_config_default = ({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());
  const isAppBuild = env.VITE_APP_BUILD === "true";
  return defineConfig({
    server: {
      proxy: {
        "/images": {
          target: "http://127.0.0.1:3031",
          //
          changeOrigin: true
        }
      },
      port: Number(process.env.VITE_PORT) || 3003,
      hmr: true
    },
    define: {
      "process.env": {}
      // 👈 避免浏览器端找不到 process
    },
    resolve: {
      alias: [
        {
          find: "@",
          replacement: path.resolve(__vite_injected_original_dirname, "src")
        },
        {
          find: "vuedraggable",
          replacement: false ? "vuedraggable/src/vuedraggable" : "vuedraggable"
        },
        {
          find: "@ER",
          replacement: resolve(__vite_injected_original_dirname, "src/packages")
        },
        {
          find: "@DESIGN",
          replacement: resolve(__vite_injected_original_dirname, "src/pageDesign")
        }
      ]
    },
    esbuild: {
      jsxFactory: "h",
      jsxFragment: "Fragment"
    },
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 2048,
      rollupOptions: mode === "production" ? prodRollupOptions : {},
      outDir: isAppBuild ? "dist_app" : "dist"
    },
    plugins: [
      // tailwindcss(),
      vue({
        // template: {
        //   transformAssetUrls: {
        //     img: ['src'],
        //     'a-avatar': ['src'],
        //     'stepin-view': ['logo-src', 'presetThemeList'],
        //     'a-card': ['cover'],
        //   },
        // },
      }),
      vueJsx(),
      UnoCSS(),
      //
      // Components({
      //   resolvers: [
      //     AntDesignVueResolver({
      //       importStyle: mode === 'development' ? false : 'less',
      //     }),
      //   ],
      // }),
      svgLoader()
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use 'sass:math';
          @use 'sass:map';
          @use '@ER/theme/base.scss' as *;
          `
        }
      }
    },
    // base: env.VITE_BASE_URL,
    base: isAppBuild ? "/app1/" : "/"
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxzaGFyZTEyXFxcXHRocmVlLXRlbXBsYXRlLW1hc3RlclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcc2hhcmUxMlxcXFx0aHJlZS10ZW1wbGF0ZS1tYXN0ZXJcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L3NoYXJlMTIvdGhyZWUtdGVtcGxhdGUtbWFzdGVyL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXG5pbXBvcnQgeyBBbnREZXNpZ25WdWVSZXNvbHZlciB9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycydcbmltcG9ydCB2dWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcbmltcG9ydCBzdmdMb2FkZXIgZnJvbSAndml0ZS1zdmctbG9hZGVyJ1xuLy8gaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ0B0YWlsd2luZGNzcy92aXRlJ1xuaW1wb3J0IFVub0NTUyBmcm9tICd1bm9jc3Mvdml0ZSdcbmNvbnN0IHJlc29sdmUgPSBwYXRoLnJlc29sdmVcbmNvbnN0IGlzUHJvZHVjdGlvbiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbidcblxuY29uc3QgdGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKClcbmNvbnN0IHByb2RSb2xsdXBPcHRpb25zID0ge1xuICBvdXRwdXQ6IHt9LFxufVxuLy8gdml0ZSBcdTkxNERcdTdGNkVcbmV4cG9ydCBkZWZhdWx0ICh7IGNvbW1hbmQsIG1vZGUgfSkgPT4ge1xuICAvLyBcdTgzQjdcdTUzRDZcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpKVxuICBjb25zdCBpc0FwcEJ1aWxkID0gZW52LlZJVEVfQVBQX0JVSUxEID09PSAndHJ1ZSdcbiAgcmV0dXJuIGRlZmluZUNvbmZpZyh7XG4gICAgc2VydmVyOiB7XG4gICAgICBwcm94eToge1xuICAgICAgICAnL2ltYWdlcyc6IHtcbiAgICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTI3LjAuMC4xOjMwMzEnLCAvL1xuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBwb3J0OiBOdW1iZXIocHJvY2Vzcy5lbnYuVklURV9QT1JUKSB8fCAzMDAzLFxuICAgICAgaG1yOiB0cnVlLFxuICAgIH0sXG4gICAgZGVmaW5lOiB7XG4gICAgICAncHJvY2Vzcy5lbnYnOiB7fSwgLy8gXHVEODNEXHVEQzQ4IFx1OTA3Rlx1NTE0RFx1NkQ0Rlx1ODlDOFx1NTY2OFx1N0FFRlx1NjI3RVx1NEUwRFx1NTIzMCBwcm9jZXNzXG4gICAgfSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczogW1xuICAgICAgICB7XG4gICAgICAgICAgZmluZDogJ0AnLFxuICAgICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyksXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBmaW5kOiAndnVlZHJhZ2dhYmxlJyxcbiAgICAgICAgICByZXBsYWNlbWVudDogZmFsc2UgPyAndnVlZHJhZ2dhYmxlL3NyYy92dWVkcmFnZ2FibGUnIDogJ3Z1ZWRyYWdnYWJsZScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBmaW5kOiAnQEVSJyxcbiAgICAgICAgICByZXBsYWNlbWVudDogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvcGFja2FnZXMnKSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGZpbmQ6ICdAREVTSUdOJyxcbiAgICAgICAgICByZXBsYWNlbWVudDogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvcGFnZURlc2lnbicpLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIGVzYnVpbGQ6IHtcbiAgICAgIGpzeEZhY3Rvcnk6ICdoJyxcbiAgICAgIGpzeEZyYWdtZW50OiAnRnJhZ21lbnQnLFxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIHNvdXJjZW1hcDogZmFsc2UsXG4gICAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDIwNDgsXG4gICAgICByb2xsdXBPcHRpb25zOiBtb2RlID09PSAncHJvZHVjdGlvbicgPyBwcm9kUm9sbHVwT3B0aW9ucyA6IHt9LFxuICAgICAgb3V0RGlyOiBpc0FwcEJ1aWxkID8gJ2Rpc3RfYXBwJyA6ICdkaXN0JyxcbiAgICB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIC8vIHRhaWx3aW5kY3NzKCksXG4gICAgICB2dWUoe1xuICAgICAgICAvLyB0ZW1wbGF0ZToge1xuICAgICAgICAvLyAgIHRyYW5zZm9ybUFzc2V0VXJsczoge1xuICAgICAgICAvLyAgICAgaW1nOiBbJ3NyYyddLFxuICAgICAgICAvLyAgICAgJ2EtYXZhdGFyJzogWydzcmMnXSxcbiAgICAgICAgLy8gICAgICdzdGVwaW4tdmlldyc6IFsnbG9nby1zcmMnLCAncHJlc2V0VGhlbWVMaXN0J10sXG4gICAgICAgIC8vICAgICAnYS1jYXJkJzogWydjb3ZlciddLFxuICAgICAgICAvLyAgIH0sXG4gICAgICAgIC8vIH0sXG4gICAgICB9KSxcbiAgICAgIHZ1ZUpzeCgpLFxuICAgICAgVW5vQ1NTKCksIC8vXG4gICAgICAvLyBDb21wb25lbnRzKHtcbiAgICAgIC8vICAgcmVzb2x2ZXJzOiBbXG4gICAgICAvLyAgICAgQW50RGVzaWduVnVlUmVzb2x2ZXIoe1xuICAgICAgLy8gICAgICAgaW1wb3J0U3R5bGU6IG1vZGUgPT09ICdkZXZlbG9wbWVudCcgPyBmYWxzZSA6ICdsZXNzJyxcbiAgICAgIC8vICAgICB9KSxcbiAgICAgIC8vICAgXSxcbiAgICAgIC8vIH0pLFxuICAgICAgc3ZnTG9hZGVyKCksXG4gICAgXSxcbiAgICBjc3M6IHtcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgICAgc2Nzczoge1xuICAgICAgICAgIGFkZGl0aW9uYWxEYXRhOiBgXG4gICAgICAgICAgQHVzZSAnc2FzczptYXRoJztcbiAgICAgICAgICBAdXNlICdzYXNzOm1hcCc7XG4gICAgICAgICAgQHVzZSAnQEVSL3RoZW1lL2Jhc2Uuc2NzcycgYXMgKjtcbiAgICAgICAgICBgLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIC8vIGJhc2U6IGVudi5WSVRFX0JBU0VfVVJMLFxuICAgIGJhc2U6IGlzQXBwQnVpbGQgPyAnL2FwcDEvJyA6ICcvJyxcbiAgfSlcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBd1IsU0FBUyxjQUFjLGVBQWU7QUFDOVQsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sVUFBVTtBQUdqQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxlQUFlO0FBRXRCLE9BQU8sWUFBWTtBQVJuQixJQUFNLG1DQUFtQztBQVN6QyxJQUFNLFVBQVUsS0FBSztBQUNyQixJQUFNLGVBQWUsUUFBUSxJQUFJLGFBQWE7QUFFOUMsSUFBTSxhQUFZLG9CQUFJLEtBQUssR0FBRSxRQUFRO0FBQ3JDLElBQU0sb0JBQW9CO0FBQUEsRUFDeEIsUUFBUSxDQUFDO0FBQ1g7QUFFQSxJQUFPLHNCQUFRLENBQUMsRUFBRSxTQUFTLEtBQUssTUFBTTtBQUVwQyxRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxDQUFDO0FBQ3ZDLFFBQU0sYUFBYSxJQUFJLG1CQUFtQjtBQUMxQyxTQUFPLGFBQWE7QUFBQSxJQUNsQixRQUFRO0FBQUEsTUFDTixPQUFPO0FBQUEsUUFDTCxXQUFXO0FBQUEsVUFDVCxRQUFRO0FBQUE7QUFBQSxVQUNSLGNBQWM7QUFBQSxRQUNoQjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLE1BQU0sT0FBTyxRQUFRLElBQUksU0FBUyxLQUFLO0FBQUEsTUFDdkMsS0FBSztBQUFBLElBQ1A7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLGVBQWUsQ0FBQztBQUFBO0FBQUEsSUFDbEI7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixhQUFhLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsUUFDNUM7QUFBQSxRQUNBO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixhQUFhLFFBQVEsa0NBQWtDO0FBQUEsUUFDekQ7QUFBQSxRQUNBO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixhQUFhLFFBQVEsa0NBQVcsY0FBYztBQUFBLFFBQ2hEO0FBQUEsUUFDQTtBQUFBLFVBQ0UsTUFBTTtBQUFBLFVBQ04sYUFBYSxRQUFRLGtDQUFXLGdCQUFnQjtBQUFBLFFBQ2xEO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLFlBQVk7QUFBQSxNQUNaLGFBQWE7QUFBQSxJQUNmO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxXQUFXO0FBQUEsTUFDWCx1QkFBdUI7QUFBQSxNQUN2QixlQUFlLFNBQVMsZUFBZSxvQkFBb0IsQ0FBQztBQUFBLE1BQzVELFFBQVEsYUFBYSxhQUFhO0FBQUEsSUFDcEM7QUFBQSxJQUNBLFNBQVM7QUFBQTtBQUFBLE1BRVAsSUFBSTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQVNKLENBQUM7QUFBQSxNQUNELE9BQU87QUFBQSxNQUNQLE9BQU87QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFRUCxVQUFVO0FBQUEsSUFDWjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0gscUJBQXFCO0FBQUEsUUFDbkIsTUFBTTtBQUFBLFVBQ0osZ0JBQWdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQUtsQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUVBLE1BQU0sYUFBYSxXQUFXO0FBQUEsRUFDaEMsQ0FBQztBQUNIOyIsCiAgIm5hbWVzIjogW10KfQo=

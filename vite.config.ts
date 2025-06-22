import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import vueJsx from '@vitejs/plugin-vue-jsx'
import svgLoader from 'vite-svg-loader'
// import tailwindcss from '@tailwindcss/vite'
import UnoCSS from 'unocss/vite'
const resolve = path.resolve
const isProduction = process.env.NODE_ENV === 'production'

const timestamp = new Date().getTime()
const prodRollupOptions = {
  output: {},
}
// vite 配置
export default ({ command, mode }) => {
  // 获取环境变量
  const env = loadEnv(mode, process.cwd())
  const isAppBuild = env.VITE_APP_BUILD === 'true'
  return defineConfig({
    server: {
      proxy: {
        '/images': {
          target: 'http://127.0.0.1:3031', //
          changeOrigin: true,
        },
      },
      port: Number(process.env.VITE_PORT) || 3003,
      hmr: true,
    },
    define: {
      'process.env': {}, // 👈 避免浏览器端找不到 process
    },
    resolve: {
      alias: [
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src'),
        },
        {
          find: 'vuedraggable',
          replacement: false ? 'vuedraggable/src/vuedraggable' : 'vuedraggable',
        },
        {
          find: '@ER',
          replacement: resolve(__dirname, 'src/packages'),
        },
        {
          find: '@DESIGN',
          replacement: resolve(__dirname, 'src/pageDesign'),
        },
      ],
    },
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
    },
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 2048,
      rollupOptions: mode === 'production' ? prodRollupOptions : {},
      outDir: isAppBuild ? 'dist_app' : 'dist',
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
      UnoCSS(), //
      // Components({
      //   resolvers: [
      //     AntDesignVueResolver({
      //       importStyle: mode === 'development' ? false : 'less',
      //     }),
      //   ],
      // }),
      svgLoader(),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use 'sass:math';
          @use 'sass:map';
          @use '@ER/theme/base.scss' as *;
          `,
        },
      },
    },
    // base: env.VITE_BASE_URL,
    base: isAppBuild ? '/app1/' : '/',
  })
}

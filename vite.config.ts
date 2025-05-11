import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import vueJsx from '@vitejs/plugin-vue-jsx'
import svgLoader from 'vite-svg-loader'
const resolve = path.resolve
const isProduction = process.env.NODE_ENV === 'production'

//认输
const timestamp = new Date().getTime()
const prodRollupOptions = {
  output: {
    chunkFileNames: (chunk) => {
      return 'assets/' + chunk.name + '.[hash]' + '.' + timestamp + '.js'
    },
    assetFileNames: (asset) => {
      const name = asset.name
      if (name && (name.endsWith('.css') || name.endsWith('.js'))) {
        const names = name.split('.')
        const extname = names.splice(names.length - 1, 1)[0]
        return `assets/${names.join('.')}.[hash].${timestamp}.${extname}`
      }
      return 'assets/' + asset.name
    },
  },
}
// vite 配置
export default ({ command, mode }) => {
  // 获取环境变量
  const env = loadEnv(mode, process.cwd())

  return defineConfig({
    server: {
      port: Number(process.env.VITE_PORT) || 3003,
      hmr: true,
    },
    define: {
      'process.env': {},
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
      sourcemap: true,
      chunkSizeWarningLimit: 2048,
      rollupOptions: mode === 'production' ? prodRollupOptions : {},
    },
    plugins: [
      vue({
        template: {
          transformAssetUrls: {
            img: ['src'],
            'a-avatar': ['src'],
            'stepin-view': ['logo-src', 'presetThemeList'],
            'a-card': ['cover'],
          },
        },
      }),
      vueJsx(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: mode === 'development' ? false : 'less',
          }),
        ],
      }),
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
    base: env.VITE_BASE_URL,
  })
}

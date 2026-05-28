import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const cesiumSource = 'node_modules/cesium/Build/Cesium';
const cesiumBaseUrl = 'cesiumStatic';
const vworldReferer = 'https://cesium-korean-service.vercel.app/';

export default defineConfig({
  define: {
    CESIUM_BASE_URL: JSON.stringify(`/${cesiumBaseUrl}`),
  },
  server: {
    proxy: {
      '/vworld': {
        target: 'https://api.vworld.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/vworld/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Referer', vworldReferer);
          });
        },
      },
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: `${cesiumSource}/ThirdParty`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Workers`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Assets`, dest: cesiumBaseUrl },
        { src: `${cesiumSource}/Widgets`, dest: cesiumBaseUrl },
      ],
    }),
  ],
});

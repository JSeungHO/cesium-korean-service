import {
  Credit,
  UrlTemplateImageryProvider,
  WebMercatorTilingScheme,
} from 'cesium';

export const VWORLD_LAYERS = {
  Base: { type: 'Base', format: 'png' },
  Satellite: { type: 'Satellite', format: 'jpeg' },
  Hybrid: { type: 'Hybrid', format: 'png' },
  gray: { type: 'gray', format: 'png' },
  midnight: { type: 'midnight', format: 'png' },
};

export function createVWorldImageryProvider(layerName = 'Base') {
  const apiKey = import.meta.env.VITE_VWORLD_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_VWORLD_API_KEY 환경 변수가 설정되지 않았습니다.');
  }

  const layer = VWORLD_LAYERS[layerName] ?? VWORLD_LAYERS.Base;

  return new UrlTemplateImageryProvider({
    url: `https://api.vworld.kr/req/wmts/1.0.0/${apiKey}/${layer.type}/{z}/{y}/{x}.${layer.format}`,
    tilingScheme: new WebMercatorTilingScheme(),
    maximumLevel: 19,
    credit: new Credit('© VWorld'),
  });
}

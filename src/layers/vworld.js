import {
  Credit,
  UrlTemplateImageryProvider,
  WebMercatorTilingScheme,
} from 'cesium';

export const VWORLD_LAYER_OPTIONS = [
  {
    id: 'Base',
    type: 'Base',
    format: 'png',
    label: '일반 지도',
    description: '도로·지명·건물',
    preview: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)',
  },
  {
    id: 'Satellite',
    type: 'Satellite',
    format: 'jpeg',
    label: '위성',
    description: '위성 영상',
    preview: 'linear-gradient(135deg, #1b4332 0%, #40916c 50%, #74c69d 100%)',
  },
  {
    id: 'Hybrid',
    type: 'Hybrid',
    format: 'png',
    label: '하이브리드',
    description: '위성 + 라벨',
    preview: 'linear-gradient(135deg, #264653 0%, #2a9d8f 50%, #e9c46a 100%)',
  },
  {
    id: 'gray',
    type: 'gray',
    format: 'png',
    label: '회색',
    description: '그레이스케일',
    preview: 'linear-gradient(135deg, #f5f5f5 0%, #bdbdbd 50%, #757575 100%)',
  },
  {
    id: 'midnight',
    type: 'midnight',
    format: 'png',
    label: '미드나잇',
    description: '다크 모드',
    preview: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
  },
];

export const VWORLD_LAYERS = Object.fromEntries(
  VWORLD_LAYER_OPTIONS.map((layer) => [layer.id, layer]),
);

function getVWorldApiKey() {
  const rawKey = import.meta.env.VITE_VWORLD_API_KEY;
  return rawKey?.replace(/^['"]|['"]$/g, '').trim();
}

export function createVWorldImageryProvider(layerName = 'Base') {
  const apiKey = getVWorldApiKey();
  if (!apiKey) {
    throw new Error('VITE_VWORLD_API_KEY 환경 변수가 설정되지 않았습니다.');
  }

  const layer = VWORLD_LAYERS[layerName] ?? VWORLD_LAYERS.Base;

  return new UrlTemplateImageryProvider({
    url: `https://api.vworld.kr/req/wmts/1.0.0/${apiKey}/${layer.type}/{z}/{reverseY}/{x}.${layer.format}`,
    tilingScheme: new WebMercatorTilingScheme(),
    maximumLevel: 19,
    credit: new Credit('© VWorld'),
    customTags: {
      reverseY(_imageryProvider, _x, y, level) {
        return (1 << level) - y - 1;
      },
    },
  });
}

import { EllipsoidTerrainProvider, Terrain } from 'cesium';
import { createVWorldImageryProvider } from './vworld.js';

export {
  createVWorldImageryProvider,
  isLocalDevelopment,
  verifyVWorldAccess,
  VWORLD_LAYER_OPTIONS,
} from './vworld.js';

export function switchVWorldBaseMap(viewer, layerName) {
  const imageryLayers = viewer.imageryLayers;
  const baseLayer = imageryLayers.get(0);

  if (baseLayer) {
    imageryLayers.remove(baseLayer, false);
  }

  imageryLayers.addImageryProvider(createVWorldImageryProvider(layerName), 0);
}

export async function setTerrainEnabled(viewer, enabled) {
  viewer.terrainProvider = enabled
    ? Terrain.fromWorldTerrain()
    : new EllipsoidTerrainProvider();
}

export const OVERLAY_LAYERS = [
  {
    id: 'terrain',
    label: '3D 지형',
    description: 'Cesium World Terrain',
    defaultEnabled: true,
    group: 'terrain',
  },
  {
    id: 'buildings',
    label: '건물 3D',
    description: 'OSM Buildings (준비 중)',
    defaultEnabled: false,
    disabled: true,
    group: 'data',
  },
  {
    id: 'cadastral',
    label: '지적도',
    description: 'VWorld WMS (준비 중)',
    defaultEnabled: false,
    disabled: true,
    group: 'data',
  },
];

export const OVERLAY_GROUPS = {
  terrain: { label: '지형' },
  data: { label: '공간 데이터' },
};

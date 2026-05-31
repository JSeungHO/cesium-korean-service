import {
  createWorldTerrainAsync,
  EllipsoidTerrainProvider,
} from 'cesium';
import { createVWorldImageryProvider } from './vworld.js';
import { setBuildingsEnabled, setCadastralEnabled } from './overlays.js';

export {
  createVWorldCadastralProvider,
  createVWorldImageryProvider,
  getVWorldDomain,
  isLocalDevelopment,
  verifyVWorldAccess,
  VWORLD_LAYER_OPTIONS,
} from './vworld.js';

export { setBuildingsEnabled, setCadastralEnabled } from './overlays.js';

export function switchVWorldBaseMap(viewer, layerName) {
  const imageryLayers = viewer.imageryLayers;
  const baseLayer = imageryLayers.get(0);

  if (baseLayer) {
    imageryLayers.remove(baseLayer, false);
  }

  imageryLayers.addImageryProvider(createVWorldImageryProvider(layerName), 0);
}

export async function setTerrainEnabled(viewer, enabled) {
  const globe = viewer.scene.globe;

  if (!enabled) {
    globe.depthTestAgainstTerrain = false;
    viewer.terrainProvider = new EllipsoidTerrainProvider();
    return;
  }

  const terrainProvider = await createWorldTerrainAsync();
  globe.depthTestAgainstTerrain = true;
  viewer.terrainProvider = terrainProvider;
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
    description: 'Cesium Ion OSM Buildings',
    defaultEnabled: false,
    group: 'data',
  },
  {
    id: 'cadastral',
    label: '지적도',
    description: 'VWorld WMS 연속지적도',
    defaultEnabled: false,
    group: 'data',
  },
];

export const OVERLAY_GROUPS = {
  terrain: { label: '지형' },
  data: { label: '공간 데이터' },
};

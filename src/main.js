import {
  Cartesian3,
  Ion,
  Math as CesiumMath,
  Terrain,
  Viewer,
} from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import {
  createVWorldImageryProvider,
  setTerrainEnabled,
} from './layers/layerManager.js';
import { createLayerPanel } from './ui/layerPanel.js';
import './style.css';

function showMapError(message) {
  const root = document.getElementById('ui-root');
  if (!root) {
    return;
  }

  const banner = document.createElement('div');
  banner.className = 'map-error-banner';
  banner.textContent = message;
  root.prepend(banner);
}

function init() {
  Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN?.replace(
    /^['"]|['"]$/g,
    '',
  ).trim();

  const viewer = new Viewer('cesiumContainer', {
    terrain: Terrain.fromWorldTerrain(),
    baseLayerPicker: false,
    animation: false,
    timeline: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    infoBox: false,
    selectionIndicator: false,
  });

  createLayerPanel(viewer, {
    initialBaseMap: 'Base',
    mount: document.getElementById('ui-root'),
  });

  viewer.imageryLayers.removeAll();

  try {
    viewer.imageryLayers.addImageryProvider(createVWorldImageryProvider('Base'));
  } catch (error) {
    showMapError(error.message ?? 'VWorld 지도를 불러오지 못했습니다.');
  }

  setTerrainEnabled(viewer, true);

  viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(127.0276, 37.4979, 500000),
    orientation: {
      heading: CesiumMath.toRadians(0),
      pitch: CesiumMath.toRadians(-45),
    },
  });
}

init();

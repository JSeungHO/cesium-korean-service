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
  isLocalDevelopment,
  setTerrainEnabled,
  verifyVWorldAccess,
} from './layers/layerManager.js';
import { createLayerPanel } from './ui/layerPanel.js';
import './style.css';

function showBanner(message, type = 'error') {
  const root = document.getElementById('ui-root');
  if (!root) {
    return;
  }

  const banner = document.createElement('div');
  banner.className = type === 'info'
    ? 'map-info-banner'
    : 'map-error-banner';
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

  if (isLocalDevelopment()) {
    showBanner(
      '로컬 개발 모드: VWorld 타일은 dev 프록시로 요청합니다. 지도가 비어 있으면 VWorld 인증키에 http://localhost:5173 을 등록하세요.',
      'info',
    );
  }

  viewer.imageryLayers.removeAll();

  try {
    const provider = createVWorldImageryProvider('Base');
    viewer.imageryLayers.addImageryProvider(provider);

    provider.errorEvent.addEventListener(() => {
      showBanner('VWorld 지도 타일을 불러오지 못했습니다. 인증키 도메인 설정을 확인하세요.');
    });
  } catch (error) {
    showBanner(error.message ?? 'VWorld 지도를 불러오지 못했습니다.');
  }

  setTerrainEnabled(viewer, true);

  viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(127.5, 36.2, 650000),
    orientation: {
      heading: CesiumMath.toRadians(0),
      pitch: CesiumMath.toRadians(-55),
      roll: 0,
    },
    duration: 0,
  });

  verifyVWorldAccess('Base').then((result) => {
    if (!result.ok) {
      showBanner(result.message);
    }
  });
}

init();

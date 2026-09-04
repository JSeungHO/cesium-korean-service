import {
  Cartesian3,
  ImageryLayer,
  Ion,
  Math as CesiumMath,
  Viewer,
} from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import {
  createVWorldImageryProvider,
  isLocalDevelopment,
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

async function init() {
  const ionToken = import.meta.env.VITE_CESIUM_ION_TOKEN?.replace(
    /^['"]|['"]$/g,
    '',
  ).trim();

  if (!ionToken) {
    showBanner('VITE_CESIUM_ION_TOKEN이 설정되지 않았습니다.');
  } else {
    Ion.defaultAccessToken = ionToken;
  }

  let baseProvider;
  try {
    baseProvider = createVWorldImageryProvider('Base');
  } catch (error) {
    showBanner(error.message ?? 'VWorld 지도를 불러오지 못했습니다.');
    return;
  }

  const viewer = new Viewer('cesiumContainer', {
    baseLayer: new ImageryLayer(baseProvider),
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
      '로컬 개발 모드: VWorld 타일은 dev 프록시로 요청합니다. 지도가 비어 있으면 VWorld 인증키에 현재 URL을 등록하세요.',
      'info',
    );
  }

  viewer.camera.setView({
    destination: Cartesian3.fromDegrees(127.5, 36.2, 120000),
    orientation: {
      heading: CesiumMath.toRadians(0),
      pitch: CesiumMath.toRadians(-45),
      roll: 0,
    },
  });

  const access = await verifyVWorldAccess('Base');
  if (!access.ok) {
    showBanner(access.message);
  }
}

init();

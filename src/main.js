import {
  Cartesian3,
  Ion,
  Math as CesiumMath,
  Terrain,
  Viewer,
} from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import './style.css';

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN;

const viewer = new Viewer('cesiumContainer', {
  terrain: Terrain.fromWorldTerrain(),
});

viewer.camera.flyTo({
  destination: Cartesian3.fromDegrees(127.0276, 37.4979, 500000),
  orientation: {
    heading: CesiumMath.toRadians(0),
    pitch: CesiumMath.toRadians(-45),
  },
});

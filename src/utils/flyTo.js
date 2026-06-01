import {
  Cartesian3,
  Math as CesiumMath,
} from 'cesium';

/**
 * @param {import('cesium').Viewer | null | undefined} viewer
 * @param {import('../locations/korea.js').LocationPreset} location
 * @param {{ duration?: number }} [options]
 */
export function flyToLocation(viewer, location, options = {}) {
  if (!viewer || viewer.isDestroyed?.()) {
    return;
  }

  const { duration = 1.4 } = options;

  viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(location.lon, location.lat, location.height),
    orientation: {
      heading: CesiumMath.toRadians(location.heading ?? 0),
      pitch: CesiumMath.toRadians(location.pitch ?? -45),
      roll: 0,
    },
    duration,
  });
}

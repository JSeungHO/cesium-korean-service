import {
  BoundingSphere,
  Cartesian3,
  HeadingPitchRange,
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

  // Look AT the coordinate: fly to a bounding sphere centred on the target so the
  // preset stays centred in view. Flying to a point directly above the target and
  // then pitching leaves the target off-screen. `height` is treated as the view
  // distance (range) to the target.
  const target = new BoundingSphere(
    Cartesian3.fromDegrees(location.lon, location.lat, 0),
    0,
  );

  viewer.camera.flyToBoundingSphere(target, {
    offset: new HeadingPitchRange(
      CesiumMath.toRadians(location.heading ?? 0),
      CesiumMath.toRadians(location.pitch ?? -45),
      location.height,
    ),
    duration,
  });
}

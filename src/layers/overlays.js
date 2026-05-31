import { createOsmBuildingsAsync } from 'cesium';
import { createVWorldCadastralProvider } from './vworld.js';

const overlayState = {
  buildingsTileset: null,
  cadastralLayer: null,
};

export async function setBuildingsEnabled(viewer, enabled) {
  if (enabled) {
    if (!overlayState.buildingsTileset) {
      overlayState.buildingsTileset = await createOsmBuildingsAsync();
      viewer.scene.primitives.add(overlayState.buildingsTileset);
    }

    overlayState.buildingsTileset.show = true;
    return;
  }

  if (overlayState.buildingsTileset) {
    overlayState.buildingsTileset.show = false;
  }
}

export function setCadastralEnabled(viewer, enabled) {
  if (enabled) {
    if (!overlayState.cadastralLayer) {
      overlayState.cadastralLayer = viewer.imageryLayers.addImageryProvider(
        createVWorldCadastralProvider(),
      );
    }

    overlayState.cadastralLayer.show = true;
    return;
  }

  if (overlayState.cadastralLayer) {
    overlayState.cadastralLayer.show = false;
  }
}

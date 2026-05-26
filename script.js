import { CESIUM_ACCESS_TOKEN } from './config.js';

Cesium.Ion.defaultAccessToken = CESIUM_ACCESS_TOKEN;

async function initCesium() {
    const terrainProvider = await Cesium.createWorldTerrainAsync();
    
    const viewer = new Cesium.Viewer('cesiumContainer', {
        terrainProvider: terrainProvider
    });
}

initCesium();
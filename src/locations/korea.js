/**
 * @typedef {Object} LocationPreset
 * @property {string} id
 * @property {string} label
 * @property {number} lon
 * @property {number} lat
 * @property {number} height Camera height in meters
 * @property {number} [heading=0] Degrees
 * @property {number} [pitch=-45] Degrees
 * @property {string} [description]
 */

/** @type {LocationPreset[]} */
export const LOCATION_PRESETS = [
  {
    id: 'korea',
    label: '한국 전역',
    lon: 127.5,
    lat: 36.2,
    height: 1_200_000,
    pitch: -45,
    description: '대한민국 개요',
  },
  {
    id: 'seoul',
    label: '서울',
    lon: 126.978,
    lat: 37.566,
    height: 25_000,
    pitch: -45,
  },
  {
    id: 'gangnam',
    label: '강남역',
    lon: 127.0267,
    lat: 37.4975,
    height: 650,
    pitch: -40,
    description: 'GeoHazard 홍수 시뮬레이션',
  },
  {
    id: 'busan',
    label: '부산',
    lon: 129.0756,
    lat: 35.1796,
    height: 28_000,
    pitch: -45,
  },
  {
    id: 'jeju',
    label: '제주',
    lon: 126.5312,
    lat: 33.4996,
    height: 45_000,
    pitch: -45,
  },
]

/** @param {string} id */
export function getLocationPreset(id) {
  return LOCATION_PRESETS.find((location) => location.id === id)
}

/** @param {LocationPreset} location */
export function isValidLocationPreset(location) {
  return (
    Boolean(location?.id)
    && Boolean(location?.label)
    && Number.isFinite(location.lon)
    && Number.isFinite(location.lat)
    && location.lon >= 124
    && location.lon <= 132
    && location.lat >= 33
    && location.lat <= 39
    && Number.isFinite(location.height)
    && location.height > 0
  )
}

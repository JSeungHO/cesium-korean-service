import { describe, expect, it } from 'vitest';
import {
  getLocationPreset,
  isValidLocationPreset,
  LOCATION_PRESETS,
} from './korea.js';

describe('korea location presets', () => {
  it('includes gangnam preset aligned with GeoHazard engine', () => {
    const gangnam = getLocationPreset('gangnam');
    expect(gangnam?.label).toBe('강남역');
    expect(gangnam?.lon).toBeCloseTo(127.0267, 4);
    expect(gangnam?.lat).toBeCloseTo(37.4975, 4);
  });

  it('validates all presets inside Korea bounds', () => {
    expect(LOCATION_PRESETS.length).toBeGreaterThanOrEqual(4);
    LOCATION_PRESETS.forEach((preset) => {
      expect(isValidLocationPreset(preset)).toBe(true);
    });
  });

  it('returns undefined for unknown id', () => {
    expect(getLocationPreset('unknown')).toBeUndefined();
  });
});

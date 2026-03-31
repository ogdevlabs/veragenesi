/**
 * Frontend utility tests – pure data structures and functions
 * No React rendering required.
 */

// scoring.js uses ES module syntax; the react-native jest preset + .babelrc
// (babel-preset-expo) transforms it correctly.
import { ARCHETYPES, TOOLS } from '../../src/utils/scoring';

describe('ARCHETYPES data structure', () => {
  it('contains exactly 8 archetypes', () => {
    expect(ARCHETYPES).toHaveLength(8);
  });

  it('each archetype has required fields', () => {
    ARCHETYPES.forEach((a) => {
      expect(a).toHaveProperty('id');
      expect(a).toHaveProperty('name');
      expect(a).toHaveProperty('short_name');
      expect(a).toHaveProperty('emoji');
      expect(a).toHaveProperty('description');
      expect(a).toHaveProperty('strengths');
      expect(a).toHaveProperty('growthAreas');
    });
  });

  it('each archetype id is unique', () => {
    const ids = ARCHETYPES.map((a) => a.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ARCHETYPES.length);
  });

  it('ids are sequential from 1 to 8', () => {
    const ids = ARCHETYPES.map((a) => a.id).sort((x, y) => x - y);
    expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('each archetype has at least 2 strengths', () => {
    ARCHETYPES.forEach((a) => {
      expect(a.strengths.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('each archetype has at least 1 growthArea', () => {
    ARCHETYPES.forEach((a) => {
      expect(a.growthAreas.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('short_name values are lowercase strings without spaces', () => {
    ARCHETYPES.forEach((a) => {
      expect(typeof a.short_name).toBe('string');
      expect(a.short_name).toBe(a.short_name.toLowerCase());
      expect(a.short_name).not.toContain(' ');
    });
  });

  it('includes "protector" and "innovator" archetypes', () => {
    const shorts = ARCHETYPES.map((a) => a.short_name);
    expect(shorts).toContain('protector');
    expect(shorts).toContain('innovator');
  });
});

describe('TOOLS data structure', () => {
  it('contains at least 5 tools', () => {
    expect(TOOLS.length).toBeGreaterThanOrEqual(5);
  });

  it('each tool has required fields', () => {
    TOOLS.forEach((t) => {
      expect(t).toHaveProperty('id');
      expect(t).toHaveProperty('name');
      expect(t).toHaveProperty('category');
      expect(t).toHaveProperty('emoji');
      expect(t).toHaveProperty('duration');
    });
  });

  it('each tool id is unique', () => {
    const ids = TOOLS.map((t) => t.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(TOOLS.length);
  });

  it('all tool durations are positive numbers', () => {
    TOOLS.forEach((t) => {
      expect(typeof t.duration).toBe('number');
      expect(t.duration).toBeGreaterThan(0);
    });
  });

  it('includes calm_breath tool', () => {
    const ids = TOOLS.map((t) => t.id);
    expect(ids).toContain('calm_breath');
  });

  it('includes crisis_protocol tool', () => {
    const ids = TOOLS.map((t) => t.id);
    expect(ids).toContain('crisis_protocol');
  });

  it('categories are non-empty strings', () => {
    TOOLS.forEach((t) => {
      expect(typeof t.category).toBe('string');
      expect(t.category.trim().length).toBeGreaterThan(0);
    });
  });
});

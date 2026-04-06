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

import { formatTime, getMoodColor, getMoodEmoji, isValidEmail, isValidPassword, getToolById, getArchetypeByName } from '../../src/utils/scoring';

describe('formatTime', () => {
  it('formats 0 seconds as "0:00"', () => {
    expect(formatTime(0)).toBe('0:00');
  });

  it('formats 60 seconds as "1:00"', () => {
    expect(formatTime(60)).toBe('1:00');
  });

  it('formats 90 seconds as "1:30"', () => {
    expect(formatTime(90)).toBe('1:30');
  });

  it('pads single-digit seconds', () => {
    expect(formatTime(65)).toBe('1:05');
  });

  it('formats 3600 seconds as "60:00"', () => {
    expect(formatTime(3600)).toBe('60:00');
  });
});

describe('getMoodColor', () => {
  it('returns high color for score >= 70', () => {
    const result = getMoodColor(75);
    expect(result.key).toBe('high');
    expect(result.label).toBe('ALTA');
  });

  it('returns moderate color for score between 40 and 69', () => {
    const result = getMoodColor(55);
    expect(result.key).toBe('moderate');
    expect(result.label).toBe('MODERADA');
  });

  it('returns low color for score < 40', () => {
    const result = getMoodColor(30);
    expect(result.key).toBe('low');
    expect(result.label).toBe('BAJA');
  });

  it('returns high at exact boundary 70', () => {
    expect(getMoodColor(70).key).toBe('high');
  });

  it('returns moderate at exact boundary 40', () => {
    expect(getMoodColor(40).key).toBe('moderate');
  });
});

describe('getMoodEmoji', () => {
  it('returns 😄 for score >= 8', () => {
    expect(getMoodEmoji(9)).toBe('😄');
  });

  it('returns 🙂 for score between 6 and 7', () => {
    expect(getMoodEmoji(7)).toBe('🙂');
  });

  it('returns 😐 for score between 4 and 5', () => {
    expect(getMoodEmoji(5)).toBe('😐');
  });

  it('returns 😒 for score between 2 and 3', () => {
    expect(getMoodEmoji(3)).toBe('😒');
  });

  it('returns 😔 for score < 2', () => {
    expect(getMoodEmoji(1)).toBe('😔');
  });
});

describe('isValidEmail', () => {
  it('returns true for a valid email', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('u+tag@domain.co')).toBe(true);
  });

  it('returns false when @ is missing', () => {
    expect(isValidEmail('notanemail')).toBe(false);
  });

  it('returns false when domain is missing', () => {
    expect(isValidEmail('test@')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });
});

describe('isValidPassword', () => {
  it('returns true for password with 6+ characters', () => {
    expect(isValidPassword('abcdef')).toBe(true);
    expect(isValidPassword('long_password_123')).toBe(true);
  });

  it('returns false for password shorter than 6 characters', () => {
    expect(isValidPassword('abc')).toBeFalsy();
    expect(isValidPassword('')).toBeFalsy();
  });

  it('returns false for null or undefined', () => {
    expect(isValidPassword(null)).toBeFalsy();
    expect(isValidPassword(undefined)).toBeFalsy();
  });
});

describe('getToolById', () => {
  it('returns the correct tool for a known id', () => {
    const tool = getToolById('calm_breath');
    expect(tool).toBeDefined();
    expect(tool.id).toBe('calm_breath');
  });

  it('returns undefined for an unknown id', () => {
    expect(getToolById('unknown_tool')).toBeUndefined();
  });
});

describe('getArchetypeByName', () => {
  it('returns archetype by Spanish name', () => {
    const a = getArchetypeByName('El Protector');
    expect(a).toBeDefined();
    expect(a.short_name).toBe('protector');
  });

  it('returns undefined when name does not match', () => {
    expect(getArchetypeByName('Unknown Name')).toBeUndefined();
  });
});

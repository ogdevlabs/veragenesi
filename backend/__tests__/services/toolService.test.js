const mockQuery = jest.fn();
jest.mock('../../src/config/database', () => ({ query: mockQuery }));

const ToolService = require('../../src/services/toolService');

describe('ToolService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── getToolsList ─────────────────────────────────────────────────────────

  describe('getToolsList', () => {
    it('returns an array', () => {
      expect(Array.isArray(ToolService.getToolsList())).toBe(true);
    });

    it('contains all 5 tools', () => {
      expect(ToolService.getToolsList()).toHaveLength(5);
    });

    it('each tool has id, name, and category', () => {
      ToolService.getToolsList().forEach((tool) => {
        expect(tool).toHaveProperty('id');
        expect(tool).toHaveProperty('name');
        expect(tool).toHaveProperty('category');
      });
    });

    it('includes calm_breath tool', () => {
      const ids = ToolService.getToolsList().map((t) => t.id);
      expect(ids).toContain('calm_breath');
    });

    it('includes crisis_protocol tool', () => {
      const ids = ToolService.getToolsList().map((t) => t.id);
      expect(ids).toContain('crisis_protocol');
    });
  });

  // ─── getEmergencyResources ────────────────────────────────────────────────

  describe('getEmergencyResources', () => {
    it('returns an object with resources array', () => {
      const result = ToolService.getEmergencyResources();
      expect(result).toHaveProperty('resources');
      expect(Array.isArray(result.resources)).toBe(true);
    });

    it('each resource has country, name, and a contact (number or url)', () => {
      const { resources } = ToolService.getEmergencyResources();
      expect(resources.length).toBeGreaterThan(0);
      resources.forEach((r) => {
        expect(r).toHaveProperty('country');
        expect(r).toHaveProperty('name');
        const hasContact = 'number' in r || 'url' in r;
        expect(hasContact).toBe(true);
      });
    });
  });

  // ─── recordToolUsage – validation ────────────────────────────────────────

  describe('recordToolUsage – input validation', () => {
    it('throws for an invalid tool ID', async () => {
      await expect(
        ToolService.recordToolUsage(1, 'nonexistent_tool', 60, 5, 7, null)
      ).rejects.toThrow('Invalid tool ID');
    });

    it('throws when beforeMood is below 0', async () => {
      await expect(
        ToolService.recordToolUsage(1, 'calm_breath', 60, -1, 5, null)
      ).rejects.toThrow('Mood values must be between 0 and 10');
    });

    it('throws when afterMood is above 10', async () => {
      await expect(
        ToolService.recordToolUsage(1, 'calm_breath', 60, 5, 11, null)
      ).rejects.toThrow('Mood values must be between 0 and 10');
    });

    it('accepts boundary mood values 0 and 10', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 1, created_at: new Date() }],
      });

      const result = await ToolService.recordToolUsage(1, 'calm_breath', 120, 0, 10, null);
      expect(result.moodDelta).toBe(10);
    });
  });

  // ─── recordToolUsage – success path ──────────────────────────────────────

  describe('recordToolUsage – success', () => {
    it('stores a session and returns correct moodDelta', async () => {
      const now = new Date();
      mockQuery.mockResolvedValueOnce({ rows: [{ id: 42, created_at: now }] });

      const result = await ToolService.recordToolUsage(1, 'ground_yourself', 180, 4, 7, 'Felt calmer');

      expect(result.id).toBe(42);
      expect(result.toolId).toBe('ground_yourself');
      expect(result.moodDelta).toBe(3); // afterMood - beforeMood
      expect(result.durationSeconds).toBe(180);
      expect(result.createdAt).toBe(now);
    });

    it('passes null note to DB when note is omitted', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ id: 99, created_at: new Date() }] });

      await ToolService.recordToolUsage(1, 'quick_write', 300, 3, 6, undefined);

      const callArgs = mockQuery.mock.calls[0][1];
      expect(callArgs[6]).toBeNull(); // note position in the VALUES array
    });
  });
});

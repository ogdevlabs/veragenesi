const pool = require('../config/database');

const TOOLS = {
  calm_breath: { id: 'calm_breath', name: 'Calm Breath', category: 'stress' },
  ground_yourself: { id: 'ground_yourself', name: 'Ground Yourself', category: 'anxiety' },
  quick_write: { id: 'quick_write', name: 'Quick Write', category: 'sadness' },
  crisis_protocol: { id: 'crisis_protocol', name: 'Crisis Protocol', category: 'crisis' },
  pause_reflect: { id: 'pause_reflect', name: 'Pause + Reflect', category: 'general' },
};

class ToolService {
  // Record tool usage
  static async recordToolUsage(userId, toolId, durationSeconds, beforeMood, afterMood, note) {
    try {
      if (!TOOLS[toolId]) {
        throw new Error('Invalid tool ID');
      }

      if (beforeMood < 0 || beforeMood > 10 || afterMood < 0 || afterMood > 10) {
        throw new Error('Mood values must be between 0 and 10');
      }

      const moodDelta = afterMood - beforeMood;

      const result = await pool.query(
        'INSERT INTO tool_usage (user_id, tool_id, duration_seconds, before_mood, after_mood, mood_delta, note) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, created_at',
        [userId, toolId, durationSeconds, beforeMood, afterMood, moodDelta, note || null]
      );

      return {
        id: result.rows[0].id,
        toolId,
        durationSeconds,
        beforeMood,
        afterMood,
        moodDelta,
        createdAt: result.rows[0].created_at,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get user tool usage stats
  static async getUserToolStats(userId) {
    try {
      const totalResult = await pool.query(
        'SELECT COUNT(*) as count FROM tool_usage WHERE user_id = $1',
        [userId]
      );

      const toolBreakdownResult = await pool.query(
        'SELECT tool_id, COUNT(*) as count, AVG(mood_delta) as avg_mood_delta FROM tool_usage WHERE user_id = $1 GROUP BY tool_id',
        [userId]
      );

      const moodStatsResult = await pool.query(
        'SELECT AVG(mood_delta) as avg_mood_delta FROM tool_usage WHERE user_id = $1',
        [userId]
      );

      return {
        totalToolUses: parseInt(totalResult.rows[0].count),
        toolBreakdown: toolBreakdownResult.rows.map((row) => ({
          toolId: row.tool_id,
          uses: parseInt(row.count),
          avgMoodDelta: parseFloat(row.avg_mood_delta || 0).toFixed(2),
        })),
        overallAvgMoodDelta: parseFloat(moodStatsResult.rows[0].avg_mood_delta || 0).toFixed(2),
      };
    } catch (error) {
      throw error;
    }
  }

  // Get tool usage history
  static async getToolUsageHistory(userId, limit = 20, offset = 0) {
    try {
      const result = await pool.query(
        'SELECT * FROM tool_usage WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
        [userId, limit, offset]
      );

      return result.rows.map((row) => ({
        id: row.id,
        toolId: row.tool_id,
        durationSeconds: row.duration_seconds,
        beforeMood: row.before_mood,
        afterMood: row.after_mood,
        moodDelta: row.mood_delta,
        note: row.note,
        createdAt: row.created_at,
      }));
    } catch (error) {
      throw error;
    }
  }

  // Get tools list
  static getToolsList() {
    return Object.values(TOOLS);
  }

  // Get emergency resources
  static getEmergencyResources() {
    return {
      resources: [
        {
          country: 'Mexico',
          name: 'Línea de la Vida',
          number: '800-911-2000',
          description: 'Crisis support available 24/7',
          type: 'phone',
        },
        {
          country: 'Mexico',
          name: 'LOCATEL',
          number: '5658-1111',
          description: 'Lost persons and crisis support',
          type: 'phone',
        },
        {
          country: 'International',
          name: 'Befrienders International',
          url: 'https://www.befrienders.org',
          description: 'Network of crisis support organizations',
          type: 'web',
        },
        {
          country: 'International',
          name: 'Crisis Text Line',
          url: 'https://www.crisistextline.org',
          description: 'Text HOME to 741741',
          type: 'web',
        },
      ],
      disclaimer: 'If you are in immediate danger, please call emergency services (911 in Mexico).',
    };
  }
}

module.exports = ToolService;

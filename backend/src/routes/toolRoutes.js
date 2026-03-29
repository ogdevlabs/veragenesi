const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const ToolService = require('../services/toolService');

// POST /tools/usage (record tool usage)
router.post('/usage', authMiddleware, async (req, res, next) => {
  try {
    const { toolId, durationSeconds, beforeMood, afterMood, note } = req.body;
    const userId = req.userId;

    if (!toolId) {
      return res.status(400).json({ error: 'Tool ID is required' });
    }

    const result = await ToolService.recordToolUsage(
      userId,
      toolId,
      durationSeconds,
      beforeMood,
      afterMood,
      note
    );

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// GET /tools/list (get available tools)
router.get('/list', (req, res) => {
  try {
    const tools = ToolService.getToolsList();
    res.json({ tools });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tools' });
  }
});

// GET /tools/stats (get user tool usage stats)
router.get('/stats', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.userId;
    const stats = await ToolService.getUserToolStats(userId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

// GET /tools/history (get user tool usage history)
router.get('/history', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const history = await ToolService.getToolUsageHistory(userId, limit, offset);
    res.json({ history });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

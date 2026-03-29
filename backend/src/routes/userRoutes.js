const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const AuthService = require('../services/authService');
const ToolService = require('../services/toolService');

// GET /user/profile (get user profile with assessments)
router.get('/profile', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await AuthService.getUserById(userId);
    const toolStats = await ToolService.getUserToolStats(userId);

    res.json({
      user,
      toolStats,
    });
  } catch (error) {
    next(error);
  }
});

// GET /resources/emergency (get emergency resources)
router.get('/emergency', (req, res) => {
  try {
    const resources = ToolService.getEmergencyResources();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve resources' });
  }
});

module.exports = router;

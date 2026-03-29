const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const AssessmentService = require('../services/assessmentService');
const AuthService = require('../services/authService');

// POST /assessments/archetype
router.post('/archetype', authMiddleware, async (req, res, next) => {
  try {
    const { answers } = req.body;
    const userId = req.userId;

    if (!answers || answers.length !== 7) {
      return res.status(400).json({ error: 'Archetype assessment requires exactly 7 answers' });
    }

    // Score the assessment
    const results = AssessmentService.scoreArchetypeQuiz(answers);

    // Store in database
    await AssessmentService.storeArchetypeAssessment(userId, answers, results);

    // Update user's primary and secondary archetypes
    await AuthService.updateArchetype(userId, results.primary, results.secondary);

    res.json({
      primary: results.primary,
      secondary: results.secondary,
    });
  } catch (error) {
    next(error);
  }
});

// POST /assessments/ei-baseline
router.post('/ei-baseline', authMiddleware, async (req, res, next) => {
  try {
    const { answers } = req.body;
    const userId = req.userId;

    if (!answers || answers.length !== 16) {
      return res.status(400).json({ error: 'EI assessment requires exactly 16 answers' });
    }

    // Score the assessment
    const results = AssessmentService.scoreEIBaseline(answers);

    // Store in database
    await AssessmentService.storeEIAssessment(userId, answers, results);

    res.json(results);
  } catch (error) {
    next(error);
  }
});

// GET /assessments/:type (get latest assessment by type)
router.get('/:type', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.userId;
    const { type } = req.params;

    const validTypes = ['archetype', 'ei-baseline'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid assessment type' });
    }

    const assessment = await AssessmentService.getLatestAssessment(userId, type);

    if (!assessment) {
      return res.status(404).json({ error: 'No assessment found' });
    }

    res.json({
      type: assessment.assessment_type,
      results: assessment.results,
      createdAt: assessment.created_at,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

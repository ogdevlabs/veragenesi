const AssessmentService = require('../../src/services/assessmentService');

// Mock the database pool – pure functions don't use it, but the module requires it
jest.mock('../../src/config/database', () => ({
  query: jest.fn(),
}));

describe('AssessmentService – pure scoring functions', () => {
  // ─── normalizeScore ──────────────────────────────────────────────────────────

  describe('normalizeScore', () => {
    it('returns 0 for minimum raw score (8)', () => {
      expect(AssessmentService.normalizeScore(8)).toBe(0);
    });

    it('returns 100 for maximum raw score (40)', () => {
      expect(AssessmentService.normalizeScore(40)).toBe(100);
    });

    it('returns ~50 for midpoint raw score (24)', () => {
      expect(AssessmentService.normalizeScore(24)).toBe(50);
    });

    it('clamps to 0 if rawScore is below minimum', () => {
      expect(AssessmentService.normalizeScore(0)).toBe(0);
    });

    it('clamps to 100 if rawScore exceeds maximum', () => {
      expect(AssessmentService.normalizeScore(99)).toBe(100);
    });
  });

  // ─── getArchetypeIndicesForQuestion ─────────────────────────────────────────

  describe('getArchetypeIndicesForQuestion', () => {
    it('returns expected indices for question 0', () => {
      expect(AssessmentService.getArchetypeIndicesForQuestion(0, 3)).toEqual([0, 1, 2]);
    });

    it('returns expected indices for question 1', () => {
      expect(AssessmentService.getArchetypeIndicesForQuestion(1, 5)).toEqual([3, 4]);
    });

    it('returns expected indices for question 6', () => {
      expect(AssessmentService.getArchetypeIndicesForQuestion(6, 2)).toEqual([5, 6, 7]);
    });

    it('returns fallback [0] for unknown question index', () => {
      expect(AssessmentService.getArchetypeIndicesForQuestion(99, 1)).toEqual([0]);
    });
  });

  // ─── scoreArchetypeQuiz ──────────────────────────────────────────────────────

  describe('scoreArchetypeQuiz', () => {
    const allMaxAnswers = [5, 5, 5, 5, 5, 5, 5]; // 7 answers max

    it('returns an object with primary and secondary properties', () => {
      const result = AssessmentService.scoreArchetypeQuiz(allMaxAnswers);
      expect(result).toHaveProperty('primary');
      expect(result).toHaveProperty('secondary');
    });

    it('primary archetype has id, name, short_name, score', () => {
      const result = AssessmentService.scoreArchetypeQuiz(allMaxAnswers);
      expect(result.primary).toHaveProperty('id');
      expect(result.primary).toHaveProperty('name');
      expect(result.primary).toHaveProperty('short_name');
      expect(result.primary).toHaveProperty('score');
    });

    it('secondary is an array of exactly 2 archetypes', () => {
      const result = AssessmentService.scoreArchetypeQuiz(allMaxAnswers);
      expect(Array.isArray(result.secondary)).toBe(true);
      expect(result.secondary).toHaveLength(2);
    });

    it('primary archetype has the highest score', () => {
      const answers = [1, 5, 5, 1, 1, 1, 1];
      const result = AssessmentService.scoreArchetypeQuiz(answers);
      expect(result.primary.score).toBeGreaterThanOrEqual(result.secondary[0].score);
      expect(result.secondary[0].score).toBeGreaterThanOrEqual(result.secondary[1].score);
    });

    it('works with minimum values (all 1s)', () => {
      const minAnswers = [1, 1, 1, 1, 1, 1, 1];
      const result = AssessmentService.scoreArchetypeQuiz(minAnswers);
      expect(result.primary).toBeDefined();
    });

    it('works with mixed answer values', () => {
      const mixedAnswers = [3, 1, 4, 1, 5, 2, 3];
      const result = AssessmentService.scoreArchetypeQuiz(mixedAnswers);
      expect(result.primary.score).toBeGreaterThan(0);
    });
  });

  // ─── scoreEIBaseline ─────────────────────────────────────────────────────────

  describe('scoreEIBaseline', () => {
    const allFiveAnswers = Array(16).fill(5); // max: raw=40 each half
    const allOneAnswers = Array(16).fill(1);  // min: raw=8 each half

    it('throws if not exactly 16 answers', () => {
      expect(() => AssessmentService.scoreEIBaseline([1, 2, 3])).toThrow(
        'EI assessment requires exactly 16 answers'
      );
    });

    it('returns autoconciencia and autogestional scores', () => {
      const result = AssessmentService.scoreEIBaseline(allFiveAnswers);
      expect(result).toHaveProperty('autoconciencia');
      expect(result).toHaveProperty('autogestional');
    });

    it('returns 100 for all max answers', () => {
      const result = AssessmentService.scoreEIBaseline(allFiveAnswers);
      expect(result.autoconciencia).toBe(100);
      expect(result.autogestional).toBe(100);
    });

    it('returns 0 for all min answers', () => {
      const result = AssessmentService.scoreEIBaseline(allOneAnswers);
      expect(result.autoconciencia).toBe(0);
      expect(result.autogestional).toBe(0);
    });

    it('includes raw scores', () => {
      const result = AssessmentService.scoreEIBaseline(allFiveAnswers);
      expect(result.raw).toHaveProperty('autoconciencia', 40);
      expect(result.raw).toHaveProperty('autogestional', 40);
    });

    it('includes interpretation object', () => {
      const result = AssessmentService.scoreEIBaseline(allFiveAnswers);
      expect(result).toHaveProperty('interpretation');
      expect(result.interpretation).toHaveProperty('autoconciencia');
      expect(result.interpretation).toHaveProperty('autogestional');
    });

    it('correctly splits first 8 and last 8 answers', () => {
      // first 8 = max (5), last 8 = min (1)
      const mixed = [...Array(8).fill(5), ...Array(8).fill(1)];
      const result = AssessmentService.scoreEIBaseline(mixed);
      expect(result.autoconciencia).toBe(100);
      expect(result.autogestional).toBe(0);
    });
  });

  // ─── getEIInterpretation ─────────────────────────────────────────────────────

  describe('getEIInterpretation', () => {
    it('returns ALTA level for scores >= 70', () => {
      const result = AssessmentService.getEIInterpretation(80, 90);
      expect(result.autoconciencia.level).toBe('ALTA');
      expect(result.autogestional.level).toBe('ALTA');
    });

    it('returns MODERADA level for scores between 40 and 69', () => {
      const result = AssessmentService.getEIInterpretation(55, 45);
      expect(result.autoconciencia.level).toBe('MODERADA');
      expect(result.autogestional.level).toBe('MODERADA');
    });

    it('returns BAJA level for scores < 40', () => {
      const result = AssessmentService.getEIInterpretation(20, 10);
      expect(result.autoconciencia.level).toBe('BAJA');
      expect(result.autogestional.level).toBe('BAJA');
    });

    it('handles mixed levels', () => {
      const result = AssessmentService.getEIInterpretation(75, 30);
      expect(result.autoconciencia.level).toBe('ALTA');
      expect(result.autogestional.level).toBe('BAJA');
    });

    it('each dimension has score, level, levelKey, interpretation', () => {
      const result = AssessmentService.getEIInterpretation(70, 70);
      ['autoconciencia', 'autogestional'].forEach((key) => {
        expect(result[key]).toHaveProperty('score');
        expect(result[key]).toHaveProperty('level');
        expect(result[key]).toHaveProperty('levelKey');
        expect(result[key]).toHaveProperty('interpretation');
        expect(typeof result[key].interpretation).toBe('string');
        expect(result[key].interpretation.length).toBeGreaterThan(0);
      });
    });

    it('boundary 70 is ALTA', () => {
      const result = AssessmentService.getEIInterpretation(70, 70);
      expect(result.autoconciencia.level).toBe('ALTA');
    });

    it('boundary 40 is MODERADA', () => {
      const result = AssessmentService.getEIInterpretation(40, 40);
      expect(result.autoconciencia.level).toBe('MODERADA');
    });
  });
});

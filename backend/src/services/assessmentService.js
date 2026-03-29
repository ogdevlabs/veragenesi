const pool = require('../config/database');

const ARCHETYPES = [
  { id: 1, name: 'Héroe', short_name: 'hero' },
  { id: 2, name: 'Sabio', short_name: 'sage' },
  { id: 3, name: 'Amante', short_name: 'lover' },
  { id: 4, name: 'Sombra', short_name: 'shadow' },
  { id: 5, name: 'Cuidador', short_name: 'caregiver' },
  { id: 6, name: 'Jungla', short_name: 'explorer' },
  { id: 7, name: 'Mago', short_name: 'magician' },
  { id: 8, name: 'Inocente', short_name: 'innocent' },
];

class AssessmentService {
  // Score archetype quiz (7 questions)
  static scoreArchetypeQuiz(answers) {
    // Each answer (1-5) maps to archetypes
    // This is a simplified scoring - in production, expand with more sophisticated mapping
    const scores = ARCHETYPES.map((archetype) => ({
      ...archetype,
      score: 0,
    }));

    // Simple distribution: each answer contributes to 1-2 archetypes
    answers.forEach((answer, index) => {
      const archetypeIndices = this.getArchetypeIndicesForQuestion(index, answer);
      archetypeIndices.forEach((idx) => {
        scores[idx].score += answer;
      });
    });

    // Sort by score descending and return top 3
    const sorted = scores.sort((a, b) => b.score - a.score);
    return {
      primary: sorted[0],
      secondary: sorted.slice(1, 3),
    };
  }

  // Map question index and answer to archetype indices
  static getArchetypeIndicesForQuestion(questionIndex, answer) {
    // Simple mapping - customize based on assessment design
    const mapping = {
      0: [0, 2], // Question 0 -> Héroe, Amante
      1: [1, 4], // Question 1 -> Sabio, Cuidador
      2: [3, 5], // Question 2 -> Sombra, Jungla
      3: [6, 7], // Question 3 -> Mago, Inocente
      4: [0, 1], // Question 4 -> Héroe, Sabio
      5: [2, 3], // Question 5 -> Amante, Sombra
      6: [4, 5], // Question 6 -> Cuidador, Jungla
    };
    return mapping[questionIndex] || [0];
  }

  // Score EI baseline assessment (16 questions)
  static scoreEIBaseline(answers) {
    if (answers.length !== 16) {
      throw new Error('EI assessment requires exactly 16 answers');
    }

    // Split into two competencies (8 questions each)
    const autoconcienciaRaw = answers.slice(0, 8).reduce((a, b) => a + b, 0);
    const autogestionalRaw = answers.slice(8, 16).reduce((a, b) => a + b, 0);

    // Normalize from raw (8-40) to 0-100
    const autoconciencia = this.normalizeScore(autoconcienciaRaw);
    const autogestional = this.normalizeScore(autogestionalRaw);

    return {
      autoconciencia,
      autogestional,
      raw: {
        autoconciencia: autoconcienciaRaw,
        autogestional: autogestionalRaw,
      },
      interpretation: this.getEIInterpretation(autoconciencia, autogestional),
    };
  }

  // Normalize score from 8-40 range to 0-100
  static normalizeScore(rawScore) {
    const minRaw = 8;
    const maxRaw = 40;
    const normalized = ((rawScore - minRaw) / (maxRaw - minRaw)) * 100;
    return Math.round(Math.max(0, Math.min(100, normalized)));
  }

  // Get interpretation text based on scores
  static getEIInterpretation(autoconciencia, autogestional) {
    const getLevel = (score) => {
      if (score >= 70) return { level: 'ALTA', label: 'High', key: 'high' };
      if (score >= 40) return { level: 'MODERADA', label: 'Moderate', key: 'moderate' };
      return { level: 'BAJA', label: 'Low', key: 'low' };
    };

    const acLevel = getLevel(autoconciencia);
    const agLevel = getLevel(autogestional);

    const interpretations = {
      autoconciencia: {
        high: 'Tienes excelente capacidad de reconocer y entender tus emociones. Esto es una fortaleza clave para tu inteligencia emocional.',
        moderate: 'Estás desarrollando capacidad de reconocer tus emociones. Con práctica, mejorarás esta importante habilidad.',
        low: 'Identificar y entender tus emociones es un área de enfoque. Las herramientas de esta app te ayudarán a mejorar.',
      },
      autogestional: {
        high: 'Excelente capacidad para manejar tus emociones y responder de manera constructiva a desafíos.',
        moderate: 'Estás desarrollando habilidades de manejo emocional. Practica con nuestras herramientas.',
        low: 'El manejo de tus emociones es un área de crecimiento. Las herramientas específicas de esta app están diseñadas para ayudarte.',
      },
    };

    return {
      autoconciencia: {
        score: autoconciencia,
        level: acLevel.level,
        levelKey: acLevel.key,
        interpretation: interpretations.autoconciencia[acLevel.key],
      },
      autogestional: {
        score: autogestional,
        level: agLevel.level,
        levelKey: agLevel.key,
        interpretation: interpretations.autogestional[agLevel.key],
      },
    };
  }

  // Store archetype assessment
  static async storeArchetypeAssessment(userId, answers, results) {
    try {
      const result = await pool.query(
        'INSERT INTO assessments (user_id, assessment_type, answers, results) VALUES ($1, $2, $3, $4) RETURNING id, created_at',
        [userId, 'archetype', JSON.stringify(answers), JSON.stringify(results)]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Store EI baseline assessment
  static async storeEIAssessment(userId, answers, results) {
    try {
      const result = await pool.query(
        'INSERT INTO assessments (user_id, assessment_type, answers, results) VALUES ($1, $2, $3, $4) RETURNING id, created_at',
        [userId, 'ei-baseline', JSON.stringify(answers), JSON.stringify(results)]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get latest assessment by type
  static async getLatestAssessment(userId, assessmentType) {
    try {
      const result = await pool.query(
        'SELECT * FROM assessments WHERE user_id = $1 AND assessment_type = $2 ORDER BY created_at DESC LIMIT 1',
        [userId, assessmentType]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AssessmentService;

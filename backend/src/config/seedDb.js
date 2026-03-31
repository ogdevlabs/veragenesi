const pool = require('./database');

const seedArchetypes = async () => {
  const client = await pool.connect();
  try {
    // Check if archetypes already exist
    const result = await client.query('SELECT COUNT(*) FROM archetypes');
    if (result.rows[0].count > 0) {
      console.log('✓ Archetypes already seeded');
      return;
    }

    console.log('📋 Seeding archetypes...');

    const archetypes = [
      {
        name_es: 'El Protector',
        name_en: 'The Protector',
        description_es: 'Empático y dedicado a cuidar a los demás',
        description_en: 'Empathetic and dedicated to caring for others',
        strengths_es: ['Compasión', 'Escucha activa', 'Lealtad', 'Apoyo emocional'],
        strengths_en: ['Compassion', 'Active listening', 'Loyalty', 'Emotional support'],
        growth_areas_es: ['Establecer límites', 'Autocuidado', 'Asertividad'],
        growth_areas_en: ['Setting boundaries', 'Self-care', 'Assertiveness'],
      },
      {
        name_es: 'El Innovador',
        name_en: 'The Innovator',
        description_es: 'Creativo y orientado a resolver problemas',
        description_en: 'Creative and problem-solving oriented',
        strengths_es: ['Creatividad', 'Pensamiento crítico', 'Adaptabilidad', 'Visión'],
        strengths_en: ['Creativity', 'Critical thinking', 'Adaptability', 'Vision'],
        growth_areas_es: ['Ejecución', 'Paciencia', 'Colaboración'],
        growth_areas_en: ['Execution', 'Patience', 'Collaboration'],
      },
      {
        name_es: 'El Aventurero',
        name_en: 'The Adventurer',
        description_es: 'Espontáneo y busca nuevas experiencias',
        description_en: 'Spontaneous and seeks new experiences',
        strengths_es: ['Entusiasmo', 'Flexibilidad', 'Optimismo', 'Coraje'],
        strengths_en: ['Enthusiasm', 'Flexibility', 'Optimism', 'Courage'],
        growth_areas_es: ['Enfoque', 'Responsabilidad', 'Planificación'],
        growth_areas_en: ['Focus', 'Responsibility', 'Planning'],
      },
      {
        name_es: 'El Sabio',
        name_en: 'The Sage',
        description_es: 'Analítico y busca la verdad y el entendimiento',
        description_en: 'Analytical and seeks truth and understanding',
        strengths_es: ['Inteligencia', 'Observación', 'Reflexión', 'Aprendizaje'],
        strengths_en: ['Intelligence', 'Observation', 'Reflection', 'Learning'],
        growth_areas_es: ['Acción', 'Conexión emocional', 'Simplicidad'],
        growth_areas_en: ['Action', 'Emotional connection', 'Simplicity'],
      },
      {
        name_es: 'El Amante',
        name_en: 'The Lover',
        description_es: 'Apasionado y conectado emocionalmente',
        description_en: 'Passionate and emotionally connected',
        strengths_es: ['Pasión', 'Sensibilidad', 'Profundidad emocional', 'Intimidad'],
        strengths_en: ['Passion', 'Sensitivity', 'Emotional depth', 'Intimacy'],
        growth_areas_es: ['Independencia', 'Autoestima', 'Desapego'],
        growth_areas_en: ['Independence', 'Self-esteem', 'Detachment'],
      },
      {
        name_es: 'El Gobernante',
        name_en: 'The Ruler',
        description_es: 'Líder nato con necesidad de control y orden',
        description_en: 'Natural leader with need for control and order',
        strengths_es: ['Liderazgo', 'Organización', 'Decisión', 'Responsabilidad'],
        strengths_en: ['Leadership', 'Organization', 'Decision-making', 'Responsibility'],
        growth_areas_es: ['Delegación', 'Flexibilidad', 'Empatía'],
        growth_areas_en: ['Delegation', 'Flexibility', 'Empathy'],
      },
      {
        name_es: 'El Mago',
        name_en: 'The Magician',
        description_es: 'Transformador y busca cambiar su realidad',
        description_en: 'Transformer and seeks to change reality',
        strengths_es: ['Transformación', 'Carisma', 'Inspiración', 'Poder personal'],
        strengths_en: ['Transformation', 'Charisma', 'Inspiration', 'Personal power'],
        growth_areas_es: ['Autenticidad', 'Consistencia', 'Humildad'],
        growth_areas_en: ['Authenticity', 'Consistency', 'Humility'],
      },
      {
        name_es: 'El Bufón',
        name_en: 'The Jester',
        description_es: 'Alegre y busca divertirse y traer alegría',
        description_en: 'Joyful and seeks fun and bringing joy',
        strengths_es: ['Humor', 'Alegría', 'Espontaneidad', 'Liberación'],
        strengths_en: ['Humor', 'Joy', 'Spontaneity', 'Liberation'],
        growth_areas_es: ['Profundidad', 'Compromiso', 'Significado'],
        growth_areas_en: ['Depth', 'Commitment', 'Meaning'],
      },
    ];

    for (const archetype of archetypes) {
      await client.query(
        `INSERT INTO archetypes (name_es, name_en, description_es, description_en, strengths_es, strengths_en, growth_areas_es, growth_areas_en)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          archetype.name_es,
          archetype.name_en,
          archetype.description_es,
          archetype.description_en,
          JSON.stringify(archetype.strengths_es),
          JSON.stringify(archetype.strengths_en),
          JSON.stringify(archetype.growth_areas_es),
          JSON.stringify(archetype.growth_areas_en),
        ]
      );
    }

    console.log(`✓ Seeded ${archetypes.length} archetypes`);
  } catch (error) {
    console.error('Error seeding archetypes:', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = seedArchetypes;

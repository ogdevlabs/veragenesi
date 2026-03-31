// Quiz scoring utilities
export const ARCHETYPES = [
  {
    id: 1,
    name: 'El Protector',
    short_name: 'protector',
    emoji: '🛡️',
    description: 'Empático y dedicado a cuidar a los demás',
    strengths: ['Compasión', 'Escucha activa', 'Lealtad', 'Apoyo emocional'],
    growthAreas: ['Establecer límites', 'Autocuidado', 'Asertividad'],
  },
  {
    id: 2,
    name: 'El Innovador',
    short_name: 'innovator',
    emoji: '💡',
    description: 'Creativo y orientado a resolver problemas',
    strengths: ['Creatividad', 'Pensamiento crítico', 'Adaptabilidad', 'Visión'],
    growthAreas: ['Ejecución', 'Paciencia', 'Colaboración'],
  },
  {
    id: 3,
    name: 'El Aventurero',
    short_name: 'adventurer',
    emoji: '🗺️',
    description: 'Espontáneo y busca nuevas experiencias',
    strengths: ['Entusiasmo', 'Flexibilidad', 'Optimismo', 'Coraje'],
    growthAreas: ['Enfoque', 'Responsabilidad', 'Planificación'],
  },
  {
    id: 4,
    name: 'El Sabio',
    short_name: 'sage',
    emoji: '🧠',
    description: 'Analítico y busca la verdad y el entendimiento',
    strengths: ['Inteligencia', 'Observación', 'Reflexión', 'Aprendizaje'],
    growthAreas: ['Acción', 'Conexión emocional', 'Simplicidad'],
  },
  {
    id: 5,
    name: 'El Amante',
    short_name: 'lover',
    emoji: '❤️',
    description: 'Apasionado y conectado emocionalmente',
    strengths: ['Pasión', 'Sensibilidad', 'Profundidad emocional', 'Intimidad'],
    growthAreas: ['Independencia', 'Autoestima', 'Desapego'],
  },
  {
    id: 6,
    name: 'El Gobernante',
    short_name: 'ruler',
    emoji: '👑',
    description: 'Líder nato con necesidad de control y orden',
    strengths: ['Liderazgo', 'Organización', 'Decisión', 'Responsabilidad'],
    growthAreas: ['Delegación', 'Flexibilidad', 'Empatía'],
  },
  {
    id: 7,
    name: 'El Mago',
    short_name: 'magician',
    emoji: '✨',
    description: 'Transformador y busca cambiar su realidad',
    strengths: ['Transformación', 'Carisma', 'Inspiración', 'Poder personal'],
    growthAreas: ['Autenticidad', 'Consistencia', 'Humildad'],
  },
  {
    id: 8,
    name: 'El Bufón',
    short_name: 'jester',
    emoji: '🎭',
    description: 'Alegre y busca divertirse y traer alegría',
    strengths: ['Humor', 'Alegría', 'Espontaneidad', 'Liberación'],
    growthAreas: ['Profundidad', 'Compromiso', 'Significado'],
  },
];

export const TOOLS = [
  {
    id: 'calm_breath',
    name: 'Respiración Calmante',
    name_en: 'Calm Breath',
    category: 'stress',
    emoji: '🌬️',
    duration: 300,
    description: 'Calm your nervous system',
  },
  {
    id: 'ground_yourself',
    name: 'Enraízate',
    name_en: 'Ground Yourself',
    category: 'anxiety',
    emoji: '🧘',
    duration: 180,
    description: 'Sensory grounding technique',
  },
  {
    id: 'quick_write',
    name: 'Escritura Rápida',
    name_en: 'Quick Write',
    category: 'sadness',
    emoji: '📝',
    duration: 300,
    description: 'Prompted journaling',
  },
  {
    id: 'crisis_protocol',
    name: 'Protocolo de Crisis',
    name_en: 'Crisis Protocol',
    category: 'crisis',
    emoji: '🆘',
    duration: 120,
    description: 'Emergency support',
  },
  {
    id: 'pause_reflect',
    name: 'Pausa + Reflexión',
    name_en: 'Pause + Reflect',
    category: 'general',
    emoji: '✨',
    duration: 180,
    description: 'Breathing & gratitude',
  },
];

// Format time in seconds to readable format
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// Format mood level
export const getMoodColor = (score) => {
  if (score >= 70) return { color: '#10B981', label: 'ALTA', key: 'high' };
  if (score >= 40) return { color: '#F59E0B', label: 'MODERADA', key: 'moderate' };
  return { color: '#EF4444', label: 'BAJA', key: 'low' };
};

// Get mood emoji
export const getMoodEmoji = (score) => {
  if (score >= 8) return '😄';
  if (score >= 6) return '🙂';
  if (score >= 4) return '😐';
  if (score >= 2) return '😒';
  return '😔';
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Get tool by ID
export const getToolById = (toolId) => {
  return TOOLS.find((tool) => tool.id === toolId);
};

// Get archetype by name
export const getArchetypeByName = (name) => {
  return ARCHETYPES.find((arch) => arch.name === name || arch.name_en === name);
};

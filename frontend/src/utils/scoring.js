// Quiz scoring utilities
export const ARCHETYPES = [
  { id: 1, name: 'Héroe', description: 'The Hero - Courageous and decisive' },
  { id: 2, name: 'Sabio', description: 'The Sage - Analytical and thoughtful' },
  { id: 3, name: 'Amante', description: 'The Lover - Passionate and connected' },
  { id: 4, name: 'Sombra', description: 'The Shadow - Introspective healer' },
  { id: 5, name: 'Cuidador', description: 'The Caregiver - Compassionate helper' },
  { id: 6, name: 'Jungla', description: 'The Explorer - Adventurous seeker' },
  { id: 7, name: 'Mago', description: 'The Magician - Transformative creator' },
  { id: 8, name: 'Inocente', description: 'The Innocent - Optimistic believer' },
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

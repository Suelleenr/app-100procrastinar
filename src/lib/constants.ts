// Constantes do 100Procrastinar

import { AvatarType, CategoryType } from './types';

export const AVATARES = {
  fofo: {
    emoji: '🐰',
    nome: 'Coelhinho Motivador',
    frases: [
      'Você consegue! 🌟',
      'Um passo de cada vez! 🐾',
      'Estou orgulhoso de você! 💖',
    ],
  },
  serio: {
    emoji: '🦁',
    nome: 'Leão Determinado',
    frases: [
      'Foco total. Vamos lá.',
      'Disciplina é liberdade.',
      'Cada passo conta.',
    ],
  },
  engracado: {
    emoji: '🤪',
    nome: 'Palhaço Produtivo',
    frases: [
      'Bora procrastinar... NÃO! 😂',
      'Menos Netflix, mais ação! 🎬',
      'Você é demais! (Literalmente)',
    ],
  },
  militar: {
    emoji: '🎖️',
    nome: 'Sargento Ação',
    frases: [
      'EXECUTE! Agora!',
      'Sem desculpas, soldado!',
      'Missão cumprida! Próxima!',
    ],
  },
  anime: {
    emoji: '⚡',
    nome: 'Herói Motivacional',
    frases: [
      'Acredite no seu poder! ✨',
      'Seu limite é o céu! 🌸',
      'Nunca desista! 💪',
    ],
  },
} as const;

export const CATEGORIAS: Record<CategoryType, { nome: string; emoji: string; cor: string }> = {
  trabalho: { nome: 'Trabalho', emoji: '💼', cor: 'from-blue-500 to-cyan-600' },
  estudos: { nome: 'Estudos', emoji: '📚', cor: 'from-purple-500 to-pink-600' },
  casa: { nome: 'Casa', emoji: '🏠', cor: 'from-orange-400 to-red-500' },
  saude: { nome: 'Saúde', emoji: '💪', cor: 'from-green-400 to-emerald-600' },
  financas: { nome: 'Finanças', emoji: '💰', cor: 'from-yellow-400 to-orange-500' },
  'bem-estar': { nome: 'Bem-estar', emoji: '🧘', cor: 'from-indigo-400 to-purple-500' },
};

export const CONQUISTAS = [
  { id: 'primeira-tarefa', titulo: 'Primeiro Passo', descricao: 'Completou sua primeira micro tarefa', icone: '🎯', premium: false },
  { id: 'streak-3', titulo: 'Consistência', descricao: '3 dias seguidos', icone: '🔥', premium: false },
  { id: 'streak-7', titulo: 'Semana Forte', descricao: '7 dias seguidos', icone: '⭐', premium: false },
  { id: 'streak-30', titulo: 'Mestre da Disciplina', descricao: '30 dias seguidos', icone: '👑', premium: true },
  { id: '10-tarefas', titulo: 'Produtivo', descricao: '10 micro tarefas completadas', icone: '✅', premium: false },
  { id: '50-tarefas', titulo: 'Imparável', descricao: '50 micro tarefas completadas', icone: '🚀', premium: false },
  { id: '100-tarefas', titulo: 'Centurião', descricao: '100 micro tarefas completadas', icone: '💯', premium: true },
  { id: '60-minutos', titulo: 'Hora de Foco', descricao: '60 minutos focados em um dia', icone: '⏰', premium: false },
  { id: 'todas-categorias', titulo: 'Equilibrado', descricao: 'Completou tarefas em todas as categorias', icone: '🌈', premium: true },
];

export const PLANOS = {
  free: {
    nome: 'Gratuito',
    metasMaximas: 3,
    avatares: ['fofo', 'serio'] as AvatarType[],
    modosEspeciais: false,
    anuncios: true,
  },
  premium: {
    nome: 'Premium',
    metasMaximas: Infinity,
    avatares: ['fofo', 'serio', 'engracado', 'militar', 'anime'] as AvatarType[],
    modosEspeciais: true,
    anuncios: false,
  },
};

export const TIMER_PADRAO = {
  min: 2,
  max: 3,
  emergencia: 5,
};

export const FRASES_MOTIVACIONAIS = [
  'Faça só um passo hoje',
  'Você está mais perto do que imagina',
  'Pequenos passos, grandes conquistas',
  'Comece agora, agradeça depois',
  'Um micro passo de cada vez',
  'Você é capaz!',
  'Foco no próximo passo',
  'Progresso, não perfeição',
];

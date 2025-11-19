// Constantes do 100Procrastinar

import { CategoryType, AvatarType } from './types';

export const CATEGORIAS: Record<CategoryType, { nome: string; emoji: string; cor: string }> = {
  trabalho: {
    nome: 'Trabalho',
    emoji: '💼',
    cor: 'from-blue-500 to-blue-600',
  },
  estudos: {
    nome: 'Estudos',
    emoji: '📚',
    cor: 'from-purple-500 to-purple-600',
  },
  casa: {
    nome: 'Casa',
    emoji: '🏠',
    cor: 'from-green-500 to-green-600',
  },
  saude: {
    nome: 'Saúde',
    emoji: '❤️',
    cor: 'from-red-500 to-red-600',
  },
  financas: {
    nome: 'Finanças',
    emoji: '💰',
    cor: 'from-yellow-500 to-yellow-600',
  },
  'bem-estar': {
    nome: 'Bem-estar',
    emoji: '🧘',
    cor: 'from-pink-500 to-pink-600',
  },
  escola: {
    nome: 'Escola',
    emoji: '🎓',
    cor: 'from-indigo-500 to-indigo-600',
  },
  academia: {
    nome: 'Academia',
    emoji: '💪',
    cor: 'from-orange-500 to-orange-600',
  },
};

export const AVATARES: Record<AvatarType, { emoji: string; nome: string; frases: string[] }> = {
  fofo: {
    emoji: '🐰',
    nome: 'Coelhinho Motivador',
    frases: [
      'Você consegue! Um passinho de cada vez 🌸',
      'Que orgulho de você! Continue assim! 💕',
      'Cada micro passo é uma vitória! 🎉',
      'Acredite em você, eu acredito! ✨',
    ],
  },
  serio: {
    emoji: '🦉',
    nome: 'Coruja Sábia',
    frases: [
      'Foco e disciplina levam ao sucesso.',
      'Cada tarefa concluída é progresso real.',
      'Mantenha a consistência, resultados virão.',
      'Organize, execute, conquiste.',
    ],
  },
  engracado: {
    emoji: '🤡',
    nome: 'Palhaço Animado',
    frases: [
      'Bora lá, campeão! Sem drama! 😎',
      'Procrastinar? Nem pensar! Haha! 🎪',
      'Você é tipo um super-herói... mas de pijama! 🦸',
      'Menos Netflix, mais ação! Brincadeira... ou não? 📺',
    ],
  },
  militar: {
    emoji: '🎖️',
    nome: 'Sargento Disciplina',
    frases: [
      'Soldado! Hora de agir! Sem desculpas!',
      'Disciplina é liberdade! Vamos lá!',
      'Cada segundo conta! Foco na missão!',
      'Você foi treinado para isso! Execute!',
    ],
  },
  anime: {
    emoji: '⚡',
    nome: 'Protagonista Determinado',
    frases: [
      'Acredite no seu potencial! Você pode mais! ⚡',
      'Nunca desista dos seus sonhos! 🌟',
      'O poder está dentro de você! 💪',
      'Cada desafio é uma chance de evoluir! 🔥',
    ],
  },
};

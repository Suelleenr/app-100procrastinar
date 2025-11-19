// Tipos e interfaces do 100Procrastinar

export type AvatarType = 'fofo' | 'serio' | 'engracado' | 'militar' | 'anime';
export type PlanType = 'free' | 'premium';
export type CategoryType = 'trabalho' | 'estudos' | 'casa' | 'saude' | 'financas' | 'bem-estar';
export type PriorityType = 'baixa' | 'media' | 'alta' | 'urgente';
export type StatusType = 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';

export interface User {
  id: string;
  nome: string;
  email: string;
  avatar: AvatarType;
  nivelProcrastinacao: number; // 1-10
  tempoDisponivel: number; // minutos por dia
  plano: PlanType;
  prioridades: CategoryType[];
  createdAt: Date;
}

export interface Meta {
  id: string;
  userId: string;
  titulo: string;
  descricao?: string;
  categoria: CategoryType;
  prioridade: PriorityType;
  prazo?: Date;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
}

export interface MicroTarefa {
  id: string;
  metaId: string;
  descricao: string;
  duracao: number; // minutos
  ordem: number;
  status: StatusType;
  completadaEm?: Date;
  tempoReal?: number; // tempo real que levou
}

export interface Progresso {
  id: string;
  userId: string;
  data: Date;
  minutosFocados: number;
  microTarefasConcluidas: number;
  streak: number;
}

export interface Conquista {
  id: string;
  userId: string;
  tipo: string;
  titulo: string;
  descricao: string;
  icone: string;
  premium: boolean;
  data: Date;
}

export interface OnboardingData {
  prioridades: CategoryType[];
  tempoDisponivel: number;
  nivelProcrastinacao: number;
  avatar: AvatarType;
}

export interface ModoEmergencia {
  duracao: 5;
  microTarefas: MicroTarefa[];
}

export interface ModoFacaPorMim {
  data: Date;
  agenda: {
    hora: string;
    microTarefa: MicroTarefa;
  }[];
}

export interface ModoFaxinaGeral {
  semana: number;
  areas: {
    categoria: CategoryType;
    microTarefasDiarias: MicroTarefa[];
  }[];
}

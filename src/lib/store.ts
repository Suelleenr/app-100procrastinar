'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Meta, MicroTarefa, Progresso, Conquista, OnboardingData } from './types';

interface AppState {
  // User
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (data: Partial<User>) => void;
  
  // Onboarding
  onboardingCompleted: boolean;
  completeOnboarding: (data: OnboardingData) => void;
  
  // Metas
  metas: Meta[];
  addMeta: (meta: Meta) => void;
  updateMeta: (id: string, data: Partial<Meta>) => void;
  deleteMeta: (id: string) => void;
  
  // Micro Tarefas
  microTarefas: MicroTarefa[];
  addMicroTarefas: (tarefas: MicroTarefa[]) => void;
  completeMicroTarefa: (id: string, tempoReal: number) => void;
  getProximaMicroTarefa: () => MicroTarefa | null;
  
  // Progresso
  progressoHoje: Progresso | null;
  updateProgresso: (minutos: number) => void;
  
  // Conquistas
  conquistas: Conquista[];
  addConquista: (conquista: Conquista) => void;
  
  // Streak
  streak: number;
  updateStreak: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (data) => set((state) => ({
        user: state.user ? { ...state.user, ...data } : null,
      })),
      
      // Onboarding
      onboardingCompleted: false,
      completeOnboarding: (data) => {
        const userId = crypto.randomUUID();
        const newUser: User = {
          id: userId,
          nome: 'Usuário',
          email: '',
          avatar: data.avatar,
          nivelProcrastinacao: data.nivelProcrastinacao,
          tempoDisponivel: data.tempoDisponivel,
          plano: 'free',
          prioridades: data.prioridades,
          createdAt: new Date(),
        };
        
        set({
          user: newUser,
          onboardingCompleted: true,
        });
      },
      
      // Metas
      metas: [],
      addMeta: (meta) => set((state) => ({
        metas: [...state.metas, meta],
      })),
      updateMeta: (id, data) => set((state) => ({
        metas: state.metas.map((m) => m.id === id ? { ...m, ...data } : m),
      })),
      deleteMeta: (id) => set((state) => ({
        metas: state.metas.filter((m) => m.id !== id),
        microTarefas: state.microTarefas.filter((mt) => mt.metaId !== id),
      })),
      
      // Micro Tarefas
      microTarefas: [],
      addMicroTarefas: (tarefas) => set((state) => ({
        microTarefas: [...state.microTarefas, ...tarefas],
      })),
      completeMicroTarefa: (id, tempoReal) => {
        set((state) => ({
          microTarefas: state.microTarefas.map((mt) =>
            mt.id === id
              ? {
                  ...mt,
                  status: 'concluida' as const,
                  completadaEm: new Date(),
                  tempoReal,
                }
              : mt
          ),
        }));
        
        // Atualizar progresso
        get().updateProgresso(tempoReal);
      },
      getProximaMicroTarefa: () => {
        const state = get();
        const pendentes = state.microTarefas
          .filter((mt) => mt.status === 'pendente')
          .sort((a, b) => a.ordem - b.ordem);
        
        return pendentes[0] || null;
      },
      
      // Progresso
      progressoHoje: null,
      updateProgresso: (minutos) => {
        const hoje = new Date().toDateString();
        
        set((state) => {
          const progressoAtual = state.progressoHoje;
          const dataProgressoAtual = progressoAtual?.data.toDateString();
          
          if (dataProgressoAtual === hoje && progressoAtual) {
            return {
              progressoHoje: {
                ...progressoAtual,
                minutosFocados: progressoAtual.minutosFocados + minutos,
                microTarefasConcluidas: progressoAtual.microTarefasConcluidas + 1,
              },
            };
          } else {
            return {
              progressoHoje: {
                id: crypto.randomUUID(),
                userId: state.user?.id || '',
                data: new Date(),
                minutosFocados: minutos,
                microTarefasConcluidas: 1,
                streak: state.streak,
              },
            };
          }
        });
        
        // Atualizar streak
        get().updateStreak();
      },
      
      // Conquistas
      conquistas: [],
      addConquista: (conquista) => set((state) => ({
        conquistas: [...state.conquistas, conquista],
      })),
      
      // Streak
      streak: 0,
      updateStreak: () => {
        const state = get();
        const hoje = new Date().toDateString();
        const progressoHoje = state.progressoHoje;
        
        if (progressoHoje && progressoHoje.data.toDateString() === hoje) {
          set({ streak: state.streak + 1 });
        }
      },
    }),
    {
      name: '100procrastinar-storage',
    }
  )
);

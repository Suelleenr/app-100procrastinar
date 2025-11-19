'use client';

import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Clock, Flame } from 'lucide-react';

export function ProgressoCard() {
  const { progressoHoje, streak, microTarefas } = useAppStore();

  const tarefasConcluidas = microTarefas.filter((mt) => mt.status === 'concluida').length;
  const minutosFocados = progressoHoje?.minutosFocados || 0;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Progresso de Hoje</h3>

      <div className="grid grid-cols-3 gap-4">
        {/* Tarefas Concluídas */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 mb-2">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold">{tarefasConcluidas}</div>
          <div className="text-xs text-gray-500">Tarefas</div>
        </div>

        {/* Minutos Focados */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-2">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold">{minutosFocados}</div>
          <div className="text-xs text-gray-500">Minutos</div>
        </div>

        {/* Streak */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/20 mb-2">
            <Flame className="w-6 h-6 text-orange-600" />
          </div>
          <div className="text-2xl font-bold">{streak}</div>
          <div className="text-xs text-gray-500">Dias</div>
        </div>
      </div>
    </Card>
  );
}

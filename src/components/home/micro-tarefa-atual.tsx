'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { MicroTarefa } from '@/lib/types';
import { CATEGORIAS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Check, Timer, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface MicroTarefaAtualProps {
  microTarefa: MicroTarefa;
}

export function MicroTarefaAtual({ microTarefa }: MicroTarefaAtualProps) {
  const [tempoDecorrido, setTempoDecorrido] = useState(0);
  const [timerAtivo, setTimerAtivo] = useState(true);
  const { completeMicroTarefa, metas, getProximaMicroTarefa } = useAppStore();

  const meta = metas.find((m) => m.id === microTarefa.metaId);
  const categoria = meta ? CATEGORIAS[meta.categoria] : null;

  useEffect(() => {
    if (!timerAtivo) return;

    const interval = setInterval(() => {
      setTempoDecorrido((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerAtivo]);

  const handleConcluir = () => {
    const tempoEmMinutos = Math.ceil(tempoDecorrido / 60);
    completeMicroTarefa(microTarefa.id, tempoEmMinutos);
    
    const proxima = getProximaMicroTarefa();
    
    if (proxima) {
      toast.success('Micro tarefa concluída! 🎉', {
        description: 'Próximo passo liberado',
      });
    } else {
      toast.success('Parabéns! Todas as tarefas concluídas! 🎊', {
        description: 'Você está arrasando!',
      });
    }
    
    setTempoDecorrido(0);
  };

  const progressoTempo = Math.min((tempoDecorrido / (microTarefa.duracao * 60)) * 100, 100);
  const minutos = Math.floor(tempoDecorrido / 60);
  const segundos = tempoDecorrido % 60;

  return (
    <Card className="p-8 shadow-xl">
      {/* Categoria Badge */}
      {categoria && (
        <div className="flex items-center gap-2 mb-6">
          <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${categoria.cor} text-white text-sm font-medium flex items-center gap-2`}>
            <span>{categoria.emoji}</span>
            <span>{categoria.nome}</span>
          </div>
        </div>
      )}

      {/* Título da Meta */}
      {meta && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Meta:</p>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{meta.titulo}</h3>
        </div>
      )}

      {/* Micro Tarefa */}
      <div className="mb-8">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Seu próximo micro passo:</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300">{microTarefa.descricao}</p>
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Timer className="w-4 h-4" />
            <span>Tempo estimado: {microTarefa.duracao} min</span>
          </div>
          <div className="text-2xl font-bold font-mono">
            {String(minutos).padStart(2, '0')}:{String(segundos).padStart(2, '0')}
          </div>
        </div>
        <Progress value={progressoTempo} className="h-2" />
      </div>

      {/* Botão Concluir */}
      <Button
        onClick={handleConcluir}
        size="lg"
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-lg py-6"
      >
        <Check className="mr-2 w-6 h-6" />
        Concluir Micro Tarefa
      </Button>

      {/* Dica */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          💡 Foque apenas neste passo. O próximo aparecerá automaticamente!
        </p>
      </div>
    </Card>
  );
}

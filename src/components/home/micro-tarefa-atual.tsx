'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { MicroTarefa } from '@/lib/types';
import { CATEGORIAS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Timer, Sparkles, CheckCircle, AlertCircle, XCircle, RotateCcw, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { EditarTarefaDialog } from './editar-tarefa-dialog';

interface MicroTarefaAtualProps {
  microTarefa: MicroTarefa;
}

export function MicroTarefaAtual({ microTarefa }: MicroTarefaAtualProps) {
  const [tempoDecorrido, setTempoDecorrido] = useState(0);
  const [timerAtivo, setTimerAtivo] = useState(true);
  const [editarOpen, setEditarOpen] = useState(false);
  const { completeMicroTarefa, refazerMicroTarefa, metas, getProximaMicroTarefa, iniciarMicroTarefa } = useAppStore();

  const meta = metas.find((m) => m.id === microTarefa.metaId);
  const categoria = meta ? CATEGORIAS[meta.categoria] : null;

  // Iniciar tarefa automaticamente
  useEffect(() => {
    if (microTarefa.status === 'pendente') {
      iniciarMicroTarefa(microTarefa.id);
    }
  }, [microTarefa.id, microTarefa.status, iniciarMicroTarefa]);

  useEffect(() => {
    if (!timerAtivo) return;

    const interval = setInterval(() => {
      setTempoDecorrido((prev) => {
        const novoTempo = prev + 1;
        
        // Verificar se o tempo expirou
        if (novoTempo >= microTarefa.duracao * 60) {
          setTimerAtivo(false);
          toast.error('Tempo esgotado!', {
            description: 'Você pode refazer esta tarefa ou marcá-la como concluída.',
          });
        }
        
        return novoTempo;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerAtivo, microTarefa.duracao]);

  const dispararConfetes = () => {
    // Confete do centro
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Confete dos lados
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 200);

    // Tocar som de conclusão
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi77eefTRAMUKfj8LZjHAY4ktfzzHksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQUrgs7y2Ik2CBlou+3nn00QDFCn4/C2YxwGOJLX88x5LAUkd8fw3ZBBChRetevrqFUUCkaf4PK+bCEFK4LO8tmJNggZaLvt559NEAxQp+PwtmMcBjiS1/PMeSwFJHfH8N2QQQoUXrXr66hVFApGn+DyvmwhBSuCzvLZiTYIGWi77eefTRAMUKfj8LZjHAY4ktfzzHksBSR3x/DdkEEKFF616+uoVRQKRp/g8r5sIQUrgs7y2Yk2CBlou+3nn00QDFCn4/C2YxwGOJLX88x5LAUkd8fw3ZBBChRetevrqFUUCkaf4PK+bCEFK4LO8tmJNggZaLvt559NEAxQp+PwtmMcBjiS1/PMeSwFJHfH8N2QQQoUXrXr66hVFApGn+DyvmwhBSuCzvLZiTYIGWi77eefTRAMUKfj8LZjHAY4ktfzzHksBSR3x/DdkEEKFF616+uoVRQKRp/g8r5sIQUrgs7y2Yk2CBlou+3nn00QDFCn4/C2YxwGOJLX88x5LAUkd8fw3ZBBChRetevrqFUUCkaf4PK+bCEFK4LO8tmJNggZaLvt559NEAxQp+PwtmMcBjiS1/PMeSwFJHfH8N2QQQoUXrXr66hVFApGn+DyvmwhBSuCzvLZiTYIGWi77eefTRAMUKfj8LZjHAY4ktfzzHksBSR3x/DdkEEKFF616+uoVRQKRp/g8r5sIQU=');
      audio.play();
    } catch (e) {
      // Ignorar erro de áudio
    }
  };

  const handleConcluir = () => {
    const tempoEmMinutos = Math.ceil(tempoDecorrido / 60);
    completeMicroTarefa(microTarefa.id, tempoEmMinutos);
    
    // Disparar confetes e som
    dispararConfetes();
    
    const proxima = getProximaMicroTarefa();
    
    if (proxima) {
      toast.success('🎉 Parabéns! Tarefa concluída!', {
        description: 'Próximo passo liberado. Continue assim!',
      });
    } else {
      toast.success('🎊 Incrível! Todas as tarefas concluídas!', {
        description: 'Você está arrasando hoje!',
      });
    }
    
    setTempoDecorrido(0);
  };

  const handleRefazer = () => {
    refazerMicroTarefa(microTarefa.id);
    setTempoDecorrido(0);
    setTimerAtivo(true);
    toast.info('Tarefa reiniciada', {
      description: 'Vamos tentar novamente!',
    });
  };

  const progressoTempo = Math.min((tempoDecorrido / (microTarefa.duracao * 60)) * 100, 100);
  const minutos = Math.floor(tempoDecorrido / 60);
  const segundos = tempoDecorrido % 60;
  const tempoExpirado = tempoDecorrido >= microTarefa.duracao * 60;

  // Determinar status visual
  const getStatusIcon = () => {
    if (microTarefa.status === 'concluida') {
      return <CheckCircle className="w-8 h-8 text-green-500" />;
    }
    if (tempoExpirado) {
      return <XCircle className="w-8 h-8 text-red-500" />;
    }
    if (microTarefa.status === 'em_andamento') {
      return <AlertCircle className="w-8 h-8 text-yellow-500" />;
    }
    return null;
  };

  const getStatusBadge = () => {
    if (microTarefa.status === 'concluida') {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          <span>Concluída</span>
        </div>
      );
    }
    if (tempoExpirado) {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-medium">
          <XCircle className="w-4 h-4" />
          <span>Tempo Esgotado</span>
        </div>
      );
    }
    if (microTarefa.status === 'em_andamento') {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-medium">
          <AlertCircle className="w-4 h-4" />
          <span>Em Andamento</span>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Card className="p-8 shadow-xl relative">
        {/* Status Icon - Canto superior direito */}
        <div className="absolute top-4 right-4">
          {getStatusIcon()}
        </div>

        {/* Categoria Badge e Status */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {categoria && (
            <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${categoria.cor} text-white text-sm font-medium flex items-center gap-2`}>
              <span>{categoria.emoji}</span>
              <span>{categoria.nome}</span>
            </div>
          )}
          {getStatusBadge()}
        </div>

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
            <div className={`text-2xl font-bold font-mono ${tempoExpirado ? 'text-red-500' : ''}`}>
              {String(minutos).padStart(2, '0')}:{String(segundos).padStart(2, '0')}
            </div>
          </div>
          
          {/* Barra de Progresso Customizada */}
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ease-linear ${
                tempoExpirado 
                  ? 'bg-gradient-to-r from-red-500 to-red-600' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600'
              }`}
              style={{ width: `${progressoTempo}%` }}
            />
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-3">
          {!tempoExpirado && microTarefa.status !== 'concluida' && (
            <>
              <Button
                onClick={() => setEditarOpen(true)}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                <Pencil className="mr-2 w-5 h-5" />
                Editar
              </Button>
              <Button
                onClick={handleConcluir}
                size="lg"
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <Check className="mr-2 w-6 h-6" />
                Concluir
              </Button>
            </>
          )}
          
          {tempoExpirado && microTarefa.status !== 'concluida' && (
            <>
              <Button
                onClick={handleRefazer}
                size="lg"
                variant="outline"
                className="flex-1"
              >
                <RotateCcw className="mr-2 w-5 h-5" />
                Refazer
              </Button>
              <Button
                onClick={handleConcluir}
                size="lg"
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <Check className="mr-2 w-6 h-6" />
                Marcar como Concluída
              </Button>
            </>
          )}
        </div>

        {/* Dica */}
        {!tempoExpirado && microTarefa.status !== 'concluida' && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              💡 Foque apenas neste passo. O próximo aparecerá automaticamente!
            </p>
          </div>
        )}

        {tempoExpirado && microTarefa.status !== 'concluida' && (
          <div className="mt-6 text-center">
            <p className="text-sm text-red-500 dark:text-red-400">
              ⏰ O tempo acabou, mas você pode refazer ou marcar como concluída mesmo assim!
            </p>
          </div>
        )}
      </Card>

      {/* Dialog de Edição */}
      <EditarTarefaDialog
        open={editarOpen}
        onOpenChange={setEditarOpen}
        microTarefa={microTarefa}
      />
    </>
  );
}

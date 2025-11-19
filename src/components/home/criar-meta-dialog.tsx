'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { processarMetaComIA } from '@/lib/ai-logic';
import { Meta, MicroTarefa } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CriarMetaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CriarMetaDialog({ open, onOpenChange }: CriarMetaDialogProps) {
  const [texto, setTexto] = useState('');
  const [processando, setProcessando] = useState(false);
  const { addMeta, addMicroTarefas, user } = useAppStore();

  const handleCriar = async () => {
    if (!texto.trim() || !user) return;

    setProcessando(true);

    // Simular processamento de IA
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      // Processar meta com IA
      const metaProcessada = processarMetaComIA({ texto });

      // Criar meta
      const metaId = crypto.randomUUID();
      const novaMeta: Meta = {
        id: metaId,
        userId: user.id,
        titulo: metaProcessada.titulo,
        categoria: metaProcessada.categoria,
        prioridade: metaProcessada.prioridade,
        prazo: metaProcessada.prazo,
        status: 'pendente',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Criar micro tarefas
      const microTarefas: MicroTarefa[] = metaProcessada.microTarefas.map((mt, index) => ({
        id: crypto.randomUUID(),
        metaId,
        descricao: mt.descricao,
        duracao: mt.duracao,
        ordem: index + 1,
        status: 'pendente',
      }));

      // Adicionar ao store
      addMeta(novaMeta);
      addMicroTarefas(microTarefas);

      toast.success('Meta criada com sucesso!', {
        description: `Dividida em ${microTarefas.length} micro passos`,
      });

      setTexto('');
      onOpenChange(false);
    } catch (error) {
      toast.error('Erro ao criar meta');
    } finally {
      setProcessando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Criar Nova Meta
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              O que você precisa fazer?
            </label>
            <Textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Ex: Estudar para a prova de matemática, Limpar a casa, Fazer exercícios..."
              className="min-h-[120px] resize-none"
              disabled={processando}
            />
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              💡 <strong>Dica:</strong> A IA vai dividir sua meta em micro passos de 2-15 minutos cada.
              Você verá apenas um passo por vez!
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={processando}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCriar}
              disabled={!texto.trim() || processando}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              {processando ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 w-4 h-4" />
                  Criar Meta
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

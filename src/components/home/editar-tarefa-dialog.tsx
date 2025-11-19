'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Meta, MicroTarefa, CategoryType, PriorityType } from '@/lib/types';
import { CATEGORIAS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';

interface EditarTarefaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  microTarefa: MicroTarefa;
}

export function EditarTarefaDialog({ open, onOpenChange, microTarefa }: EditarTarefaDialogProps) {
  const { updateMicroTarefa, updateMeta, metas } = useAppStore();
  const [descricao, setDescricao] = useState(microTarefa.descricao);
  const [duracao, setDuracao] = useState(microTarefa.duracao.toString());
  
  const meta = metas.find((m) => m.id === microTarefa.metaId);
  const [categoria, setCategoria] = useState<CategoryType>(meta?.categoria || 'trabalho');
  const [prioridade, setPrioridade] = useState<PriorityType>(meta?.prioridade || 'media');

  useEffect(() => {
    setDescricao(microTarefa.descricao);
    setDuracao(microTarefa.duracao.toString());
    if (meta) {
      setCategoria(meta.categoria);
      setPrioridade(meta.prioridade);
    }
  }, [microTarefa, meta]);

  const handleSalvar = () => {
    // Atualizar micro tarefa
    updateMicroTarefa(microTarefa.id, {
      descricao,
      duracao: parseInt(duracao),
    });

    // Atualizar meta
    if (meta) {
      updateMeta(meta.id, {
        categoria,
        prioridade,
      });
    }

    toast.success('Tarefa atualizada com sucesso!');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-5 h-5 text-purple-600" />
            Editar Tarefa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Descrição */}
          <div>
            <Label htmlFor="descricao">Descrição da Tarefa</Label>
            <Input
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Estudar matemática por 15 minutos"
            />
          </div>

          {/* Duração */}
          <div>
            <Label htmlFor="duracao">Duração (minutos)</Label>
            <Input
              id="duracao"
              type="number"
              value={duracao}
              onChange={(e) => setDuracao(e.target.value)}
              min="2"
              max="60"
            />
          </div>

          {/* Categoria */}
          <div>
            <Label htmlFor="categoria">Categoria</Label>
            <Select value={categoria} onValueChange={(value) => setCategoria(value as CategoryType)}>
              <SelectTrigger id="categoria">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORIAS).map(([key, cat]) => (
                  <SelectItem key={key} value={key}>
                    <span className="flex items-center gap-2">
                      <span>{cat.emoji}</span>
                      <span>{cat.nome}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Prioridade */}
          <div>
            <Label htmlFor="prioridade">Prioridade</Label>
            <Select value={prioridade} onValueChange={(value) => setPrioridade(value as PriorityType)}>
              <SelectTrigger id="prioridade">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baixa">
                  <span className="flex items-center gap-2">
                    <span>🟢</span>
                    <span>Baixa</span>
                  </span>
                </SelectItem>
                <SelectItem value="media">
                  <span className="flex items-center gap-2">
                    <span>🟡</span>
                    <span>Média</span>
                  </span>
                </SelectItem>
                <SelectItem value="alta">
                  <span className="flex items-center gap-2">
                    <span>🟠</span>
                    <span>Alta</span>
                  </span>
                </SelectItem>
                <SelectItem value="urgente">
                  <span className="flex items-center gap-2">
                    <span>🔴</span>
                    <span>Urgente</span>
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSalvar}
              disabled={!descricao.trim() || !duracao}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              Salvar Alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

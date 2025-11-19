'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { processarMetaComIA, organizarTarefasInteligente } from '@/lib/ai-logic';
import { Meta, MicroTarefa } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2, Clock, ListOrdered, MousePointer, ChevronUp, ChevronDown, Trash2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { CATEGORIAS } from '@/lib/constants';
import type { CategoryType, PriorityType } from '@/lib/types';

interface CriarMetaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Etapa = 'input' | 'lista-organizada' | 'escolher-ordem' | 'editar-tarefa';

interface TarefaOrganizada {
  id: string;
  descricao: string;
  categoria: string;
  prioridade: string;
  duracaoEstimada: number;
  ordem: number;
}

export function CriarMetaDialog({ open, onOpenChange }: CriarMetaDialogProps) {
  const [etapa, setEtapa] = useState<Etapa>('input');
  const [texto, setTexto] = useState('');
  const [processando, setProcessando] = useState(false);
  const [tarefasOrganizadas, setTarefasOrganizadas] = useState<TarefaOrganizada[]>([]);
  const [tarefaEditando, setTarefaEditando] = useState<TarefaOrganizada | null>(null);
  const { addMeta, addMicroTarefas, user } = useAppStore();

  // Estados para edição
  const [descricaoEdit, setDescricaoEdit] = useState('');
  const [duracaoEdit, setDuracaoEdit] = useState('');
  const [categoriaEdit, setCategoriaEdit] = useState<CategoryType>('trabalho');
  const [prioridadeEdit, setPrioridadeEdit] = useState<PriorityType>('media');

  const handleAnalisarTexto = async () => {
    if (!texto.trim() || !user) return;

    setProcessando(true);

    // Simular processamento de IA
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      // IA organiza as tarefas de forma inteligente usando o tempo disponível do usuário
      const tarefas = organizarTarefasInteligente({
        texto,
        tempoDisponivel: user.tempoDisponivel,
        prioridades: user.prioridades,
      });

      setTarefasOrganizadas(tarefas);
      setEtapa('lista-organizada');
      
      toast.success('Tarefas organizadas!', {
        description: `${tarefas.length} tarefas identificadas e priorizadas`,
      });
    } catch (error) {
      toast.error('Erro ao processar tarefas');
    } finally {
      setProcessando(false);
    }
  };

  const handleEscolherOrdemSugerida = async () => {
    setProcessando(true);
    await criarMetasEMicroTarefas(tarefasOrganizadas);
    setProcessando(false);
  };

  const handleEscolherOrdemManual = () => {
    setEtapa('escolher-ordem');
  };

  const moverTarefa = (index: number, direcao: 'cima' | 'baixo') => {
    const novaLista = [...tarefasOrganizadas];
    const novoIndex = direcao === 'cima' ? index - 1 : index + 1;
    
    if (novoIndex < 0 || novoIndex >= novaLista.length) return;
    
    [novaLista[index], novaLista[novoIndex]] = [novaLista[novoIndex], novaLista[index]];
    
    // Atualizar ordem
    novaLista.forEach((tarefa, i) => {
      tarefa.ordem = i + 1;
    });
    
    setTarefasOrganizadas(novaLista);
  };

  const removerTarefa = (index: number) => {
    const novaLista = tarefasOrganizadas.filter((_, i) => i !== index);
    novaLista.forEach((tarefa, i) => {
      tarefa.ordem = i + 1;
    });
    setTarefasOrganizadas(novaLista);
  };

  const abrirEdicaoTarefa = (tarefa: TarefaOrganizada) => {
    setTarefaEditando(tarefa);
    setDescricaoEdit(tarefa.descricao);
    setDuracaoEdit(tarefa.duracaoEstimada.toString());
    setCategoriaEdit(tarefa.categoria as CategoryType);
    setPrioridadeEdit(tarefa.prioridade as PriorityType);
    setEtapa('editar-tarefa');
  };

  const salvarEdicaoTarefa = () => {
    if (!tarefaEditando) return;

    const novaLista = tarefasOrganizadas.map((t) =>
      t.id === tarefaEditando.id
        ? {
            ...t,
            descricao: descricaoEdit,
            duracaoEstimada: parseInt(duracaoEdit),
            categoria: categoriaEdit,
            prioridade: prioridadeEdit,
          }
        : t
    );

    setTarefasOrganizadas(novaLista);
    toast.success('Tarefa atualizada!');
    setEtapa('lista-organizada');
    setTarefaEditando(null);
  };

  const handleConfirmarOrdemManual = async () => {
    setProcessando(true);
    await criarMetasEMicroTarefas(tarefasOrganizadas);
    setProcessando(false);
  };

  const criarMetasEMicroTarefas = async (tarefas: TarefaOrganizada[]) => {
    if (!user) return;

    try {
      // Criar uma meta para cada tarefa organizada
      for (const tarefa of tarefas) {
        const metaId = crypto.randomUUID();
        
        // Processar com IA para dividir em micro tarefas
        const metaProcessada = processarMetaComIA({ 
          texto: tarefa.descricao,
          categoria: tarefa.categoria as any,
          prioridade: tarefa.prioridade as any,
        });

        const novaMeta: Meta = {
          id: metaId,
          userId: user.id,
          titulo: tarefa.descricao,
          categoria: metaProcessada.categoria,
          prioridade: metaProcessada.prioridade,
          status: 'pendente',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const microTarefas: MicroTarefa[] = metaProcessada.microTarefas.map((mt, index) => ({
          id: crypto.randomUUID(),
          metaId,
          descricao: mt.descricao,
          duracao: mt.duracao,
          ordem: index + 1,
          status: 'pendente',
        }));

        addMeta(novaMeta);
        addMicroTarefas(microTarefas);
      }

      toast.success('Todas as tarefas foram criadas!', {
        description: `${tarefas.length} metas organizadas e divididas em micro passos`,
      });

      resetDialog();
    } catch (error) {
      toast.error('Erro ao criar tarefas');
    }
  };

  const resetDialog = () => {
    setTexto('');
    setTarefasOrganizadas([]);
    setEtapa('input');
    setTarefaEditando(null);
    onOpenChange(false);
  };

  const getCategoriaColor = (categoria: string) => {
    const colors: Record<string, string> = {
      trabalho: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      estudos: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      casa: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      saude: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      financas: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      'bem-estar': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
      escola: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
      academia: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    };
    return colors[categoria] || 'bg-gray-100 text-gray-700';
  };

  const getPrioridadeIcon = (prioridade: string) => {
    if (prioridade === 'urgente') return '🔴';
    if (prioridade === 'alta') return '🟠';
    if (prioridade === 'media') return '🟡';
    return '🟢';
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) resetDialog();
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            {etapa === 'input' && 'Criar Nova Meta'}
            {etapa === 'lista-organizada' && 'Tarefas Organizadas pela IA'}
            {etapa === 'escolher-ordem' && 'Organize Manualmente'}
            {etapa === 'editar-tarefa' && 'Editar Tarefa'}
          </DialogTitle>
        </DialogHeader>

        {/* ETAPA 1: Input do usuário */}
        {etapa === 'input' && (
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Descreva tudo o que você precisa fazer
              </label>
              <Textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Ex: Estudar matemática, limpar a cozinha, fazer exercícios, responder emails, pagar contas, ler um capítulo do livro..."
                className="min-h-[150px] resize-none"
                disabled={processando}
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Escreva tudo que vem na cabeça! A IA vai organizar para você.
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-2">
                🧠 A IA vai fazer por você:
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                <li>✓ Identificar todas as tarefas mencionadas</li>
                <li>✓ Categorizar automaticamente (trabalho, estudos, casa, etc)</li>
                <li>✓ Priorizar baseado em urgência e importância</li>
                <li>✓ Estimar tempo necessário para cada uma</li>
                <li>✓ Organizar na ordem mais eficiente</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={resetDialog}
                disabled={processando}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAnalisarTexto}
                disabled={!texto.trim() || processando}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              >
                {processando ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 w-4 h-4" />
                    Organizar com IA
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* ETAPA 2: Lista organizada pela IA */}
        {etapa === 'lista-organizada' && (
          <div className="space-y-4 py-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">
                ✨ Pronto! Organizei {tarefasOrganizadas.length} tarefas para você
              </p>
              <p className="text-xs text-green-700 dark:text-green-400">
                Tempo total estimado: {tarefasOrganizadas.reduce((acc, t) => acc + t.duracaoEstimada, 0)} minutos
              </p>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {tarefasOrganizadas.map((tarefa, index) => (
                <div
                  key={tarefa.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoriaColor(tarefa.categoria)}`}>
                          {tarefa.categoria}
                        </span>
                        <span className="text-sm">{getPrioridadeIcon(tarefa.prioridade)}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                        {tarefa.descricao}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ~{tarefa.duracaoEstimada} minutos
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => abrirEdicaoTarefa(tarefa)}
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                Como você quer fazer?
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handleEscolherOrdemSugerida}
                  disabled={processando}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  {processando ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <ListOrdered className="mr-2 w-4 h-4" />
                      Seguir ordem da IA
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleEscolherOrdemManual}
                  disabled={processando}
                  variant="outline"
                  className="flex-1"
                >
                  <MousePointer className="mr-2 w-4 h-4" />
                  Escolher ordem
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ETAPA 3: Escolher ordem manualmente */}
        {etapa === 'escolher-ordem' && (
          <div className="space-y-4 py-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-sm font-medium text-purple-800 dark:text-purple-300">
                🎯 Organize na ordem que preferir
              </p>
              <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">
                Use as setas para mover as tarefas ou remova as que não quer fazer agora
              </p>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {tarefasOrganizadas.map((tarefa, index) => (
                <div
                  key={tarefa.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moverTarefa(index, 'cima')}
                        disabled={index === 0}
                        className="h-6 w-6 p-0"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moverTarefa(index, 'baixo')}
                        disabled={index === tarefasOrganizadas.length - 1}
                        className="h-6 w-6 p-0"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoriaColor(tarefa.categoria)}`}>
                          {tarefa.categoria}
                        </span>
                        <span className="text-sm">{getPrioridadeIcon(tarefa.prioridade)}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                        {tarefa.descricao}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ~{tarefa.duracaoEstimada} minutos
                      </p>
                    </div>

                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => abrirEdicaoTarefa(tarefa)}
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removerTarefa(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setEtapa('lista-organizada')}
                disabled={processando}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button
                onClick={handleConfirmarOrdemManual}
                disabled={processando || tarefasOrganizadas.length === 0}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              >
                {processando ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 w-4 h-4" />
                    Confirmar Ordem
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* ETAPA 4: Editar Tarefa */}
        {etapa === 'editar-tarefa' && tarefaEditando && (
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="descricao">Descrição da Tarefa</Label>
              <Input
                id="descricao"
                value={descricaoEdit}
                onChange={(e) => setDescricaoEdit(e.target.value)}
                placeholder="Ex: Estudar matemática por 15 minutos"
              />
            </div>

            <div>
              <Label htmlFor="duracao">Duração (minutos)</Label>
              <Input
                id="duracao"
                type="number"
                value={duracaoEdit}
                onChange={(e) => setDuracaoEdit(e.target.value)}
                min="2"
                max="120"
              />
            </div>

            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={categoriaEdit} onValueChange={(value) => setCategoriaEdit(value as CategoryType)}>
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

            <div>
              <Label htmlFor="prioridade">Prioridade</Label>
              <Select value={prioridadeEdit} onValueChange={(value) => setPrioridadeEdit(value as PriorityType)}>
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

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setEtapa('lista-organizada')}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={salvarEdicaoTarefa}
                disabled={!descricaoEdit.trim() || !duracaoEdit}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              >
                Salvar Alterações
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

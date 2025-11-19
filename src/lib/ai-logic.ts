// Lógica de IA para dividir metas em micro tarefas

import { Meta, MicroTarefa, CategoryType, PriorityType } from './types';

export interface MetaInput {
  texto: string;
  categoria?: CategoryType;
  prioridade?: PriorityType;
  prazo?: Date;
}

export interface MetaProcessada {
  titulo: string;
  categoria: CategoryType;
  prioridade: PriorityType;
  prazo?: Date;
  microTarefas: Omit<MicroTarefa, 'id' | 'metaId' | 'status' | 'completadaEm' | 'tempoReal'>[];
}

export interface TarefaOrganizada {
  id: string;
  descricao: string;
  categoria: string;
  prioridade: string;
  duracaoEstimada: number;
  ordem: number;
}

export interface OrganizarTarefasInput {
  texto: string;
  tempoDisponivel: number;
  prioridades: CategoryType[];
}

// Nova função: Organizar tarefas de forma inteligente
export function organizarTarefasInteligente(input: OrganizarTarefasInput): TarefaOrganizada[] {
  const { texto, tempoDisponivel, prioridades } = input;
  
  // Dividir o texto em tarefas individuais
  const tarefasBrutas = extrairTarefas(texto);
  
  // Analisar cada tarefa
  const tarefasAnalisadas = tarefasBrutas.map((tarefa, index) => {
    const analise = analisarTarefa(tarefa);
    return {
      id: crypto.randomUUID(),
      descricao: tarefa,
      categoria: analise.categoria,
      prioridade: analise.prioridade,
      duracaoEstimada: analise.duracaoEstimada,
      ordem: index + 1,
    };
  });
  
  // Ordenar por prioridade inteligente
  const tarefasOrdenadas = ordenarPorPrioridadeInteligente(
    tarefasAnalisadas,
    tempoDisponivel,
    prioridades
  );
  
  // Ajustar ordem final
  return tarefasOrdenadas.map((tarefa, index) => ({
    ...tarefa,
    ordem: index + 1,
  }));
}

// Extrair tarefas do texto livre - VERSÃO MELHORADA
function extrairTarefas(texto: string): string[] {
  // Primeiro, tentar identificar listas numeradas ou com marcadores
  const linhas = texto.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  // Se tem múltiplas linhas, cada linha é uma tarefa
  if (linhas.length > 1) {
    return linhas.map(linha => {
      // Remover marcadores comuns (números, traços, asteriscos, etc)
      return linha.replace(/^[\d\-\*\•\→\>\#]+[\.\):\s]*/g, '').trim();
    }).filter(t => t.length > 2);
  }
  
  // Se é uma única linha, separar por vírgulas, "e", ponto e vírgula
  const separadores = /[,;]|(?:\s+e\s+)/gi;
  const tarefas = texto
    .split(separadores)
    .map(t => t.trim())
    .filter(t => t.length > 2); // Aceitar tarefas com 3+ caracteres
  
  return tarefas;
}

// Analisar uma tarefa individual
function analisarTarefa(tarefa: string): {
  categoria: string;
  prioridade: string;
  duracaoEstimada: number;
} {
  const tarefaLower = tarefa.toLowerCase();
  
  // Detectar categoria
  let categoria = 'trabalho';
  if (tarefaLower.match(/estudar|aprender|ler|curso|prova|aula|matéria|revisar|livro|capítulo/)) {
    categoria = 'estudos';
  } else if (tarefaLower.match(/limpar|lavar|organizar|arrumar|cozinha|quarto|casa|roupa/)) {
    categoria = 'casa';
  } else if (tarefaLower.match(/exercício|academia|correr|caminhar|treino|alongar|yoga/)) {
    categoria = 'saude';
  } else if (tarefaLower.match(/pagar|conta|dinheiro|banco|boleto|fatura|comprar/)) {
    categoria = 'financas';
  } else if (tarefaLower.match(/meditar|relaxar|descansar|dormir|hobby|lazer/)) {
    categoria = 'bem-estar';
  } else if (tarefaLower.match(/escola|colégio|dever|lição/)) {
    categoria = 'escola';
  } else if (tarefaLower.match(/email|responder|mensagem/)) {
    categoria = 'trabalho';
  }
  
  // Detectar prioridade
  let prioridade = 'media';
  if (tarefaLower.match(/urgente|hoje|agora|imediato|rápido/)) {
    prioridade = 'urgente';
  } else if (tarefaLower.match(/importante|prioridade|essencial|crítico/)) {
    prioridade = 'alta';
  } else if (tarefaLower.match(/quando der|depois|talvez|se possível/)) {
    prioridade = 'baixa';
  }
  
  // Estimar duração baseado na complexidade
  let duracaoEstimada = 15; // padrão
  
  if (tarefaLower.match(/rápido|pequeno|simples|só|apenas/)) {
    duracaoEstimada = 10;
  } else if (tarefaLower.match(/completo|todo|tudo|geral|profundo/)) {
    duracaoEstimada = 30;
  }
  
  // Ajustar por tipo de tarefa
  if (categoria === 'estudos') {
    duracaoEstimada = 25;
  } else if (categoria === 'casa') {
    duracaoEstimada = 20;
  } else if (categoria === 'saude') {
    duracaoEstimada = 15;
  } else if (categoria === 'financas') {
    duracaoEstimada = 10;
  }
  
  return { categoria, prioridade, duracaoEstimada };
}

// Ordenar tarefas de forma inteligente
function ordenarPorPrioridadeInteligente(
  tarefas: TarefaOrganizada[],
  tempoDisponivel: number,
  prioridadesUsuario: CategoryType[]
): TarefaOrganizada[] {
  // Peso de prioridade
  const pesoPrioridade: Record<string, number> = {
    urgente: 100,
    alta: 75,
    media: 50,
    baixa: 25,
  };
  
  // Peso de categoria (baseado nas prioridades do usuário)
  const pesoCategoria: Record<string, number> = {};
  prioridadesUsuario.forEach((cat, index) => {
    pesoCategoria[cat] = 100 - (index * 15);
  });
  
  // Calcular score para cada tarefa
  const tarefasComScore = tarefas.map(tarefa => {
    const scorePrioridade = pesoPrioridade[tarefa.prioridade] || 50;
    const scoreCategoria = pesoCategoria[tarefa.categoria] || 30;
    
    // Tarefas rápidas ganham bônus (efeito momentum)
    const bonusRapida = tarefa.duracaoEstimada <= 10 ? 20 : 0;
    
    const scoreTotal = scorePrioridade + scoreCategoria + bonusRapida;
    
    return {
      ...tarefa,
      score: scoreTotal,
    };
  });
  
  // Ordenar por score (maior primeiro)
  tarefasComScore.sort((a, b) => b.score - a.score);
  
  // Retornar TODAS as tarefas organizadas (não filtrar por tempo disponível)
  return tarefasComScore;
}

// Simula processamento de IA para dividir metas em micro tarefas
export function processarMetaComIA(input: MetaInput): MetaProcessada {
  const texto = input.texto.toLowerCase();
  
  // Detectar categoria
  let categoria: CategoryType = input.categoria || 'trabalho';
  if (texto.includes('estudar') || texto.includes('aprender') || texto.includes('curso')) {
    categoria = 'estudos';
  } else if (texto.includes('limpar') || texto.includes('organizar casa') || texto.includes('arrumar')) {
    categoria = 'casa';
  } else if (texto.includes('exercício') || texto.includes('academia') || texto.includes('saúde')) {
    categoria = 'saude';
  } else if (texto.includes('dinheiro') || texto.includes('pagar') || texto.includes('conta')) {
    categoria = 'financas';
  } else if (texto.includes('meditar') || texto.includes('relaxar') || texto.includes('descansar')) {
    categoria = 'bem-estar';
  }

  // Detectar prioridade
  let prioridade: PriorityType = input.prioridade || 'media';
  if (texto.includes('urgente') || texto.includes('hoje') || texto.includes('agora')) {
    prioridade = 'urgente';
  } else if (texto.includes('importante') || texto.includes('prioridade')) {
    prioridade = 'alta';
  } else if (texto.includes('quando der') || texto.includes('depois')) {
    prioridade = 'baixa';
  }

  // Gerar micro tarefas baseado no tipo de meta
  const microTarefas = gerarMicroTarefas(input.texto, categoria);

  return {
    titulo: input.texto,
    categoria,
    prioridade,
    prazo: input.prazo,
    microTarefas,
  };
}

function gerarMicroTarefas(
  texto: string,
  categoria: CategoryType
): Omit<MicroTarefa, 'id' | 'metaId' | 'status' | 'completadaEm' | 'tempoReal'>[] {
  const textoLower = texto.toLowerCase();

  // Exemplos de divisão por tipo de tarefa
  if (textoLower.includes('estudar') || textoLower.includes('aprender')) {
    return [
      { descricao: 'Abrir o material de estudo', duracao: 2, ordem: 1 },
      { descricao: 'Ler os primeiros 2 parágrafos', duracao: 3, ordem: 2 },
      { descricao: 'Fazer anotações do que entendeu', duracao: 5, ordem: 3 },
      { descricao: 'Revisar as anotações', duracao: 3, ordem: 4 },
    ];
  }

  if (textoLower.includes('limpar') || textoLower.includes('organizar')) {
    return [
      { descricao: 'Pegar os materiais de limpeza', duracao: 2, ordem: 1 },
      { descricao: 'Limpar uma pequena área', duracao: 5, ordem: 2 },
      { descricao: 'Organizar 5 objetos', duracao: 3, ordem: 3 },
      { descricao: 'Guardar os materiais', duracao: 2, ordem: 4 },
    ];
  }

  if (textoLower.includes('exercício') || textoLower.includes('academia')) {
    return [
      { descricao: 'Vestir roupa de exercício', duracao: 2, ordem: 1 },
      { descricao: 'Fazer 5 minutos de alongamento', duracao: 5, ordem: 2 },
      { descricao: 'Fazer 10 repetições de um exercício', duracao: 3, ordem: 3 },
      { descricao: 'Beber água e descansar', duracao: 2, ordem: 4 },
    ];
  }

  if (textoLower.includes('trabalho') || textoLower.includes('projeto')) {
    return [
      { descricao: 'Abrir o documento/projeto', duracao: 2, ordem: 1 },
      { descricao: 'Revisar o que já foi feito', duracao: 3, ordem: 2 },
      { descricao: 'Fazer uma pequena parte', duracao: 5, ordem: 3 },
      { descricao: 'Salvar e organizar arquivos', duracao: 2, ordem: 4 },
    ];
  }

  // Tarefa genérica
  return [
    { descricao: 'Preparar o ambiente', duracao: 2, ordem: 1 },
    { descricao: 'Começar a primeira etapa', duracao: 3, ordem: 2 },
    { descricao: 'Continuar com foco', duracao: 5, ordem: 3 },
    { descricao: 'Finalizar e organizar', duracao: 3, ordem: 4 },
  ];
}

// Ajustar duração das micro tarefas baseado no comportamento do usuário
export function ajustarDuracaoMicroTarefas(
  tempoReal: number,
  duracaoEstimada: number
): number {
  const diferenca = tempoReal - duracaoEstimada;
  
  // Se usuário levou muito mais tempo, aumentar próximas tarefas
  if (diferenca > 2) {
    return Math.min(duracaoEstimada + 2, 15);
  }
  
  // Se usuário foi muito rápido, diminuir próximas tarefas
  if (diferenca < -1) {
    return Math.max(duracaoEstimada - 1, 2);
  }
  
  return duracaoEstimada;
}

// Gerar micro tarefas para Modo Emergência (5 minutos)
export function gerarModoEmergencia(contexto: string): Omit<MicroTarefa, 'id' | 'metaId' | 'status' | 'completadaEm' | 'tempoReal'>[] {
  return [
    { descricao: 'Respire fundo 3 vezes', duracao: 1, ordem: 1 },
    { descricao: 'Escolha UMA coisa para fazer agora', duracao: 1, ordem: 2 },
    { descricao: 'Faça só o primeiro passo dessa coisa', duracao: 3, ordem: 3 },
  ];
}

// Gerar agenda completa do dia (Modo Faça por Mim)
export function gerarAgendaDoDia(
  tempoDisponivel: number,
  prioridades: CategoryType[]
): { hora: string; descricao: string; duracao: number; categoria: CategoryType }[] {
  const agenda: { hora: string; descricao: string; duracao: number; categoria: CategoryType }[] = [];
  let horaAtual = 9; // Começa às 9h
  
  const tarefasPorCategoria: Record<CategoryType, string[]> = {
    trabalho: ['Revisar emails', 'Trabalhar no projeto principal', 'Fazer reunião rápida'],
    estudos: ['Ler material de estudo', 'Fazer exercícios', 'Revisar anotações'],
    casa: ['Organizar uma área', 'Fazer uma tarefa doméstica', 'Limpar algo rápido'],
    saude: ['Fazer alongamento', 'Caminhar 10 minutos', 'Beber água'],
    financas: ['Revisar gastos', 'Pagar uma conta', 'Organizar documentos'],
    'bem-estar': ['Meditar 5 minutos', 'Fazer pausa consciente', 'Relaxar'],
  };

  prioridades.forEach((categoria, index) => {
    const tarefas = tarefasPorCategoria[categoria];
    const tarefa = tarefas[index % tarefas.length];
    
    agenda.push({
      hora: `${horaAtual}:00`,
      descricao: tarefa,
      duracao: 5,
      categoria,
    });
    
    horaAtual += 1;
  });

  return agenda;
}

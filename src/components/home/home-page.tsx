'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { AVATARES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Sparkles, Trophy, Settings, Zap } from 'lucide-react';
import { CriarMetaDialog } from './criar-meta-dialog';
import { MicroTarefaAtual } from './micro-tarefa-atual';
import { ProgressoCard } from './progresso-card';

export function HomePage() {
  const { user, getProximaMicroTarefa, metas } = useAppStore();
  const [criarMetaOpen, setCriarMetaOpen] = useState(false);
  
  const proximaMicroTarefa = getProximaMicroTarefa();
  const avatar = user ? AVATARES[user.avatar] : AVATARES.fofo;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{avatar.emoji}</div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                100Procrastinar
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Olá, {user?.nome || 'Usuário'}!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Trophy className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Frase Motivacional */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            <p className="text-lg font-medium">
              {avatar.frases[Math.floor(Math.random() * avatar.frases.length)]}
            </p>
          </div>
        </Card>

        {/* Micro Tarefa Atual ou Criar Meta */}
        {proximaMicroTarefa ? (
          <MicroTarefaAtual microTarefa={proximaMicroTarefa} />
        ) : (
          <Card className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full mb-6">
              <Zap className="w-10 h-10 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Pronto para começar?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {metas.length === 0
                ? 'Crie sua primeira meta e vamos dividir em micro passos!'
                : 'Todas as micro tarefas foram concluídas! 🎉'}
            </p>
            <Button
              onClick={() => setCriarMetaOpen(true)}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              <Plus className="mr-2 w-5 h-5" />
              Criar Nova Meta
            </Button>
          </Card>
        )}

        {/* Progresso do Dia */}
        <div className="mt-6">
          <ProgressoCard />
        </div>

        {/* Botão Flutuante para Criar Meta */}
        {proximaMicroTarefa && (
          <Button
            onClick={() => setCriarMetaOpen(true)}
            size="lg"
            className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-2xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
          >
            <Plus className="w-6 h-6" />
          </Button>
        )}
      </main>

      {/* Dialog Criar Meta */}
      <CriarMetaDialog open={criarMetaOpen} onOpenChange={setCriarMetaOpen} />
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { CategoryType, AvatarType } from '@/lib/types';
import { AVATARES, CATEGORIAS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ArrowRight, Sparkles } from 'lucide-react';

export function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [prioridades, setPrioridades] = useState<CategoryType[]>([]);
  const [tempoDisponivel, setTempoDisponivel] = useState(30);
  const [nivelProcrastinacao, setNivelProcrastinacao] = useState(5);
  const [avatar, setAvatar] = useState<AvatarType>('fofo');
  
  const { completeOnboarding } = useAppStore();

  const handleCategoriaToggle = (categoria: CategoryType) => {
    if (prioridades.includes(categoria)) {
      setPrioridades(prioridades.filter((p) => p !== categoria));
    } else {
      setPrioridades([...prioridades, categoria]);
    }
  };

  const handleComplete = () => {
    completeOnboarding({
      prioridades,
      tempoDisponivel,
      nivelProcrastinacao,
      avatar,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            100Procrastinar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Vença a procrastinação com micro passos
          </p>
        </div>

        {/* Step 1: Prioridades */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Quais são suas prioridades?</h2>
              <p className="text-gray-600 dark:text-gray-400">Selecione as áreas que mais importam para você</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(CATEGORIAS).map(([key, { nome, emoji, cor }]) => {
                const isSelected = prioridades.includes(key as CategoryType);
                return (
                  <button
                    key={key}
                    onClick={() => handleCategoriaToggle(key as CategoryType)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-105'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{emoji}</div>
                    <div className="text-sm font-medium">{nome}</div>
                  </button>
                );
              })}
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={prioridades.length === 0}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              size="lg"
            >
              Continuar
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Step 2: Tempo Disponível */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Quanto tempo você tem por dia?</h2>
              <p className="text-gray-600 dark:text-gray-400">Seja realista, começamos com pouco</p>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {tempoDisponivel} min
                </div>
              </div>

              <Slider
                value={[tempoDisponivel]}
                onValueChange={(value) => setTempoDisponivel(value[0])}
                min={10}
                max={120}
                step={10}
                className="w-full"
              />

              <div className="flex justify-between text-sm text-gray-500">
                <span>10 min</span>
                <span>120 min</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                Voltar
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                size="lg"
              >
                Continuar
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Nível de Procrastinação */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Qual seu nível de procrastinação?</h2>
              <p className="text-gray-600 dark:text-gray-400">Seja honesto, estamos aqui para ajudar</p>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {nivelProcrastinacao}/10
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  {nivelProcrastinacao <= 3 && 'Você está indo bem!'}
                  {nivelProcrastinacao > 3 && nivelProcrastinacao <= 7 && 'Vamos melhorar juntos'}
                  {nivelProcrastinacao > 7 && 'Estamos aqui para você!'}
                </div>
              </div>

              <Slider
                value={[nivelProcrastinacao]}
                onValueChange={(value) => setNivelProcrastinacao(value[0])}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />

              <div className="flex justify-between text-sm text-gray-500">
                <span>Pouco</span>
                <span>Muito</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                Voltar
              </Button>
              <Button
                onClick={() => setStep(4)}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                size="lg"
              >
                Continuar
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Escolha de Avatar */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Escolha seu companheiro motivacional</h2>
              <p className="text-gray-600 dark:text-gray-400">Quem vai te acompanhar nessa jornada?</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(AVATARES).map(([key, { emoji, nome, frases }]) => {
                const isSelected = avatar === key;
                return (
                  <button
                    key={key}
                    onClick={() => setAvatar(key as AvatarType)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-105'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-5xl mb-3">{emoji}</div>
                    <div className="text-sm font-semibold mb-2">{nome}</div>
                    <div className="text-xs text-gray-500 italic">"{frases[0]}"</div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(3)}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                Voltar
              </Button>
              <Button
                onClick={handleComplete}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                size="lg"
              >
                Começar!
                <Sparkles className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step
                  ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-600'
                  : s < step
                  ? 'w-2 bg-purple-300'
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

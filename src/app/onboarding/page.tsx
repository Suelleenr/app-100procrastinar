'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { ArrowRight, Clock, Home, BookOpen, Dumbbell, User, Moon, Sun, Film, Cake, Weight, Ruler, Droplet, Apple } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Estados do formulário
  const [workHours, setWorkHours] = useState('');
  const [houseChores, setHouseChores] = useState<string[]>([]);
  const [studies, setStudies] = useState('');
  const [gender, setGender] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [sleepTime, setSleepTime] = useState('');
  const [likesMoviesSeries, setLikesMoviesSeries] = useState<boolean | null>(null);
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [dailyWaterIntake, setDailyWaterIntake] = useState('');
  const [dailyFoods, setDailyFoods] = useState('');
  const [freeHoursPerDay, setFreeHoursPerDay] = useState('');

  const choresList = [
    'Lavar louça',
    'Lavar roupa',
    'Passar roupa',
    'Limpar casa',
    'Cozinhar',
    'Fazer compras',
    'Cuidar de pets',
    'Jardinagem',
  ];

  const handleChoreToggle = (chore: string) => {
    setHouseChores((prev) =>
      prev.includes(chore) ? prev.filter((c) => c !== chore) : [...prev, chore]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Salvar informações do usuário
      const { error } = await supabase.from('user_info').insert({
        id: user.id,
        work_hours: workHours || null,
        house_chores: houseChores.length > 0 ? houseChores : null,
        studies: studies || null,
        gender: gender || null,
        wake_time: wakeTime || null,
        sleep_time: sleepTime || null,
        likes_movies_series: likesMoviesSeries,
        age: age ? parseInt(age) : null,
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
        daily_water_intake: dailyWaterIntake ? parseFloat(dailyWaterIntake) : null,
        daily_foods: dailyFoods ? dailyFoods.split(',').map((f) => f.trim()) : null,
        free_hours_per_day: freeHoursPerDay ? parseFloat(freeHoursPerDay) : null,
      });

      if (error) throw error;

      toast.success('Perfil configurado com sucesso!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar informações');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Vamos conhecer você melhor!
            </CardTitle>
            <CardDescription className="text-base">
              Essas informações nos ajudarão a personalizar sua experiência
            </CardDescription>
            <div className="flex gap-2 mt-4">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    s <= step ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Rotina e Trabalho
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="workHours">Horas de trabalho (opcional)</Label>
                  <Input
                    id="workHours"
                    placeholder="Ex: 8h às 17h"
                    value={workHours}
                    onChange={(e) => setWorkHours(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Afazeres da casa (opcional)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {choresList.map((chore) => (
                      <div key={chore} className="flex items-center space-x-2">
                        <Checkbox
                          id={chore}
                          checked={houseChores.includes(chore)}
                          onCheckedChange={() => handleChoreToggle(chore)}
                        />
                        <label htmlFor={chore} className="text-sm cursor-pointer">
                          {chore}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studies" className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    O que você estuda? (opcional)
                  </Label>
                  <Input
                    id="studies"
                    placeholder="Ex: Engenharia, Medicina..."
                    value={studies}
                    onChange={(e) => setStudies(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="freeHours">Horas livres por dia (opcional)</Label>
                  <Input
                    id="freeHours"
                    type="number"
                    placeholder="Ex: 4"
                    value={freeHoursPerDay}
                    onChange={(e) => setFreeHoursPerDay(e.target.value)}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informações Pessoais
                </h3>

                <div className="space-y-2">
                  <Label>Gênero (opcional)</Label>
                  <div className="flex gap-2">
                    {['Masculino', 'Feminino', 'Outro'].map((g) => (
                      <Button
                        key={g}
                        type="button"
                        variant={gender === g ? 'default' : 'outline'}
                        onClick={() => setGender(g)}
                        className="flex-1"
                      >
                        {g}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wakeTime" className="flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      Hora de acordar
                    </Label>
                    <Input
                      id="wakeTime"
                      type="time"
                      value={wakeTime}
                      onChange={(e) => setWakeTime(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sleepTime" className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Hora de dormir
                    </Label>
                    <Input
                      id="sleepTime"
                      type="time"
                      value={sleepTime}
                      onChange={(e) => setSleepTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Film className="w-4 h-4" />
                    Gosta de filmes e séries?
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={likesMoviesSeries === true ? 'default' : 'outline'}
                      onClick={() => setLikesMoviesSeries(true)}
                      className="flex-1"
                    >
                      Sim
                    </Button>
                    <Button
                      type="button"
                      variant={likesMoviesSeries === false ? 'default' : 'outline'}
                      onClick={() => setLikesMoviesSeries(false)}
                      className="flex-1"
                    >
                      Não
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className="flex items-center gap-2">
                    <Cake className="w-4 h-4" />
                    Idade (opcional)
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Ex: 25"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Dumbbell className="w-5 h-5" />
                  Saúde e Bem-estar
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="flex items-center gap-2">
                      <Weight className="w-4 h-4" />
                      Peso (kg)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="Ex: 70"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height" className="flex items-center gap-2">
                      <Ruler className="w-4 h-4" />
                      Altura (cm)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="Ex: 175"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="water" className="flex items-center gap-2">
                    <Droplet className="w-4 h-4" />
                    Água consumida por dia (litros)
                  </Label>
                  <Input
                    id="water"
                    type="number"
                    step="0.1"
                    placeholder="Ex: 2.5"
                    value={dailyWaterIntake}
                    onChange={(e) => setDailyWaterIntake(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="foods" className="flex items-center gap-2">
                    <Apple className="w-4 h-4" />
                    Alimentos consumidos diariamente (opcional)
                  </Label>
                  <Input
                    id="foods"
                    placeholder="Ex: Arroz, Feijão, Frango, Salada"
                    value={dailyFoods}
                    onChange={(e) => setDailyFoods(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">Separe por vírgulas</p>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex-1"
                >
                  Voltar
                </Button>
              )}
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Próximo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {loading ? 'Salvando...' : 'Finalizar'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

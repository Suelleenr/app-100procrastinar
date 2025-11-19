'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyCode, resendVerificationCode } from '@/lib/auth-helpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Mail, CheckCircle, RefreshCw } from 'lucide-react';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const userId = searchParams.get('userId') || '';
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos em segundos

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isValid = await verifyCode(userId, code);

      if (!isValid) {
        toast.error('Código inválido ou expirado');
        return;
      }

      toast.success('E-mail verificado com sucesso!');
      router.push('/onboarding');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao verificar código');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendVerificationCode(userId, email);
      setTimeLeft(600); // Resetar timer
      toast.success('Novo código enviado para seu e-mail!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao reenviar código');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Verifique seu e-mail
          </CardTitle>
          <CardDescription className="text-base">
            Enviamos um código de 6 dígitos para<br />
            <span className="font-semibold text-gray-700">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-center block">
                Código de verificação
              </Label>
              <Input
                id="code"
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                maxLength={6}
                className="h-14 text-center text-2xl font-bold tracking-widest"
              />
              <p className="text-xs text-center text-gray-500">
                {timeLeft > 0 ? (
                  <>Código expira em: <span className="font-semibold text-orange-600">{formatTime(timeLeft)}</span></>
                ) : (
                  <span className="text-red-600 font-semibold">Código expirado</span>
                )}
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={loading || code.length !== 6}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {loading ? 'Verificando...' : 'Verificar código'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Não recebeu?</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-11"
            onClick={handleResend}
            disabled={resending || timeLeft > 540} // Só permite reenviar após 1 minuto
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${resending ? 'animate-spin' : ''}`} />
            {resending ? 'Reenviando...' : 'Reenviar código'}
          </Button>

          {timeLeft > 540 && (
            <p className="text-xs text-center text-gray-500">
              Aguarde {formatTime(timeLeft - 540)} para reenviar
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <VerifyContent />
    </Suspense>
  );
}

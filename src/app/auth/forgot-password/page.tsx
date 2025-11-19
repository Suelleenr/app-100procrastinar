'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState(''); // email ou telefone
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let email = identifier;

      // Se não for email, buscar o email pelo telefone
      if (!identifier.includes('@')) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('phone', identifier)
          .single();

        if (profileError || !profile) {
          toast.error('Não existe nenhuma conta registrada com este telefone.');
          setLoading(false);
          return;
        }

        email = profile.email;
      } else {
        // Verificar se o email existe
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('email', identifier)
          .single();

        if (profileError || !profile) {
          toast.error('Não existe nenhuma conta registrada com este e-mail.');
          setLoading(false);
          return;
        }
      }

      // Enviar e-mail de recuperação
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      toast.success('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
      
      // Redirecionar para página de confirmação
      router.push(`/auth/forgot-password/sent?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      toast.error('Erro ao enviar e-mail de recuperação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1">
          <Link
            href="/auth/login"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para login
          </Link>
          <CardTitle className="text-2xl font-bold">
            Esqueceu sua senha?
          </CardTitle>
          <CardDescription className="text-base">
            Digite seu e-mail ou telefone para receber um link de recuperação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                E-mail ou Telefone
              </Label>
              <Input
                id="identifier"
                type="text"
                placeholder="Digite seu e-mail ou telefone"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="h-11"
              />
              <p className="text-xs text-gray-500">
                Enviaremos um link de recuperação para o e-mail cadastrado
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar link de recuperação'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

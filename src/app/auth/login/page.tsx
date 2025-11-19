'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { CorsErrorAlert } from '@/components/custom/cors-error-alert';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState(''); // email, telefone ou username
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCorsError, setShowCorsError] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Verificar se o identificador é email, telefone ou username
      let email = identifier;
      
      // Se não for email, buscar o email pelo username ou telefone
      if (!identifier.includes('@')) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .or(`username.eq.${identifier},phone.eq.${identifier}`)
          .single();

        if (profileError || !profile) {
          toast.error('Email, usuário ou telefone não encontrado. Verifique os dados e tente novamente.');
          setLoading(false);
          return;
        }

        email = profile.email;
      }

      // Tentar fazer login com o email encontrado
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Detectar erro de CORS/Network
        if (error.message.includes('fetch') || error.message.includes('Failed to fetch') || error.message.includes('Network')) {
          setShowCorsError(true);
          return;
        }
        // Mensagem genérica para não expor se o email existe
        toast.error('Email, usuário ou senha incorretos. Verifique os dados e tente novamente.');
        setLoading(false);
        return;
      }

      // Verificar se o usuário completou o onboarding
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (!profile) {
        // Usuário não verificado, redirecionar para verificação
        router.push(`/auth/verify?email=${email}`);
        return;
      }

      // Verificar se completou onboarding
      const { data: userInfo } = await supabase
        .from('user_info')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (!userInfo) {
        // Redirecionar para onboarding
        router.push('/onboarding');
        return;
      }

      toast.success('Login realizado com sucesso!');
      router.push('/');
    } catch (error: any) {
      // Detectar erro de CORS/Network no catch
      if (error.message?.includes('fetch') || error.message?.includes('Failed to fetch') || error.message?.includes('Network')) {
        setShowCorsError(true);
        return;
      }
      toast.error('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        // Detectar erro de CORS/Network
        if (error.message.includes('fetch') || error.message.includes('Failed to fetch') || error.message.includes('Network')) {
          setShowCorsError(true);
          return;
        }
        throw error;
      }
    } catch (error: any) {
      // Detectar erro de CORS/Network no catch
      if (error.message?.includes('fetch') || error.message?.includes('Failed to fetch') || error.message?.includes('Network')) {
        setShowCorsError(true);
        return;
      }
      toast.error(error.message || 'Erro ao fazer login com Google');
      setLoading(false);
    }
  };

  return (
    <>
      {showCorsError && <CorsErrorAlert />}
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Bem-vindo de volta!
            </CardTitle>
            <CardDescription className="text-base">
              Entre na sua conta para continuar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  E-mail, Telefone ou Nome de Usuário
                </Label>
                <div className="space-y-1">
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="Digite seu e-mail, telefone ou usuário"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    className="h-11"
                  />
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Você pode usar qualquer uma das três opções para acessar sua conta
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Esqueci minha senha
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={loading}
              >
                <LogIn className="w-4 h-4 mr-2" />
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Ou continue com</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Entrar com Google
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Não tem uma conta? </span>
              <Link
                href="/auth/signup"
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Criar conta
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

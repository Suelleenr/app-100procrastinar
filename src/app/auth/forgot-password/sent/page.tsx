'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordSentPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            E-mail enviado!
          </CardTitle>
          <CardDescription className="text-base">
            Verifique sua caixa de entrada
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-blue-900">
              <Mail className="w-5 h-5" />
              <span className="font-medium">E-mail enviado para:</span>
            </div>
            <p className="text-blue-700 font-semibold">{email}</p>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <p>
              Enviamos um link de recuperação de senha para o seu e-mail.
            </p>
            <p>
              Clique no link recebido para criar uma nova senha.
            </p>
            <p className="text-xs text-gray-500 mt-4">
              Não recebeu o e-mail? Verifique sua pasta de spam ou tente novamente.
            </p>
          </div>

          <div className="pt-4 space-y-2">
            <Button
              asChild
              variant="outline"
              className="w-full"
            >
              <Link href="/auth/forgot-password">
                Tentar outro e-mail
              </Link>
            </Button>
            <Button
              asChild
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Link href="/auth/login">
                Voltar para login
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

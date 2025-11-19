'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Erro no callback:', error);
        router.push('/auth/login');
        return;
      }

      if (session) {
        // Verificar se o perfil existe
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!profile) {
          // Criar perfil para usuário OAuth
          await supabase.from('profiles').insert({
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata.full_name,
          });
        }

        // Verificar se já completou onboarding
        const { data: userInfo } = await supabase
          .from('user_info')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!userInfo) {
          router.push('/onboarding');
        } else {
          router.push('/');
        }
      } else {
        router.push('/auth/login');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Autenticando...</p>
      </div>
    </div>
  );
}

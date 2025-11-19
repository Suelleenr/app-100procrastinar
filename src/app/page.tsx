'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/lib/store';
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow';
import { HomePage } from '@/components/home/home-page';

export default function Home() {
  const router = useRouter();
  const { onboardingCompleted, user } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/auth/login');
        return;
      }

      setAuthenticated(true);

      // Verificar se completou onboarding
      const { data: userInfo } = await supabase
        .from('user_info')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!userInfo) {
        router.push('/onboarding');
        return;
      }

      setLoading(false);
    };

    checkAuth();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/auth/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading || !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!onboardingCompleted || !user) {
    return <OnboardingFlow />;
  }

  return <HomePage />;
}

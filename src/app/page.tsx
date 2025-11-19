'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow';
import { HomePage } from '@/components/home/home-page';

export default function Home() {
  const { onboardingCompleted, user } = useAppStore();

  if (!onboardingCompleted || !user) {
    return <OnboardingFlow />;
  }

  return <HomePage />;
}

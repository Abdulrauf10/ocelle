'use client';

import React from 'react';
import FragmentRouter, { useFragmentRouterController } from '@/components/FragmentRouter';
import { Path } from './types';
import IndexFragment from './fragments';
import SurveyFragment from './fragments/survey';
import CompleteFragment from './fragments/complete';
import AppThemeProvider from '@/components/AppThemeProvider';

export default function PauseDelivery() {
  const controller = useFragmentRouterController<Path>({
    defaultRoute: 'index',
    routes: [
      {
        name: 'index',
        component: IndexFragment,
      },
      {
        name: 'survey',
        component: SurveyFragment,
      },
      {
        name: 'complete',
        component: CompleteFragment,
      },
    ],
  });

  return (
    <AppThemeProvider>
      <main className="bg-gold bg-opacity-10 py-10">
        <FragmentRouter controller={controller} />
      </main>
    </AppThemeProvider>
  );
}

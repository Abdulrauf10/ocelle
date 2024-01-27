'use client';

import React from 'react';
import { ThemeProvider } from '@mui/material';
import theme from '@/app/mui-theme';
import FragmentRouter, { useFragmentRouterController } from '@/components/FragmentRouter';
import { Path } from './types';
import IndexFragment from './fragments';
import SurveyFragment from './fragments/survey';
import CompleteFragment from './fragments/complete';

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
    <ThemeProvider theme={theme}>
      <main className="bg-gold bg-opacity-10 py-10">
        <FragmentRouter controller={controller} />
      </main>
    </ThemeProvider>
  );
}

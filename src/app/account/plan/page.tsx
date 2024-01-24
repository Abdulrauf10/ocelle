'use client';

import FragmentRouter, { useFragmentRouterController } from '@/components/FragmentRouter';
import DashboardFragment from './fragments/dashboard';
import { ThemeProvider } from '@mui/material';
import theme from '@/app/mui-theme';

export default function Plan() {
  const controller = useFragmentRouterController<'dashboard'>({
    defaultRoute: 'dashboard',
    routes: [
      {
        name: 'dashboard',
        component: DashboardFragment,
      },
    ],
  });

  return (
    <ThemeProvider theme={theme}>
      <main className="bg-gold bg-opacity-10">
        <FragmentRouter controller={controller} />
      </main>
    </ThemeProvider>
  );
}

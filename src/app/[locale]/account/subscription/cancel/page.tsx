'use client';

import React from 'react';
import IndexFragment from './fragments';
import SurveyFragment from './fragments/survey';
import CompleteFragment from './fragments/complete';
import AppThemeProvider from '@/components/AppThemeProvider';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

export default function PauseDelivery() {
  return (
    <AppThemeProvider>
      <main className="bg-gold bg-opacity-10 py-10">
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<IndexFragment />} />
            <Route path="/survey" element={<SurveyFragment />} />
            <Route path="/complete" element={<CompleteFragment />} />
          </Routes>
        </MemoryRouter>
      </main>
    </AppThemeProvider>
  );
}

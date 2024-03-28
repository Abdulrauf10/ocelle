'use client';

import React from 'react';
import Stage from './Stage';
import WelcomeFragment from './fragments/Welcome';
import DogAgeFragment from './fragments/DogAge';
import DogFragment from './fragments/Dog';
import DogBasicFragment from './fragments/DogBasic';
import DogPreference1Fragment from './fragments/DogPreference1';
import DogPreference2Fragment from './fragments/DogPreference2';
import OwnerFragment from './fragments/Owner';
import CalculatingFragment from './fragments/Calculating';
import ChoosePlanFragment from './fragments/ChoosePlan';
import RecommendedPlanFragment from './fragments/RecommendedPlan';
import ProcessingFragment from './fragments/Processing';
import CheckoutFragment from './fragments/Checkout';
import { SurveyContextProvider } from './SurveyContext';
import AppThemeProvider from '@/components/AppThemeProvider';
import { MemoryRouter, Route } from 'react-router-dom';
import AnimateRoutes from '@/components/AnimateRoutes';
import View from './View';

export default function GetStarted() {
  return (
    <AppThemeProvider>
      <SurveyContextProvider>
        <MemoryRouter>
          <View>
            <AnimateRoutes>
              <Route path={Stage.Welcome} element={<WelcomeFragment />} />
              <Route path={Stage.Dog} element={<DogFragment />} />
              <Route path={Stage.DogBasic} element={<DogBasicFragment />} />
              <Route path={Stage.DogAge} element={<DogAgeFragment />} />
              <Route path={Stage.DogPreference1} element={<DogPreference1Fragment />} />
              <Route path={Stage.DogPreference2} element={<DogPreference2Fragment />} />
              <Route path={Stage.Owner} element={<OwnerFragment />} />
              <Route path={Stage.Calculating} element={<CalculatingFragment />} />
              <Route path={Stage.Processing} element={<ProcessingFragment />} />
              <Route path={Stage.ChoosePlan} element={<ChoosePlanFragment />} />
              <Route path={Stage.RecommendedPlan} element={<RecommendedPlanFragment />} />
              <Route path={Stage.Checkout} element={<CheckoutFragment />} />
            </AnimateRoutes>
          </View>
        </MemoryRouter>
      </SurveyContextProvider>
    </AppThemeProvider>
  );
}

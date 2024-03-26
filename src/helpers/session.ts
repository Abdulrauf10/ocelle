import store from 'store2';

export function getSurveySessionStore() {
  return store.namespace('survey').session;
}

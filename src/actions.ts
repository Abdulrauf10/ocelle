'use server';

import { redirect } from './navigation';
import saleorAuthClient from './saleorAuthClient';

// here for global actions

export async function logout() {
  saleorAuthClient.signOut();
  redirect('/');
}

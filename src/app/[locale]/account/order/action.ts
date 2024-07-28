'use server';

import userService from '@/services/user';

export default async function getOrders() {
  return await userService.orders();
}

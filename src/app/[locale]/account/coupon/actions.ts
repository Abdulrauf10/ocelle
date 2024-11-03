'use server';

import userService from '@/services/user';

export default async function getCoupons() {
  return await userService.coupons();
}

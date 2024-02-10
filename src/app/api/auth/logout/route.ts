import { NextResponse } from 'next/server';
import saleorAuthClient from '@/saleorAuthClient';

export const dynamic = 'force-dynamic'; // defaults to auto

export async function POST() {
  saleorAuthClient.signOut();

  return NextResponse.json({});
}

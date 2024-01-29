import { breedRepository } from '@/repositories';
import AppDataSource from '@/AppDataSource';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET() {
  await AppDataSource.initialize();

  const data = await breedRepository.find();

  await AppDataSource.destroy();

  return NextResponse.json(data);
}

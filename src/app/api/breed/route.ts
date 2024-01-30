import AppDataSource from '@/AppDataSource';
import { NextResponse } from 'next/server';
import { Breed } from '@/entities';

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  const data = await queryRunner.manager.find(Breed);

  await queryRunner.release();

  return NextResponse.json(data);
}

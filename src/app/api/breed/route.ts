import { NextResponse } from 'next/server';
import { Breed } from '@/entities';
import { executeQuery } from '@/helpers/queryRunner';

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET() {
  return executeQuery(async (queryRunner) => {
    return NextResponse.json(await queryRunner.manager.find(Breed));
  });
}

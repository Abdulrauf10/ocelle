import { NextResponse } from 'next/server';

import { Breed } from '@/entities';
import { executeQuery } from '@/helpers/queryRunner';

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET() {
  return executeQuery(async (queryRunner) => {
    const breeds = await queryRunner.manager.find(Breed);
    return NextResponse.json(
      breeds.map((breed) => {
        return {
          id: breed.id,
          name: breed.name,
          size: breed.size,
          uid: breed.uid,
        };
      })
    );
  });
}

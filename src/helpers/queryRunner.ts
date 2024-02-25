import AppDataSource from '@/AppDataSource';
import { QueryRunner } from 'typeorm';

type Executable<T> = (queryRunner: QueryRunner) => Promise<T>;

async function executeQuery<T>(executable: Executable<T>) {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    return await executable(queryRunner);
  } finally {
    if (!queryRunner.isReleased) await queryRunner.release();
  }
}

export { executeQuery };

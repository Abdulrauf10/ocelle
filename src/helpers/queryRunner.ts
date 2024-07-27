import { QueryRunner } from 'typeorm';

import AppDataSource from '@/AppDataSource';

type Executable<T> = (queryRunner: QueryRunner) => Promise<T>;

async function executeQuery<T>(executable: Executable<T>) {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const response = await executable(queryRunner);
    await queryRunner.commitTransaction();
    if (!queryRunner.isReleased) await queryRunner.release();
    return response;
  } catch (e) {
    await queryRunner.rollbackTransaction();
    if (!queryRunner.isReleased) await queryRunner.release();
    throw e;
  }
}

export { executeQuery };

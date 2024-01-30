import seeders from '@/seeders';
import AppDataSource from '@/AppDataSource';

(async function () {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const queryRunner = AppDataSource.createQueryRunner();

  // reset seeders
  for (const seeder of seeders) {
    await seeder.clean(queryRunner);
  }

  // initial seeders
  for (const seeder of seeders) {
    await seeder.run(queryRunner);
  }

  await queryRunner.release();

  await AppDataSource.destroy();
})();

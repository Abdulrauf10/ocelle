import seeders from '@/seeders';
import AppDataSource from '@/AppDataSource';
import { executeQuery } from './helpers/queryRunner';

(async function () {
  await executeQuery(async (queryRunner) => {
    // reset seeders
    for (const seeder of seeders) {
      await seeder.clean(queryRunner);
    }

    // initial seeders
    for (const seeder of seeders) {
      await seeder.run(queryRunner);
    }
  });

  await AppDataSource.destroy();
})();

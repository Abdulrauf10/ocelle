import seeders from '@/seeders';
import AppDataSource from '@/AppDataSource';

async function setup() {
  await AppDataSource.initialize();

  // reset seeders
  for (const seeder of seeders) {
    await seeder.clean();
  }

  // initial seeders
  for (const seeder of seeders) {
    await seeder.run();
  }

  await AppDataSource.destroy();
}

setup();

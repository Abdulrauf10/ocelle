import { Breed } from '@/entities';
import Seeder from './Seeder';
import { QueryRunner } from 'typeorm';

export default class BreedSeeder extends Seeder {
  /**
   * Clean the Collection
   */
  async clean(queryRunner: QueryRunner): Promise<void> {
    const breedRepository = queryRunner.manager.getRepository(Breed);
    await breedRepository.remove(await breedRepository.find());
  }

  async run(queryRunner: QueryRunner): Promise<void> {
    const breedRepository = queryRunner.manager.getRepository(Breed);

    const breeds = [
      breedRepository.create({ name: 'Affenpinscher', size: 'Small', uid: '1' }),
      breedRepository.create({ name: 'Afghan Hound', size: 'Small', uid: '2' }),
      breedRepository.create({ name: 'Africanis', size: 'Large', uid: '3' }),
      breedRepository.create({ name: 'Aidi', size: 'Small', uid: '4 - A' }),
      breedRepository.create({ name: 'Airedale Terrier', size: 'Medium', uid: '5' }),
      breedRepository.create({ name: 'Akbash', size: 'Large', uid: '6' }),
      breedRepository.create({ name: 'Akita (Japanese)', size: 'Large', uid: '8' }),
      breedRepository.create({ name: 'Akita (American)', size: 'Large', uid: '7' }),
      breedRepository.create({ name: 'Aksaray Malaklisi', size: 'Large', uid: '9 - A' }),
    ];

    await breedRepository.save(breeds);
  }
}

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
      breedRepository.create({ enName: 'Affenpinscher', size: 'Small' }),
      breedRepository.create({
        enName: 'Afghan Hound',
        zhName: '阿富汗獵犬',
        size: 'Small',
      }),
      breedRepository.create({ enName: 'Africanis', zhName: '非洲人', size: 'Large' }),
      breedRepository.create({ enName: 'Aidi', zhName: '艾迪', size: 'Small' }),
      breedRepository.create({
        enName: 'Airedale Terrier',
        zhName: '萬用梗犬',
        size: 'Medium',
      }),
      breedRepository.create({ enName: 'Akbash', size: 'Large' }),
      breedRepository.create({
        enName: 'Akita (Japanese)',
        zhName: '秋田犬（日本）',
        size: 'Large',
      }),
      breedRepository.create({
        enName: 'Akita (American)',
        zhName: '秋田犬（美國）',
        size: 'Large',
      }),
      breedRepository.create({ enName: 'Aksaray Malaklisi', size: 'Large' }),
    ];

    await breedRepository.save(breeds);
  }
}

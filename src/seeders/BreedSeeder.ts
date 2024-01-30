import { Breed } from '@/entities';
import Seeder from './Seeder';
import { BreedSize } from '@/enums';
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
      breedRepository.create({ enName: 'Affenpinscher', size: BreedSize.Small }),
      breedRepository.create({
        enName: 'Afghan Hound',
        zhName: '阿富汗獵犬',
        size: BreedSize.Small,
      }),
      breedRepository.create({ enName: 'Africanis', zhName: '非洲人', size: BreedSize.Large }),
      breedRepository.create({ enName: 'Aidi', zhName: '艾迪', size: BreedSize.Small }),
      breedRepository.create({
        enName: 'Airedale Terrier',
        zhName: '萬用梗犬',
        size: BreedSize.Medium,
      }),
      breedRepository.create({ enName: 'Akbash', size: BreedSize.Large }),
      breedRepository.create({
        enName: 'Akita (Japanese)',
        zhName: '秋田犬（日本）',
        size: BreedSize.Large,
      }),
      breedRepository.create({
        enName: 'Akita (American)',
        zhName: '秋田犬（美國）',
        size: BreedSize.Large,
      }),
      breedRepository.create({ enName: 'Aksaray Malaklisi', size: BreedSize.Large }),
    ];

    await breedRepository.save(breeds);
  }
}

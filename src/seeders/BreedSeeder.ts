import { breedRepository } from '@/repositories';
import Seeder from './Seeder';
import { BreedSize } from '@/enums';

export default class BreedSeeder extends Seeder {
  /**
   * Clean the Collection
   */
  async clean(): Promise<void> {
    await breedRepository.remove(await breedRepository.find());
  }

  async run(): Promise<void> {
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

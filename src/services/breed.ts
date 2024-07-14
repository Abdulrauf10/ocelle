import { In } from 'typeorm';

import { Breed } from '@/entities';
import { executeQuery } from '@/helpers/queryRunner';

class BreedService {
  async getByIds(ids: number[]) {
    return await executeQuery(async (queryRunner) => {
      return queryRunner.manager.find(Breed, {
        where: {
          id: In(ids),
        },
      });
    });
  }
}

const breedService = new BreedService();

export default breedService;

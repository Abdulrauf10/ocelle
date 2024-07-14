import { In } from 'typeorm';

import { Breed } from '@/entities';
import { executeQuery } from '@/helpers/queryRunner';

class BreedService {
  async list() {
    return executeQuery((queryRunner) => queryRunner.manager.find(Breed));
  }
  async getByIds(ids: number[]) {
    return executeQuery((queryRunner) =>
      queryRunner.manager.find(Breed, { where: { id: In(ids) } })
    );
  }
}

const breedService = new BreedService();

export default breedService;

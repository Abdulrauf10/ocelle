import { QueryRunner } from 'typeorm';

export default abstract class Seeder {
  /**
   * Clean the Collection
   */
  abstract clean(queryRunner: QueryRunner): Promise<void>;

  /**
   * Create Entities
   */
  abstract run(queryRunner: QueryRunner): Promise<void>;
}

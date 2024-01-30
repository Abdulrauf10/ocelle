import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCareerSubmission1706550641571 implements MigrationInterface {
  name = 'AddCareerSubmission1706550641571';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`career_submission\` (\`id\` int NOT NULL AUTO_INCREMENT, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`resume\` mediumblob NOT NULL, \`cover_letter\` mediumblob NULL, \`career_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`career_submission\` ADD CONSTRAINT \`FK_e8f8022171da1f0f2ad7ff18001\` FOREIGN KEY (\`career_id\`) REFERENCES \`career\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`career_submission\` DROP FOREIGN KEY \`FK_e8f8022171da1f0f2ad7ff18001\``
    );
    await queryRunner.query(`DROP TABLE \`career_submission\``);
  }
}

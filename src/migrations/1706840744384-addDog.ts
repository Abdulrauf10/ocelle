import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDog1706840744384 implements MigrationInterface {
  name = 'AddDog1706840744384';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`dog\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`sex\` varchar(255) NOT NULL, \`is_neutered\` tinyint NOT NULL, \`weight\` double(5,2) NOT NULL COMMENT 'KG', \`body_condition\` varchar(255) NOT NULL, \`activity_level\` varchar(255) NOT NULL, \`food_allergies\` int NOT NULL, \`amount_of_treats\` varchar(255) NOT NULL, \`pickiness\` varchar(255) NOT NULL, \`user_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`dog_breed\` (\`breed_id\` int NOT NULL, \`dog_id\` int NOT NULL, PRIMARY KEY (\`breed_id\`, \`dog_id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `ALTER TABLE \`dog\` ADD CONSTRAINT \`FK_0e47068be8d1aea4497d70be100\` FOREIGN KEY (\`user_id\`) REFERENCES \`saleor_user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`dog_breed\` ADD CONSTRAINT \`FK_e877e5a0a54d1de02b8802345e0\` FOREIGN KEY (\`breed_id\`) REFERENCES \`breed\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`dog_breed\` ADD CONSTRAINT \`FK_4c3dbd7cb9011ac39f63df43df4\` FOREIGN KEY (\`dog_id\`) REFERENCES \`dog\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`dog_breed\` DROP FOREIGN KEY \`FK_4c3dbd7cb9011ac39f63df43df4\``
    );
    await queryRunner.query(
      `ALTER TABLE \`dog_breed\` DROP FOREIGN KEY \`FK_e877e5a0a54d1de02b8802345e0\``
    );
    await queryRunner.query(
      `ALTER TABLE \`dog\` DROP FOREIGN KEY \`FK_0e47068be8d1aea4497d70be100\``
    );
    await queryRunner.query(`DROP TABLE \`dog_breed\``);
    await queryRunner.query(`DROP TABLE \`dog\``);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBreed1705277954625 implements MigrationInterface {
  name = 'AddBreed1705277954625';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`breed\` (\`id\` int NOT NULL AUTO_INCREMENT, \`zh_name\` varchar(255), \`en_name\` varchar(255) NOT NULL, \`size\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`breed\``);
  }
}

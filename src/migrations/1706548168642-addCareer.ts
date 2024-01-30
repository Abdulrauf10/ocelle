import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCareer1706548168642 implements MigrationInterface {
  name = 'AddCareer1706548168642';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`career\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`work_type\` int NOT NULL, \`classification\` int NOT NULL, \`work_pattern\` int NOT NULL, \`apply_date\` datetime NOT NULL, \`end_date\` datetime NOT NULL, \`is_disabled\` tinyint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`career\``);
  }
}

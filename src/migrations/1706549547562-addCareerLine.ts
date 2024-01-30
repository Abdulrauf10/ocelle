import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCareerLine1706549547562 implements MigrationInterface {
    name = 'AddCareerLine1706549547562'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`career_line\` (\`id\` int NOT NULL AUTO_INCREMENT, \`line_type\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`career_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`career_line\` ADD CONSTRAINT \`FK_9075532455b6d44af190decfa14\` FOREIGN KEY (\`career_id\`) REFERENCES \`career\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`career_line\` DROP FOREIGN KEY \`FK_9075532455b6d44af190decfa14\``);
        await queryRunner.query(`DROP TABLE \`career_line\``);
    }

}

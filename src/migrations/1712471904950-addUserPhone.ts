import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserPhone1712471904950 implements MigrationInterface {
    name = 'AddUserPhone1712471904950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`phone\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`phone\``);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveBreedZhName1711601291423 implements MigrationInterface {
    name = 'RemoveBreedZhName1711601291423'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`breed\` DROP COLUMN \`zh_name\``);
        await queryRunner.query(`ALTER TABLE \`breed\` DROP COLUMN \`en_name\``);
        await queryRunner.query(`ALTER TABLE \`breed\` ADD \`name\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`breed\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`breed\` ADD \`en_name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`breed\` ADD \`zh_name\` varchar(255) NULL`);
    }

}

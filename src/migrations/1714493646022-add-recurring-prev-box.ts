import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRecurringPrevBox1714493646022 implements MigrationInterface {
    name = 'AddRecurringPrevBox1714493646022'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`recurring_box\` ADD \`prev_box_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`recurring_box\` ADD UNIQUE INDEX \`IDX_7588b7d25ab33e4a10e810aa41\` (\`prev_box_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_7588b7d25ab33e4a10e810aa41\` ON \`recurring_box\` (\`prev_box_id\`)`);
        await queryRunner.query(`ALTER TABLE \`recurring_box\` ADD CONSTRAINT \`FK_7588b7d25ab33e4a10e810aa411\` FOREIGN KEY (\`prev_box_id\`) REFERENCES \`recurring_box\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`recurring_box\` DROP FOREIGN KEY \`FK_7588b7d25ab33e4a10e810aa411\``);
        await queryRunner.query(`DROP INDEX \`REL_7588b7d25ab33e4a10e810aa41\` ON \`recurring_box\``);
        await queryRunner.query(`ALTER TABLE \`recurring_box\` DROP INDEX \`IDX_7588b7d25ab33e4a10e810aa41\``);
        await queryRunner.query(`ALTER TABLE \`recurring_box\` DROP COLUMN \`prev_box_id\``);
    }

}

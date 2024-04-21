import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLockBoxDate1713677342953 implements MigrationInterface {
    name = 'AddLockBoxDate1713677342953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shipment\` ADD \`lock_box_date\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shipment\` DROP COLUMN \`lock_box_date\``);
    }

}

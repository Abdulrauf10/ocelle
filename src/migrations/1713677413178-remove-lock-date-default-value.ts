import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveLockDateDefaultValue1713677413178 implements MigrationInterface {
    name = 'RemoveLockDateDefaultValue1713677413178'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shipment\` CHANGE \`lock_box_date\` \`lock_box_date\` datetime NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shipment\` CHANGE \`lock_box_date\` \`lock_box_date\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP`);
    }

}

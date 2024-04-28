import { MigrationInterface, QueryRunner } from "typeorm";

export class DropLastDeliveryDate1714285758775 implements MigrationInterface {
    name = 'DropLastDeliveryDate1714285758775'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`dog_plan\` DROP COLUMN \`last_delivery_date\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`dog_plan\` ADD \`last_delivery_date\` datetime NOT NULL`);
    }

}

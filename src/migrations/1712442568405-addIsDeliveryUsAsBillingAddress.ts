import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsDeliveryUsAsBillingAddress1712442568405 implements MigrationInterface {
    name = 'AddIsDeliveryUsAsBillingAddress1712442568405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`is_delivery_us_as_billing_address\` tinyint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`is_delivery_us_as_billing_address\``);
    }

}

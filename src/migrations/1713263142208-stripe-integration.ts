import { MigrationInterface, QueryRunner } from "typeorm";

export class StripeIntegration1713263142208 implements MigrationInterface {
    name = 'StripeIntegration1713263142208'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`stripe\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`stripe_payment_method\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`stripe_payment_method\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`stripe\``);
    }

}

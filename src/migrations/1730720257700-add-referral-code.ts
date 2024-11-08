import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReferralCode1730720257700 implements MigrationInterface {
    name = 'AddReferralCode1730720257700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`referral_code\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_b3a2ab3d9733917ef876376be3\` (\`referral_code\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_b3a2ab3d9733917ef876376be3\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`referral_code\``);
    }

}

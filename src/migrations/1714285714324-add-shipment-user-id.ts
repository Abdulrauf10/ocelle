import { MigrationInterface, QueryRunner } from "typeorm";

export class AddShipmentUserId1714285714324 implements MigrationInterface {
    name = 'AddShipmentUserId1714285714324'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shipment\` ADD \`user_id\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`shipment\` ADD CONSTRAINT \`FK_bf41e996eb69b87f8127e10f85d\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shipment\` DROP FOREIGN KEY \`FK_bf41e996eb69b87f8127e10f85d\``);
        await queryRunner.query(`ALTER TABLE \`shipment\` DROP COLUMN \`user_id\``);
    }

}

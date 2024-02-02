import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSaleorUser1706840627042 implements MigrationInterface {
    name = 'AddSaleorUser1706840627042'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`saleor_user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`order_size\` int NOT NULL, \`saleor_id\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`saleor_user\``);
    }

}

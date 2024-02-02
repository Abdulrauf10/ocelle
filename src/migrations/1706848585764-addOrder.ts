import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrder1706848585764 implements MigrationInterface {
    name = 'AddOrder1706848585764'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`dog_order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`meal_plan\` int NOT NULL, \`recipe1\` int NOT NULL, \`recipe2\` int NULL, \`is_transition_period\` tinyint NOT NULL, \`dog_id\` int NULL, \`order_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`order_size\` int NOT NULL, \`delivery_date\` datetime NOT NULL, \`created_at\` datetime NOT NULL, \`saleor_id\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`dog_order\` ADD CONSTRAINT \`FK_34e437d1adcd80d7e5b7a9febc7\` FOREIGN KEY (\`dog_id\`) REFERENCES \`dog\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`dog_order\` ADD CONSTRAINT \`FK_7887d9937a6194e5aedb049a80b\` FOREIGN KEY (\`order_id\`) REFERENCES \`order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`dog_order\` DROP FOREIGN KEY \`FK_7887d9937a6194e5aedb049a80b\``);
        await queryRunner.query(`ALTER TABLE \`dog_order\` DROP FOREIGN KEY \`FK_34e437d1adcd80d7e5b7a9febc7\``);
        await queryRunner.query(`DROP TABLE \`order\``);
        await queryRunner.query(`DROP TABLE \`dog_order\``);
    }

}

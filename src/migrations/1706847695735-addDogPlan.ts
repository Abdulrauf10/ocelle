import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDogPlan1706847695735 implements MigrationInterface {
    name = 'AddDogPlan1706847695735'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`dog_plan\` (\`id\` int NOT NULL AUTO_INCREMENT, \`meal_plan\` int NOT NULL, \`recipe1\` int NOT NULL, \`recipe2\` int NULL, \`is_enabled_transition_period\` tinyint NOT NULL, \`is_enabled\` tinyint NOT NULL, \`last_delivery_date\` datetime NOT NULL, \`dog_id\` int NULL, UNIQUE INDEX \`REL_2cd39d986a0584fddfb5f9d699\` (\`dog_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`dog_plan\` ADD CONSTRAINT \`FK_2cd39d986a0584fddfb5f9d699b\` FOREIGN KEY (\`dog_id\`) REFERENCES \`dog\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`dog_plan\` DROP FOREIGN KEY \`FK_2cd39d986a0584fddfb5f9d699b\``);
        await queryRunner.query(`DROP INDEX \`REL_2cd39d986a0584fddfb5f9d699\` ON \`dog_plan\``);
        await queryRunner.query(`DROP TABLE \`dog_plan\``);
    }

}

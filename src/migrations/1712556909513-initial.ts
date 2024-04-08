import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1712556909513 implements MigrationInterface {
    name = 'Initial1712556909513'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`breed\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`size\` varchar(255) NOT NULL, \`uid\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_650207c14426ca764db4a23c68\` (\`uid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`career\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`work_type\` int NOT NULL, \`classification\` int NOT NULL, \`work_pattern\` int NOT NULL, \`apply_date\` datetime NOT NULL, \`end_date\` datetime NOT NULL, \`is_disabled\` tinyint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`career_line\` (\`id\` int NOT NULL AUTO_INCREMENT, \`line_type\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`career_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`career_submission\` (\`id\` int NOT NULL AUTO_INCREMENT, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`resume\` mediumblob NOT NULL, \`cover_letter\` mediumblob NULL, \`career_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`dog\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`sex\` varchar(255) NOT NULL, \`is_neutered\` tinyint NOT NULL, \`date_of_birth_method\` varchar(255) NOT NULL, \`date_of_birth\` datetime NOT NULL, \`weight\` double(5,2) NOT NULL COMMENT 'KG', \`body_condition\` varchar(255) NOT NULL, \`activity_level\` varchar(255) NOT NULL, \`food_allergies\` int NOT NULL, \`current_eating\` varchar(255) NOT NULL, \`amount_of_treats\` varchar(255) NOT NULL, \`pickiness\` varchar(255) NOT NULL, \`user_id\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`dog_breed\` (\`breed_id\` int NOT NULL, \`dog_id\` int NOT NULL, PRIMARY KEY (\`breed_id\`, \`dog_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`dog_plan\` (\`id\` int NOT NULL AUTO_INCREMENT, \`meal_plan\` int NOT NULL, \`recipe1\` int NOT NULL, \`recipe2\` int NULL, \`is_enabled_transition_period\` tinyint NOT NULL, \`is_enabled\` tinyint NOT NULL, \`start_date\` datetime NOT NULL, \`last_delivery_date\` datetime NOT NULL, \`dog_id\` int NULL, UNIQUE INDEX \`REL_2cd39d986a0584fddfb5f9d699\` (\`dog_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order\` (\`id\` varchar(255) NOT NULL, \`created_at\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`recurring_box\` (\`id\` int NOT NULL AUTO_INCREMENT, \`meal_plan\` int NOT NULL, \`order_size\` int NOT NULL, \`recipe1\` int NOT NULL, \`recipe2\` int NULL, \`is_transition_period\` tinyint NOT NULL, \`start_date\` datetime NOT NULL, \`end_date\` datetime NOT NULL, \`order_id\` varchar(255) NULL, \`shipment_id\` int NULL, \`dog_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`shipment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`delivery_date\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`order_size\` int NOT NULL, \`is_delivery_us_as_billing_address\` tinyint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`career_line\` ADD CONSTRAINT \`FK_9075532455b6d44af190decfa14\` FOREIGN KEY (\`career_id\`) REFERENCES \`career\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`career_submission\` ADD CONSTRAINT \`FK_e8f8022171da1f0f2ad7ff18001\` FOREIGN KEY (\`career_id\`) REFERENCES \`career\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`dog\` ADD CONSTRAINT \`FK_0e47068be8d1aea4497d70be100\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`dog_breed\` ADD CONSTRAINT \`FK_e877e5a0a54d1de02b8802345e0\` FOREIGN KEY (\`breed_id\`) REFERENCES \`breed\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`dog_breed\` ADD CONSTRAINT \`FK_4c3dbd7cb9011ac39f63df43df4\` FOREIGN KEY (\`dog_id\`) REFERENCES \`dog\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`dog_plan\` ADD CONSTRAINT \`FK_2cd39d986a0584fddfb5f9d699b\` FOREIGN KEY (\`dog_id\`) REFERENCES \`dog\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`recurring_box\` ADD CONSTRAINT \`FK_fdeb1d9a9fb8f2e25da9129f554\` FOREIGN KEY (\`order_id\`) REFERENCES \`order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`recurring_box\` ADD CONSTRAINT \`FK_44a0a0218be18e16a6a7c008f53\` FOREIGN KEY (\`shipment_id\`) REFERENCES \`shipment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`recurring_box\` ADD CONSTRAINT \`FK_8c58005158caec9ee8328af68db\` FOREIGN KEY (\`dog_id\`) REFERENCES \`dog\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`recurring_box\` DROP FOREIGN KEY \`FK_8c58005158caec9ee8328af68db\``);
        await queryRunner.query(`ALTER TABLE \`recurring_box\` DROP FOREIGN KEY \`FK_44a0a0218be18e16a6a7c008f53\``);
        await queryRunner.query(`ALTER TABLE \`recurring_box\` DROP FOREIGN KEY \`FK_fdeb1d9a9fb8f2e25da9129f554\``);
        await queryRunner.query(`ALTER TABLE \`dog_plan\` DROP FOREIGN KEY \`FK_2cd39d986a0584fddfb5f9d699b\``);
        await queryRunner.query(`ALTER TABLE \`dog_breed\` DROP FOREIGN KEY \`FK_4c3dbd7cb9011ac39f63df43df4\``);
        await queryRunner.query(`ALTER TABLE \`dog_breed\` DROP FOREIGN KEY \`FK_e877e5a0a54d1de02b8802345e0\``);
        await queryRunner.query(`ALTER TABLE \`dog\` DROP FOREIGN KEY \`FK_0e47068be8d1aea4497d70be100\``);
        await queryRunner.query(`ALTER TABLE \`career_submission\` DROP FOREIGN KEY \`FK_e8f8022171da1f0f2ad7ff18001\``);
        await queryRunner.query(`ALTER TABLE \`career_line\` DROP FOREIGN KEY \`FK_9075532455b6d44af190decfa14\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`shipment\``);
        await queryRunner.query(`DROP TABLE \`recurring_box\``);
        await queryRunner.query(`DROP TABLE \`order\``);
        await queryRunner.query(`DROP INDEX \`REL_2cd39d986a0584fddfb5f9d699\` ON \`dog_plan\``);
        await queryRunner.query(`DROP TABLE \`dog_plan\``);
        await queryRunner.query(`DROP TABLE \`dog_breed\``);
        await queryRunner.query(`DROP TABLE \`dog\``);
        await queryRunner.query(`DROP TABLE \`career_submission\``);
        await queryRunner.query(`DROP TABLE \`career_line\``);
        await queryRunner.query(`DROP TABLE \`career\``);
        await queryRunner.query(`DROP INDEX \`IDX_650207c14426ca764db4a23c68\` ON \`breed\``);
        await queryRunner.query(`DROP TABLE \`breed\``);
    }

}

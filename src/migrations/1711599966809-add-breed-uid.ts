import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBreedUid1711599966809 implements MigrationInterface {
    name = 'AddBreedUid1711599966809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`breed\` ADD \`uid\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`breed\` ADD UNIQUE INDEX \`IDX_650207c14426ca764db4a23c68\` (\`uid\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`breed\` DROP INDEX \`IDX_650207c14426ca764db4a23c68\``);
        await queryRunner.query(`ALTER TABLE \`breed\` DROP COLUMN \`uid\``);
    }

}

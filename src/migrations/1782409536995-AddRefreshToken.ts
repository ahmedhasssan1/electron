import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshToken1782409536995 implements MigrationInterface {
    name = 'AddRefreshToken1782409536995'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "refreshToken" character varying(512)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refreshToken"`);
    }

}

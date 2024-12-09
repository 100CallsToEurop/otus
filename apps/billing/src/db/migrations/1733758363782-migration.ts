import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1733758363782 implements MigrationInterface {
    name = 'Migration1733758363782'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" integer NOT NULL, "email" character varying NOT NULL, "full_name" character varying NOT NULL, "walletId" integer, CONSTRAINT "REL_0a95e6aab86ff1b0278c18cf48" UNIQUE ("walletId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wallets" ("id" SERIAL NOT NULL, "balance" integer NOT NULL, CONSTRAINT "PK_8402e5df5a30a229380e83e4f7e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_0a95e6aab86ff1b0278c18cf48e" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_0a95e6aab86ff1b0278c18cf48e"`);
        await queryRunner.query(`DROP TABLE "wallets"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}

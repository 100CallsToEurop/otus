import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1733644937782 implements MigrationInterface {
    name = 'Migration1733644937782'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" integer NOT NULL, "email" character varying NOT NULL, "full_name" character varying NOT NULL, "walletId" integer, CONSTRAINT "REL_0dc096f4fce8d08f4be858a647" UNIQUE ("walletId"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wallets" ("id" SERIAL NOT NULL, "balance" numeric(10,2) NOT NULL, CONSTRAINT "PK_8402e5df5a30a229380e83e4f7e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_0dc096f4fce8d08f4be858a647d" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_0dc096f4fce8d08f4be858a647d"`);
        await queryRunner.query(`DROP TABLE "wallets"`);
        await queryRunner.query(`DROP TABLE "products"`);
    }

}

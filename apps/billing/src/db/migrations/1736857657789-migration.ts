import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1736857657789 implements MigrationInterface {
    name = 'Migration1736857657789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "histories" ("id" SERIAL NOT NULL, "orderId" integer NOT NULL, "transaction_id" uuid NOT NULL, "balance" integer NOT NULL, "withdrawal_amount" integer NOT NULL, "transaction_date" TIMESTAMP NOT NULL, "billingId" integer, CONSTRAINT "PK_36b0e707452a8b674f9d95da743" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "billing" ("id" integer NOT NULL, "email" character varying NOT NULL, "full_name" character varying NOT NULL, "walletId" integer, CONSTRAINT "REL_0068ce12192865c9f06186134e" UNIQUE ("walletId"), CONSTRAINT "PK_d9043caf3033c11ed3d1b29f73c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wallets" ("id" SERIAL NOT NULL, "balance" integer NOT NULL, CONSTRAINT "PK_8402e5df5a30a229380e83e4f7e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "histories" ADD CONSTRAINT "FK_f620e00bf0bdcc6954745366c2d" FOREIGN KEY ("billingId") REFERENCES "billing"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "billing" ADD CONSTRAINT "FK_0068ce12192865c9f06186134e7" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "billing" DROP CONSTRAINT "FK_0068ce12192865c9f06186134e7"`);
        await queryRunner.query(`ALTER TABLE "histories" DROP CONSTRAINT "FK_f620e00bf0bdcc6954745366c2d"`);
        await queryRunner.query(`DROP TABLE "wallets"`);
        await queryRunner.query(`DROP TABLE "billing"`);
        await queryRunner.query(`DROP TABLE "histories"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1736857670393 implements MigrationInterface {
    name = 'Migration1736857670393'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "availability_slots" ("id" SERIAL NOT NULL, "orderId" integer NOT NULL, "transaction_id" uuid NOT NULL, "date" TIMESTAMP NOT NULL, "courierId" integer, CONSTRAINT "PK_70765e8e17c8f6374060d70589a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "couriers" ("id" SERIAL NOT NULL, "full_name" character varying NOT NULL, CONSTRAINT "PK_141c3ed6f70beb9ddf4ab4a0e86" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "availability_slots" ADD CONSTRAINT "FK_03a336f21c1136fcd40924fe842" FOREIGN KEY ("courierId") REFERENCES "couriers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "availability_slots" DROP CONSTRAINT "FK_03a336f21c1136fcd40924fe842"`);
        await queryRunner.query(`DROP TABLE "couriers"`);
        await queryRunner.query(`DROP TABLE "availability_slots"`);
    }

}

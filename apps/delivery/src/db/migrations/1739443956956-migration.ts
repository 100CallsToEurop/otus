import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1739443956956 implements MigrationInterface {
    name = 'Migration1739443956956'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "availability_slots" ("id" SERIAL NOT NULL, "orderId" integer NOT NULL, "transaction_id" uuid NOT NULL, "date" TIMESTAMP NOT NULL, "courierId" integer, CONSTRAINT "PK_70765e8e17c8f6374060d70589a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "couriers" ("id" SERIAL NOT NULL, "full_name" character varying NOT NULL, CONSTRAINT "PK_141c3ed6f70beb9ddf4ab4a0e86" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "idempotency" ("id" SERIAL NOT NULL, "event_type" character varying NOT NULL, CONSTRAINT "PK_cec40256e4ef03c10eef53aa729" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."outbox_status_enum" AS ENUM('waiting', 'processing', 'processed', 'failed')`);
        await queryRunner.query(`CREATE TABLE "outbox" ("id" SERIAL NOT NULL, "eventId" character varying NOT NULL, "event_type" character varying NOT NULL, "payload" jsonb NOT NULL, "status" "public"."outbox_status_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "routing_key" character varying NOT NULL, CONSTRAINT "PK_340ab539f309f03bdaa14aa7649" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "availability_slots" ADD CONSTRAINT "FK_03a336f21c1136fcd40924fe842" FOREIGN KEY ("courierId") REFERENCES "couriers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "availability_slots" DROP CONSTRAINT "FK_03a336f21c1136fcd40924fe842"`);
        await queryRunner.query(`DROP TABLE "outbox"`);
        await queryRunner.query(`DROP TYPE "public"."outbox_status_enum"`);
        await queryRunner.query(`DROP TABLE "idempotency"`);
        await queryRunner.query(`DROP TABLE "couriers"`);
        await queryRunner.query(`DROP TABLE "availability_slots"`);
    }

}

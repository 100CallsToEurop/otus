import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1739443951380 implements MigrationInterface {
    name = 'Migration1739443951380'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reserved-products" ("id" SERIAL NOT NULL, "orderId" integer NOT NULL, "transaction_id" uuid NOT NULL, "quantity" integer NOT NULL, "price" integer NOT NULL, "productId" integer, CONSTRAINT "PK_3eec3aa38a12c34acabc02ea929" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "product_name" character varying NOT NULL, "price" integer NOT NULL, "quantity" integer NOT NULL, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."outbox_status_enum" AS ENUM('waiting', 'processing', 'processed', 'failed')`);
        await queryRunner.query(`CREATE TABLE "outbox" ("id" SERIAL NOT NULL, "eventId" character varying NOT NULL, "event_type" character varying NOT NULL, "payload" jsonb NOT NULL, "status" "public"."outbox_status_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "routing_key" character varying NOT NULL, CONSTRAINT "PK_340ab539f309f03bdaa14aa7649" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "idempotency" ("id" SERIAL NOT NULL, "event_type" character varying NOT NULL, CONSTRAINT "PK_cec40256e4ef03c10eef53aa729" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reserved-products" ADD CONSTRAINT "FK_05e773512a8bb8a6102b54e4ff6" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reserved-products" DROP CONSTRAINT "FK_05e773512a8bb8a6102b54e4ff6"`);
        await queryRunner.query(`DROP TABLE "idempotency"`);
        await queryRunner.query(`DROP TABLE "outbox"`);
        await queryRunner.query(`DROP TYPE "public"."outbox_status_enum"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "reserved-products"`);
    }

}

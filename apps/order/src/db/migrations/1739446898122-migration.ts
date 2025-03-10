import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1739446898122 implements MigrationInterface {
    name = 'Migration1739446898122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('Ожидание', 'Ожидание резервирования товаров', 'Ожидание оплаты', 'Ожидание резервирования курьера', 'Готов', 'Отменен')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" integer NOT NULL, "userId" integer NOT NULL, "orderId" integer NOT NULL, "transaction_id" uuid NOT NULL, "status" "public"."orders_status_enum" NOT NULL, "total_price" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "items" integer array NOT NULL, "delivery_date" TIMESTAMP NOT NULL, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."order_views_status_enum" AS ENUM('Ожидание', 'Ожидание резервирования товаров', 'Ожидание оплаты', 'Ожидание резервирования курьера', 'Готов', 'Отменен')`);
        await queryRunner.query(`CREATE TABLE "order_views" ("id" integer NOT NULL, "userId" integer NOT NULL, "orderId" integer NOT NULL, "transaction_id" uuid NOT NULL, "status" "public"."order_views_status_enum" NOT NULL, "total_price" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "items" jsonb, "delivery_date" TIMESTAMP, "courier_full_name" character varying NOT NULL, "transaction_message" character varying NOT NULL, CONSTRAINT "PK_205308b1b948d1619a3b9ca02e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."outbox_status_enum" AS ENUM('waiting', 'processing', 'processed', 'failed')`);
        await queryRunner.query(`CREATE TABLE "outbox" ("id" SERIAL NOT NULL, "eventId" character varying NOT NULL, "event_type" character varying NOT NULL, "payload" jsonb NOT NULL, "status" "public"."outbox_status_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "routing_key" character varying NOT NULL, CONSTRAINT "PK_340ab539f309f03bdaa14aa7649" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "idempotency" ("id" SERIAL NOT NULL, "event_type" character varying NOT NULL, CONSTRAINT "PK_cec40256e4ef03c10eef53aa729" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "idempotent_keys" ("id" uuid NOT NULL, CONSTRAINT "PK_9b0162f7733633d54ab5e6eec27" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_users" ("id" integer NOT NULL, "email" character varying NOT NULL, "fullName" character varying NOT NULL, CONSTRAINT "PK_2c40daf7bf0de4b8705883146c6" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "order_users"`);
        await queryRunner.query(`DROP TABLE "idempotent_keys"`);
        await queryRunner.query(`DROP TABLE "idempotency"`);
        await queryRunner.query(`DROP TABLE "outbox"`);
        await queryRunner.query(`DROP TYPE "public"."outbox_status_enum"`);
        await queryRunner.query(`DROP TABLE "order_views"`);
        await queryRunner.query(`DROP TYPE "public"."order_views_status_enum"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
    }

}

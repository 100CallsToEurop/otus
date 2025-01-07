import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1736252656563 implements MigrationInterface {
    name = 'Migration1736252656563'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('Ожидание', 'Ожидание резервирования товаров', 'Ожидание оплаты', 'Ожидание резервирования курьера', 'Готов', 'Отменен')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" integer NOT NULL, "userId" integer NOT NULL, "status" "public"."orders_status_enum" NOT NULL, "total_price" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "items" integer array NOT NULL, "delivery_date" TIMESTAMP NOT NULL, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."order_views_status_enum" AS ENUM('Ожидание', 'Ожидание резервирования товаров', 'Ожидание оплаты', 'Ожидание резервирования курьера', 'Готов', 'Отменен')`);
        await queryRunner.query(`CREATE TABLE "order_views" ("id" integer NOT NULL, "userId" integer NOT NULL, "status" "public"."order_views_status_enum" NOT NULL, "total_price" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "items" jsonb, "delivery_date" TIMESTAMP, "courier_full_name" character varying NOT NULL, "transaction_message" character varying NOT NULL, CONSTRAINT "PK_205308b1b948d1619a3b9ca02e9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "order_views"`);
        await queryRunner.query(`DROP TYPE "public"."order_views_status_enum"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
    }

}

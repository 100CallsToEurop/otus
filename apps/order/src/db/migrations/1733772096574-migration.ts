import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1733772096574 implements MigrationInterface {
    name = 'Migration1733772096574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('Ожидание', 'Готов', 'Отменен')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" integer NOT NULL, "userId" integer NOT NULL, "status" "public"."orders_status_enum" NOT NULL, "price" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "product_name" character varying NOT NULL, "price" integer NOT NULL, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products_orders_orders" ("productsId" integer NOT NULL, "ordersId" integer NOT NULL, CONSTRAINT "PK_521097f34854748e92f9733ff09" PRIMARY KEY ("productsId", "ordersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_32f907bf48b1368318c4d5023c" ON "products_orders_orders" ("productsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8156d04b7f8d105b28d1e87587" ON "products_orders_orders" ("ordersId") `);
        await queryRunner.query(`ALTER TABLE "products_orders_orders" ADD CONSTRAINT "FK_32f907bf48b1368318c4d5023cb" FOREIGN KEY ("productsId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "products_orders_orders" ADD CONSTRAINT "FK_8156d04b7f8d105b28d1e87587a" FOREIGN KEY ("ordersId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products_orders_orders" DROP CONSTRAINT "FK_8156d04b7f8d105b28d1e87587a"`);
        await queryRunner.query(`ALTER TABLE "products_orders_orders" DROP CONSTRAINT "FK_32f907bf48b1368318c4d5023cb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8156d04b7f8d105b28d1e87587"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_32f907bf48b1368318c4d5023c"`);
        await queryRunner.query(`DROP TABLE "products_orders_orders"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
    }

}

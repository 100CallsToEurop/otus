import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1736099610764 implements MigrationInterface {
    name = 'Migration1736099610764'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reserved-products" ("id" SERIAL NOT NULL, "orderId" integer NOT NULL, "quantity" integer NOT NULL, "price" integer NOT NULL, "productId" integer, CONSTRAINT "PK_3eec3aa38a12c34acabc02ea929" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "product_name" character varying NOT NULL, "price" integer NOT NULL, "quantity" integer NOT NULL, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reserved-products" ADD CONSTRAINT "FK_05e773512a8bb8a6102b54e4ff6" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reserved-products" DROP CONSTRAINT "FK_05e773512a8bb8a6102b54e4ff6"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "reserved-products"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1739443946638 implements MigrationInterface {
    name = 'Migration1739443946638'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "messages" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "content" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "idempotency" ("id" SERIAL NOT NULL, "event_type" character varying NOT NULL, CONSTRAINT "PK_cec40256e4ef03c10eef53aa729" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "idempotency"`);
        await queryRunner.query(`DROP TABLE "messages"`);
    }

}

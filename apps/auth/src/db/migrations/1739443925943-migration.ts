import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1739443925943 implements MigrationInterface {
    name = 'Migration1739443925943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "profiles" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "phone" character varying NOT NULL, CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('Менеджер', 'Пользователь')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "user_name" character varying NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL, "profileId" integer, CONSTRAINT "REL_b1bda35cdb9a2c1b777f5541d8" UNIQUE ("profileId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bad_tokens" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, CONSTRAINT "PK_888c9a326eb118ed4d4850de3a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "security_devices" ("id" SERIAL NOT NULL, "iat" character varying NOT NULL, "exp" character varying NOT NULL, "deviceId" character varying NOT NULL, "ip" character varying NOT NULL, "user_agent" character varying NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_1a2707b89afb452a5ca4e6c8883" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."outbox_status_enum" AS ENUM('waiting', 'processing', 'processed', 'failed')`);
        await queryRunner.query(`CREATE TABLE "outbox" ("id" SERIAL NOT NULL, "eventId" character varying NOT NULL, "event_type" character varying NOT NULL, "payload" jsonb NOT NULL, "status" "public"."outbox_status_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "routing_key" character varying NOT NULL, CONSTRAINT "PK_340ab539f309f03bdaa14aa7649" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_b1bda35cdb9a2c1b777f5541d87" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_b1bda35cdb9a2c1b777f5541d87"`);
        await queryRunner.query(`DROP TABLE "outbox"`);
        await queryRunner.query(`DROP TYPE "public"."outbox_status_enum"`);
        await queryRunner.query(`DROP TABLE "security_devices"`);
        await queryRunner.query(`DROP TABLE "bad_tokens"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "profiles"`);
    }

}

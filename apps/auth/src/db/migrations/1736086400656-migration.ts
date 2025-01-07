import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1736086400656 implements MigrationInterface {
    name = 'Migration1736086400656'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "profiles" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "phone" character varying NOT NULL, CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "user_name" character varying NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "profileId" integer, CONSTRAINT "REL_b1bda35cdb9a2c1b777f5541d8" UNIQUE ("profileId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bad_tokens" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, CONSTRAINT "PK_888c9a326eb118ed4d4850de3a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "security_devices" ("id" SERIAL NOT NULL, "iat" character varying NOT NULL, "exp" character varying NOT NULL, "deviceId" character varying NOT NULL, "ip" character varying NOT NULL, "user_agent" character varying NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_1a2707b89afb452a5ca4e6c8883" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_b1bda35cdb9a2c1b777f5541d87" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_b1bda35cdb9a2c1b777f5541d87"`);
        await queryRunner.query(`DROP TABLE "security_devices"`);
        await queryRunner.query(`DROP TABLE "bad_tokens"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "profiles"`);
    }

}

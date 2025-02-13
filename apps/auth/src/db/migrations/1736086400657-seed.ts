import { ROLE } from '@app/consts';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1736086400657 implements MigrationInterface {
  name = 'Migration1736086400657';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO public.profiles
(id, first_name, last_name, phone)
VALUES(nextval('profiles_id_seq'::regclass), $1, $2, $3);`,
      ['', '', ''],
    );

    await queryRunner.query(
      `INSERT INTO public.users
(id, user_name, email, password_hash, "role", "profileId")
VALUES(nextval('users_id_seq'::regclass), $1, $2, $3, $4, 1);`,
      [
        'Администратор',
        'admin@bk.ru',
        '$2b$10$jm0.DyiwLjSXzRfGnrnzbeU.dFbQaCkLEPqqT4cV7qyVBrSlNItI6',
        ROLE.MANAGER,
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

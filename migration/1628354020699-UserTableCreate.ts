import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserTableCreate1628354020699 implements MigrationInterface {
  name = 'UserTableCreate1628354020699';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying(64) NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "allow_login" boolean NOT NULL DEFAULT true, "nick" character varying, "bio" character varying, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_065d4d8f3b5adb4a08841eae3c" ON "user" ("name") `,
    );
    await queryRunner.query(
      `CREATE TYPE "user_roles_action_enum" AS ENUM('create', 'read', 'update', 'delete')`,
    );
    await queryRunner.query(
      `CREATE TYPE "user_roles_possession_enum" AS ENUM('own', 'any')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_roles" ("id" SERIAL NOT NULL, "role" character varying, "resource" character varying, "action" "user_roles_action_enum" NOT NULL, "possession" "user_roles_possession_enum" NOT NULL, "userId" integer NOT NULL, CONSTRAINT "UQ_02eaa5b743421e4c00e6691abb2" UNIQUE ("userId", "resource", "action", "possession"), CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_472b25323af01488f1f66a06b6" ON "user_roles" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_472b25323af01488f1f66a06b6"`);
    await queryRunner.query(`DROP TABLE "user_roles"`);
    await queryRunner.query(`DROP TYPE "user_roles_possession_enum"`);
    await queryRunner.query(`DROP TYPE "user_roles_action_enum"`);
    await queryRunner.query(`DROP INDEX "IDX_065d4d8f3b5adb4a08841eae3c"`);
    await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}

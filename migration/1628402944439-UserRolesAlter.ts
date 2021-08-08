import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserRolesAlter1628402944439 implements MigrationInterface {
  name = 'UserRolesAlter1628402944439';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."user_roles" DROP CONSTRAINT "UQ_02eaa5b743421e4c00e6691abb2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_roles" DROP COLUMN "resource"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_roles" DROP COLUMN "action"`,
    );
    await queryRunner.query(`DROP TYPE "public"."user_roles_action_enum"`);
    await queryRunner.query(
      `ALTER TABLE "public"."user_roles" DROP COLUMN "possession"`,
    );
    await queryRunner.query(`DROP TYPE "public"."user_roles_possession_enum"`);
    await queryRunner.query(
      `ALTER TABLE "public"."user_roles" ADD "granted" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_roles" ALTER COLUMN "role" SET NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_5f9286e6c25594c6b88c108db7" ON "public"."user_roles" ("userId", "role") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5f9286e6c25594c6b88c108db7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_roles" ALTER COLUMN "role" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_roles" DROP COLUMN "granted"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_roles_possession_enum" AS ENUM('own', 'any')`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_roles" ADD "possession" "public"."user_roles_possession_enum" NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_roles_action_enum" AS ENUM('create', 'read', 'update', 'delete')`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_roles" ADD "action" "public"."user_roles_action_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_roles" ADD "resource" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_roles" ADD CONSTRAINT "UQ_02eaa5b743421e4c00e6691abb2" UNIQUE ("resource", "action", "possession", "userId")`,
    );
  }
}

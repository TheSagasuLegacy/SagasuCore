import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSeriesUserRelation1628960074910
  implements MigrationInterface
{
  name = 'CreateSeriesUserRelation1628960074910';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."series" ADD "user_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."episodes" ADD "user_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."series" ADD CONSTRAINT "FK_49e0b924b7da7f822f0983cf9f9" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."episodes" ADD CONSTRAINT "FK_20a70307ef3cb143de598d0d537" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."episodes" DROP CONSTRAINT "FK_20a70307ef3cb143de598d0d537"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."series" DROP CONSTRAINT "FK_49e0b924b7da7f822f0983cf9f9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."episodes" DROP COLUMN "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."series" DROP COLUMN "user_id"`,
    );
  }
}

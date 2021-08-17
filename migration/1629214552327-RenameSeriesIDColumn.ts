import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameSeriesIDColumn1629214552327 implements MigrationInterface {
  name = 'RenameSeriesIDColumn1629214552327';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."episodes" DROP CONSTRAINT "FK_b0fe3a040103f69ebdee8438c73"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3f54d31f2d6679550cb73148ba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."episodes" RENAME COLUMN "seriesId" TO "series_id"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_9f33582d5a978b59884fbe66e5" ON "public"."episodes" ("series_id", "sort", "type") `,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."episodes" ADD CONSTRAINT "FK_624166580dfcd4e2d88a978ce71" FOREIGN KEY ("series_id") REFERENCES "series"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."episodes" DROP CONSTRAINT "FK_624166580dfcd4e2d88a978ce71"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9f33582d5a978b59884fbe66e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."episodes" RENAME COLUMN "series_id" TO "seriesId"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_3f54d31f2d6679550cb73148ba" ON "public"."episodes" ("seriesId", "sort", "type") `,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."episodes" ADD CONSTRAINT "FK_b0fe3a040103f69ebdee8438c73" FOREIGN KEY ("seriesId") REFERENCES "series"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}

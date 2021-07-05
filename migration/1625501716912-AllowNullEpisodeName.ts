import { MigrationInterface, QueryRunner } from 'typeorm';

export class AllowNullEpisodeName1625501716912 implements MigrationInterface {
  name = 'AllowNullEpisodeName1625501716912';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_898cea99037ece618a448f2cd9"`);
    await queryRunner.query(`ALTER TABLE "episodes" DROP COLUMN "bangumi_id"`);
    await queryRunner.query(
      `ALTER TABLE "episodes" DROP CONSTRAINT "UQ_aac71265d6e20efe067757b30fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "episodes" ALTER COLUMN "name" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "episodes" ADD CONSTRAINT "UQ_aac71265d6e20efe067757b30fb" UNIQUE ("seriesId", "name", "sort")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "episodes" DROP CONSTRAINT "UQ_aac71265d6e20efe067757b30fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "episodes" ALTER COLUMN "name" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "episodes" ADD CONSTRAINT "UQ_aac71265d6e20efe067757b30fb" UNIQUE ("name", "seriesId", "sort")`,
    );
    await queryRunner.query(`ALTER TABLE "episodes" ADD "bangumi_id" integer`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_898cea99037ece618a448f2cd9" ON "episodes" ("bangumi_id") `,
    );
  }
}

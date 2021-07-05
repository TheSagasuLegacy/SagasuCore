import { MigrationInterface, QueryRunner } from 'typeorm';

export class FloatEpisodeSort1625502534079 implements MigrationInterface {
  name = 'FloatEpisodeSort1625502534079';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "episodes" DROP CONSTRAINT "UQ_aac71265d6e20efe067757b30fb"`,
    );
    await queryRunner.query(`ALTER TABLE "episodes" DROP COLUMN "sort"`);
    await queryRunner.query(
      `ALTER TABLE "episodes" ADD "sort" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "episodes" ADD CONSTRAINT "UQ_aac71265d6e20efe067757b30fb" UNIQUE ("seriesId", "name", "sort")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "episodes" DROP CONSTRAINT "UQ_aac71265d6e20efe067757b30fb"`,
    );
    await queryRunner.query(`ALTER TABLE "episodes" DROP COLUMN "sort"`);
    await queryRunner.query(`ALTER TABLE "episodes" ADD "sort" integer`);
    await queryRunner.query(
      `ALTER TABLE "episodes" ADD CONSTRAINT "UQ_aac71265d6e20efe067757b30fb" UNIQUE ("name", "seriesId", "sort")`,
    );
  }
}

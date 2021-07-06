import { MigrationInterface, QueryRunner } from 'typeorm';

export class IndexEpisodeSort1625555409475 implements MigrationInterface {
  name = 'IndexEpisodeSort1625555409475';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "episodes" DROP CONSTRAINT "UQ_aac71265d6e20efe067757b30fb"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_f64e7ec556951fd0dd486dd597" ON "episodes" ("seriesId", "sort") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_f64e7ec556951fd0dd486dd597"`);
    await queryRunner.query(
      `ALTER TABLE "episodes" ADD CONSTRAINT "UQ_aac71265d6e20efe067757b30fb" UNIQUE ("name", "seriesId", "sort")`,
    );
  }
}

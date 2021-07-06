import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEpisodeType1625556498385 implements MigrationInterface {
  name = 'AddEpisodeType1625556498385';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_f64e7ec556951fd0dd486dd597"`);
    await queryRunner.query(
      `CREATE TYPE "episodes_type_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6')`,
    );
    await queryRunner.query(
      `ALTER TABLE "episodes" ADD "type" "episodes_type_enum"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_3f54d31f2d6679550cb73148ba" ON "episodes" ("seriesId", "sort", "type") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_3f54d31f2d6679550cb73148ba"`);
    await queryRunner.query(`ALTER TABLE "episodes" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "episodes_type_enum"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_f64e7ec556951fd0dd486dd597" ON "episodes" ("seriesId", "sort") `,
    );
  }
}

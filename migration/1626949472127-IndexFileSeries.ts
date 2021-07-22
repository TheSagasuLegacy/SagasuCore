import { MigrationInterface, QueryRunner } from 'typeorm';

export class IndexFileSeries1626949472127 implements MigrationInterface {
  name = 'IndexFileSeries1626949472127';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_40cdceb9aa68ad980b3251ca6d" ON "subtitle_file" ("seriesId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_40cdceb9aa68ad980b3251ca6d"`);
  }
}

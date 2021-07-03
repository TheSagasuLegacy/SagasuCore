import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueConstraint1625332572936 implements MigrationInterface {
  name = 'UniqueConstraint1625332572936';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_68b808a9039892c61219f868f2" ON "series" ("name") `,
    );
    await queryRunner.query(
      `ALTER TABLE "episodes" ADD CONSTRAINT "UQ_aac71265d6e20efe067757b30fb" UNIQUE ("seriesId", "name", "sort")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "episodes" DROP CONSTRAINT "UQ_aac71265d6e20efe067757b30fb"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_68b808a9039892c61219f868f2"`);
  }
}

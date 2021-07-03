import { MigrationInterface, QueryRunner } from 'typeorm';

export class DisallowNullRelation1625334517776 implements MigrationInterface {
  name = 'DisallowNullRelation1625334517776';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "episodes" DROP CONSTRAINT "FK_b0fe3a040103f69ebdee8438c73"`,
    );
    await queryRunner.query(
      `ALTER TABLE "episodes" DROP CONSTRAINT "UQ_aac71265d6e20efe067757b30fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "episodes" ALTER COLUMN "seriesId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "episodes" ADD CONSTRAINT "UQ_aac71265d6e20efe067757b30fb" UNIQUE ("seriesId", "name", "sort")`,
    );
    await queryRunner.query(
      `ALTER TABLE "episodes" ADD CONSTRAINT "FK_b0fe3a040103f69ebdee8438c73" FOREIGN KEY ("seriesId") REFERENCES "series"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "episodes" DROP CONSTRAINT "FK_b0fe3a040103f69ebdee8438c73"`,
    );
    await queryRunner.query(
      `ALTER TABLE "episodes" DROP CONSTRAINT "UQ_aac71265d6e20efe067757b30fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "episodes" ALTER COLUMN "seriesId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "episodes" ADD CONSTRAINT "UQ_aac71265d6e20efe067757b30fb" UNIQUE ("name", "seriesId", "sort")`,
    );
    await queryRunner.query(
      `ALTER TABLE "episodes" ADD CONSTRAINT "FK_b0fe3a040103f69ebdee8438c73" FOREIGN KEY ("seriesId") REFERENCES "series"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

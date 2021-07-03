import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExtendEpisode1625315406912 implements MigrationInterface {
  name = 'ExtendEpisode1625315406912';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "episodes" ADD "sort" integer`);
    await queryRunner.query(`ALTER TABLE "episodes" ADD "air_date" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "episodes" DROP COLUMN "air_date"`);
    await queryRunner.query(`ALTER TABLE "episodes" DROP COLUMN "sort"`);
  }
}

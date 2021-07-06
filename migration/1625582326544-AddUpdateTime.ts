import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUpdateTime1625582326544 implements MigrationInterface {
  name = 'AddUpdateTime1625582326544';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "series" ADD "updated" TIMESTAMP DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "series" ADD "version" integer`);
    await queryRunner.query(
      `ALTER TABLE "episodes" ADD "updated" TIMESTAMP DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "episodes" ADD "version" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "episodes" DROP COLUMN "version"`);
    await queryRunner.query(`ALTER TABLE "episodes" DROP COLUMN "updated"`);
    await queryRunner.query(`ALTER TABLE "series" DROP COLUMN "version"`);
    await queryRunner.query(`ALTER TABLE "series" DROP COLUMN "updated"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1625290959379 implements MigrationInterface {
  name = 'Migration1625290959379';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "series" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "name_cn" character varying, "description" character varying, "air_date" TIMESTAMP, "episodes" integer, CONSTRAINT "PK_e725676647382eb54540d7128ba" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "series"`);
  }
}

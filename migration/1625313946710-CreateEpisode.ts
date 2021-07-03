import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEpisode1625313946710 implements MigrationInterface {
  name = 'CreateEpisode1625313946710';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "episodes" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "name_cn" character varying, "seriesId" integer, CONSTRAINT "PK_6a003fda8b0473fffc39cb831c7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "series" DROP COLUMN "episodes"`);
    await queryRunner.query(
      `ALTER TABLE "episodes" ADD CONSTRAINT "FK_b0fe3a040103f69ebdee8438c73" FOREIGN KEY ("seriesId") REFERENCES "series"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "episodes" DROP CONSTRAINT "FK_b0fe3a040103f69ebdee8438c73"`,
    );
    await queryRunner.query(`ALTER TABLE "series" ADD "episodes" integer`);
    await queryRunner.query(`DROP TABLE "episodes"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExtendBangumiIDColumn1625498475254 implements MigrationInterface {
  name = 'ExtendBangumiIDColumn1625498475254';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_68b808a9039892c61219f868f2"`);
    await queryRunner.query(`ALTER TABLE "series" ADD "bangumi_id" integer`);
    await queryRunner.query(`ALTER TABLE "episodes" ADD "bangumi_id" integer`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_3a69ce119b17513f797c8086b2" ON "series" ("bangumi_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_898cea99037ece618a448f2cd9" ON "episodes" ("bangumi_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_898cea99037ece618a448f2cd9"`);
    await queryRunner.query(`DROP INDEX "IDX_3a69ce119b17513f797c8086b2"`);
    await queryRunner.query(`ALTER TABLE "episodes" DROP COLUMN "bangumi_id"`);
    await queryRunner.query(`ALTER TABLE "series" DROP COLUMN "bangumi_id"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_68b808a9039892c61219f868f2" ON "series" ("name") `,
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class SpecifyFileColumnLength1626414922367
  implements MigrationInterface
{
  name = 'SpecifyFileColumnLength1626414922367';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subtitle_file" DROP COLUMN "filename"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subtitle_file" ADD "filename" character varying(1024) NOT NULL`,
    );
    await queryRunner.query(`DROP INDEX "IDX_b8f0fd52fc4e6abd890896a938"`);
    await queryRunner.query(`ALTER TABLE "subtitle_file" DROP COLUMN "sha1"`);
    await queryRunner.query(
      `ALTER TABLE "subtitle_file" ADD "sha1" character varying(40) NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b8f0fd52fc4e6abd890896a938" ON "subtitle_file" ("sha1") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_b8f0fd52fc4e6abd890896a938"`);
    await queryRunner.query(`ALTER TABLE "subtitle_file" DROP COLUMN "sha1"`);
    await queryRunner.query(
      `ALTER TABLE "subtitle_file" ADD "sha1" character varying NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b8f0fd52fc4e6abd890896a938" ON "subtitle_file" ("sha1") `,
    );
    await queryRunner.query(
      `ALTER TABLE "subtitle_file" DROP COLUMN "filename"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subtitle_file" ADD "filename" character varying NOT NULL`,
    );
  }
}

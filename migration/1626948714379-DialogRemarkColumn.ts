import { MigrationInterface, QueryRunner } from 'typeorm';

export class DialogRemarkColumn1626948714379 implements MigrationInterface {
  name = 'DialogRemarkColumn1626948714379';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subtitle_file" ADD "remark" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "subtitle_file" DROP COLUMN "remark"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSubtitleFileTable1625726799939
  implements MigrationInterface
{
  name = 'CreateSubtitleFileTable1625726799939';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "dialogs" DROP CONSTRAINT "FK_5c4eff6e60e2bc427373f0642e3"`,
    );
    await queryRunner.query(
      `CREATE TABLE "subtitle_file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" character varying NOT NULL, "sha1" character varying NOT NULL, "create" TIMESTAMP NOT NULL DEFAULT now(), "seriesId" integer NOT NULL, "episodeId" integer, CONSTRAINT "PK_4bf312864a5c59897ac1db405bf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b8f0fd52fc4e6abd890896a938" ON "subtitle_file" ("sha1") `,
    );
    await queryRunner.query(`ALTER TABLE "dialogs" DROP COLUMN "filename"`);
    await queryRunner.query(`ALTER TABLE "dialogs" DROP COLUMN "ownerId"`);
    await queryRunner.query(
      `ALTER TABLE "dialogs" ADD "version" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "dialogs" ADD "fileId" uuid NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "subtitle_file" ADD CONSTRAINT "FK_40cdceb9aa68ad980b3251ca6dd" FOREIGN KEY ("seriesId") REFERENCES "series"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subtitle_file" ADD CONSTRAINT "FK_e862b7f75b039b6176d90788ce7" FOREIGN KEY ("episodeId") REFERENCES "episodes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dialogs" ADD CONSTRAINT "FK_3d6b3a9b1cfb92a3d23b24e6cdf" FOREIGN KEY ("fileId") REFERENCES "subtitle_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "dialogs" DROP CONSTRAINT "FK_3d6b3a9b1cfb92a3d23b24e6cdf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subtitle_file" DROP CONSTRAINT "FK_e862b7f75b039b6176d90788ce7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subtitle_file" DROP CONSTRAINT "FK_40cdceb9aa68ad980b3251ca6dd"`,
    );
    await queryRunner.query(`ALTER TABLE "dialogs" DROP COLUMN "fileId"`);
    await queryRunner.query(`ALTER TABLE "dialogs" DROP COLUMN "version"`);
    await queryRunner.query(
      `ALTER TABLE "dialogs" ADD "ownerId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "dialogs" ADD "filename" character varying`,
    );
    await queryRunner.query(`DROP INDEX "IDX_b8f0fd52fc4e6abd890896a938"`);
    await queryRunner.query(`DROP TABLE "subtitle_file"`);
    await queryRunner.query(
      `ALTER TABLE "dialogs" ADD CONSTRAINT "FK_5c4eff6e60e2bc427373f0642e3" FOREIGN KEY ("ownerId") REFERENCES "episodes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

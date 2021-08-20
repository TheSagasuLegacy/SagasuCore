import { MigrationInterface, QueryRunner } from 'typeorm';

export class RelateUserToDialogAndFile1629480218328
  implements MigrationInterface
{
  name = 'RelateUserToDialogAndFile1629480218328';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."subtitle_file" DROP CONSTRAINT "FK_40cdceb9aa68ad980b3251ca6dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."subtitle_file" DROP CONSTRAINT "FK_e862b7f75b039b6176d90788ce7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."dialogs" DROP CONSTRAINT "FK_3d6b3a9b1cfb92a3d23b24e6cdf"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_40cdceb9aa68ad980b3251ca6d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3d6b3a9b1cfb92a3d23b24e6cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."subtitle_file" RENAME COLUMN "seriesId" TO "series_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."subtitle_file" RENAME COLUMN "episodeId" TO "episode_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."subtitle_file" ADD "user_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."dialogs" RENAME COLUMN "fileId" TO "file_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."dialogs" ADD "user_id" integer`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f6e18d5d9a646e1513286df43e" ON "public"."subtitle_file" ("series_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9a5794f8dd5d778a44e86b481c" ON "public"."dialogs" ("file_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."subtitle_file" ADD CONSTRAINT "FK_f6e18d5d9a646e1513286df43e3" FOREIGN KEY ("series_id") REFERENCES "series"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."subtitle_file" ADD CONSTRAINT "FK_eaf6d56e250804be76224d19b21" FOREIGN KEY ("episode_id") REFERENCES "episodes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."subtitle_file" ADD CONSTRAINT "FK_5425642906dbb854ba1857d64f1" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."dialogs" ADD CONSTRAINT "FK_9a5794f8dd5d778a44e86b481cf" FOREIGN KEY ("file_id") REFERENCES "subtitle_file"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."dialogs" ADD CONSTRAINT "FK_5f0157932d1363289ec973e268c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."dialogs" DROP CONSTRAINT "FK_5f0157932d1363289ec973e268c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."dialogs" DROP CONSTRAINT "FK_9a5794f8dd5d778a44e86b481cf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."subtitle_file" DROP CONSTRAINT "FK_5425642906dbb854ba1857d64f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."subtitle_file" DROP CONSTRAINT "FK_eaf6d56e250804be76224d19b21"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."subtitle_file" DROP CONSTRAINT "FK_f6e18d5d9a646e1513286df43e3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9a5794f8dd5d778a44e86b481c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f6e18d5d9a646e1513286df43e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."dialogs" DROP COLUMN "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."subtitle_file" RENAME COLUMN "series_id" TO "seriesId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."subtitle_file" RENAME COLUMN "episode_id" TO "episodeId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."subtitle_file" DROP COLUMN "user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."dialogs" RENAME COLUMN "file_id" TO "fileId"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d6b3a9b1cfb92a3d23b24e6cd" ON "public"."dialogs" ("fileId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_40cdceb9aa68ad980b3251ca6d" ON "public"."subtitle_file" ("seriesId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."dialogs" ADD CONSTRAINT "FK_3d6b3a9b1cfb92a3d23b24e6cdf" FOREIGN KEY ("fileId") REFERENCES "subtitle_file"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."subtitle_file" ADD CONSTRAINT "FK_e862b7f75b039b6176d90788ce7" FOREIGN KEY ("episodeId") REFERENCES "episodes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."subtitle_file" ADD CONSTRAINT "FK_40cdceb9aa68ad980b3251ca6dd" FOREIGN KEY ("seriesId") REFERENCES "series"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class ApplyCasadeRules1628613994989 implements MigrationInterface {
  name = 'ApplyCasadeRules1628613994989';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."episodes" DROP CONSTRAINT "FK_b0fe3a040103f69ebdee8438c73"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."dialogs" DROP CONSTRAINT "FK_3d6b3a9b1cfb92a3d23b24e6cdf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."episodes" ADD CONSTRAINT "FK_b0fe3a040103f69ebdee8438c73" FOREIGN KEY ("seriesId") REFERENCES "series"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."dialogs" ADD CONSTRAINT "FK_3d6b3a9b1cfb92a3d23b24e6cdf" FOREIGN KEY ("fileId") REFERENCES "subtitle_file"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_roles" ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."dialogs" DROP CONSTRAINT "FK_3d6b3a9b1cfb92a3d23b24e6cdf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."episodes" DROP CONSTRAINT "FK_b0fe3a040103f69ebdee8438c73"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_roles" ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."dialogs" ADD CONSTRAINT "FK_3d6b3a9b1cfb92a3d23b24e6cdf" FOREIGN KEY ("fileId") REFERENCES "subtitle_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."episodes" ADD CONSTRAINT "FK_b0fe3a040103f69ebdee8438c73" FOREIGN KEY ("seriesId") REFERENCES "series"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

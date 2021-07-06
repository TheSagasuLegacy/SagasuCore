import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDialogTable1625563725527 implements MigrationInterface {
  name = 'CreateDialogTable1625563725527';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "dialogs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying NOT NULL, "begin" integer NOT NULL, "end" integer NOT NULL, "filename" character varying, "updated" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" integer NOT NULL, CONSTRAINT "PK_75ffe676a97ca2eb5510ec88b11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "dialogs" ADD CONSTRAINT "FK_5c4eff6e60e2bc427373f0642e3" FOREIGN KEY ("ownerId") REFERENCES "episodes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "dialogs" DROP CONSTRAINT "FK_5c4eff6e60e2bc427373f0642e3"`,
    );
    await queryRunner.query(`DROP TABLE "dialogs"`);
  }
}

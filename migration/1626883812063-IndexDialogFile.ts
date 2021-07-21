import { MigrationInterface, QueryRunner } from 'typeorm';

export class IndexDialogFile1626883812063 implements MigrationInterface {
  name = 'IndexDialogFile1626883812063';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_3d6b3a9b1cfb92a3d23b24e6cd" ON "dialogs" ("fileId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_3d6b3a9b1cfb92a3d23b24e6cd"`);
  }
}

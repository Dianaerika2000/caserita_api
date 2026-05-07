import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveDescriptionFromCategories1778121342810 implements MigrationInterface {
  name = 'RemoveDescriptionFromCategories1778121342810';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "FK_categories_parent"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_categories_parent_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_categories_deleted_at"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_categories_name_parent"`);
    await queryRunner.query(
      `ALTER TABLE "categories" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "FK_88cea2dc9c31951d06437879b40" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "FK_88cea2dc9c31951d06437879b40"`,
    );
    await queryRunner.query(`ALTER TABLE "categories" ADD "description" text`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_categories_name_parent" ON "categories" ("name", "parent_id") WHERE (deleted_at IS NULL)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_categories_deleted_at" ON "categories" ("deleted_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_categories_parent_id" ON "categories" ("parent_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "FK_categories_parent" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }
}

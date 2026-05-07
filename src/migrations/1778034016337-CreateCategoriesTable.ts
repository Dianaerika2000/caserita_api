import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCategoriesTable1778034016337 implements MigrationInterface {
  name = 'CreateCategoriesTable1778034016337';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE "categories" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "name" character varying(100) NOT NULL,
      "description" text,
      "isActive" boolean NOT NULL DEFAULT true,
      "parent_id" uuid,
      "created_at" TIMESTAMP NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
      "deleted_at" TIMESTAMP,
      CONSTRAINT "PK_categories_id" PRIMARY KEY ("id")
    )
  `);

    await queryRunner.query(`
    ALTER TABLE "categories"
    ADD CONSTRAINT "FK_categories_parent"
    FOREIGN KEY ("parent_id")
    REFERENCES "categories"("id")
    ON DELETE SET NULL
  `);

    await queryRunner.query(`
    CREATE INDEX "IDX_categories_parent_id"
    ON "categories" ("parent_id")
  `);

    await queryRunner.query(`
    CREATE INDEX "IDX_categories_deleted_at"
    ON "categories" ("deleted_at")
  `);

    await queryRunner.query(`
    CREATE UNIQUE INDEX "UQ_categories_name_parent"
    ON "categories" ("name", "parent_id")
    WHERE "deleted_at" IS NULL
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_categories_name_parent"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_categories_deleted_at"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_categories_parent_id"`);

    await queryRunner.query(`
    ALTER TABLE "categories"
    DROP CONSTRAINT IF EXISTS "FK_categories_parent"
  `);

    await queryRunner.query(`DROP TABLE IF EXISTS "categories"`);
  }
  //   await queryRunner.query(
  //     `CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "description" text, "isActive" boolean NOT NULL DEFAULT true, "parent_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
  //   );
  //   await queryRunner.query(
  //     `ALTER TABLE "categories" ADD CONSTRAINT "FK_88cea2dc9c31951d06437879b40" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
  //   );
  //   // índices para mejorar rendimiento
  //   await queryRunner.query(
  //     `    CREATE UNIQUE INDEX "UQ_categories_name_parent"
  //   ON "categories" ("name", "parent_id")
  //   WHERE "deleted_at" IS NULL;`,
  //   );
  //   await queryRunner.query(
  //     `CREATE INDEX "IDX_categories_deleted_at" ON "categories" ("deleted_at")`,
  //   );
  // }

  // public async down(queryRunner: QueryRunner): Promise<void> {
  //   await queryRunner.query(`DROP INDEX "IDX_categories_deleted_at"`);
  //   await queryRunner.query(`DROP INDEX "UQ_categories_name_parent"`);
  //   await queryRunner.query(
  //     `ALTER TABLE "categories" DROP CONSTRAINT "FK_88cea2dc9c31951d06437879b40"`,
  //   );
  //   await queryRunner.query(`DROP TABLE "categories"`);
  // }
}

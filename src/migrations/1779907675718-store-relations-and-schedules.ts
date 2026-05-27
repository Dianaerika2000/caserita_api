import { MigrationInterface, QueryRunner } from 'typeorm';

export class StoreRelationsAndSchedules1779907675718 implements MigrationInterface {
  name = 'StoreRelationsAndSchedules1779907675718';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "store_schedules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "day_of_week" "public"."store_schedules_day_of_week_enum" NOT NULL, "open_time" TIME, "close_time" TIME, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "store_id" uuid, CONSTRAINT "UQ_fe9ff9293fb58837cbbe79c0e0b" UNIQUE ("store_id", "day_of_week"), CONSTRAINT "PK_b2f9aa561cbdf88cdfef6ff4b2d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "stores" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "cellphone" character varying NOT NULL, "gallery_name" character varying NOT NULL, "store_number" character varying NOT NULL, "location_link" character varying, "status" "public"."stores_status_enum" NOT NULL DEFAULT 'ACTIVE', "payment_types" "public"."stores_payment_types_enum" array NOT NULL, "sale_types" "public"."stores_sale_types_enum" array NOT NULL, "has_delivery" boolean NOT NULL DEFAULT false, "verified" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "category_id" uuid NOT NULL, CONSTRAINT "UQ_4a946bd8ef9834431ade78d639d" UNIQUE ("email"), CONSTRAINT "PK_7aa6e7d71fa7acdd7ca43d7c9cb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_schedules" ADD CONSTRAINT "FK_e8507a4096c112ee74a56c14fcb" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "stores" ADD CONSTRAINT "FK_40abd374d12d7b19c471aa156cd" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "stores" DROP CONSTRAINT "FK_40abd374d12d7b19c471aa156cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "store_schedules" DROP CONSTRAINT "FK_e8507a4096c112ee74a56c14fcb"`,
    );
    await queryRunner.query(`DROP TABLE "stores"`);
    await queryRunner.query(`DROP TABLE "store_schedules"`);
  }
}

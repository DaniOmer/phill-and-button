import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialCreate1768762583727 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" TEXT NOT NULL,
        "description" TEXT,
        "price" NUMERIC(10,2) NOT NULL,
        "image_url" TEXT,
        "is_trending" BOOLEAN NOT NULL DEFAULT false,
        "stock" INTEGER NOT NULL DEFAULT 0,
        "category" TEXT,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "profiles" (
        "id" UUID PRIMARY KEY,
        "role" TEXT NOT NULL DEFAULT 'user',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "profiles" 
      ADD CONSTRAINT "FK_profiles_auth_users" 
      FOREIGN KEY ("id") REFERENCES auth.users("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "profiles" 
      ADD CONSTRAINT "CHK_profiles_role" 
      CHECK (role IN ('admin', 'user'))
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_products_is_trending" ON "products"("is_trending")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_products_category" ON "products"("category")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_products_created_at" ON "products"("created_at" DESC)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_products_created_at"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_products_category"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_products_is_trending"`);

    await queryRunner.query(
      `ALTER TABLE "profiles" DROP CONSTRAINT IF EXISTS "CHK_profiles_role"`
    );
    await queryRunner.query(
      `ALTER TABLE "profiles" DROP CONSTRAINT IF EXISTS "FK_profiles_auth_users"`
    );

    await queryRunner.query(`DROP TABLE IF EXISTS "profiles"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "products"`);
  }
}

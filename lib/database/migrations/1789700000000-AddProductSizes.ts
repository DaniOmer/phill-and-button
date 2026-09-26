import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Introduit le stock par taille :
 * - table product_sizes (une ligne par (produit, taille))
 * - colonne products.available_on_order (« disponible sur commande »)
 * - report du stock global existant sur la taille M
 * - suppression de la colonne products.stock (remplacée par le stock par taille)
 */
export class AddProductSizes1789700000000 implements MigrationInterface {
  name = "AddProductSizes1789700000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "product_sizes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "product_id" uuid NOT NULL,
        "size" text NOT NULL,
        "stock" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_product_sizes" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_product_sizes_product_size" UNIQUE ("product_id", "size"),
        CONSTRAINT "FK_product_sizes_product" FOREIGN KEY ("product_id")
          REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_product_sizes_product_id" ON "product_sizes"("product_id")
    `);

    await queryRunner.query(`
      ALTER TABLE "products"
      ADD COLUMN "available_on_order" boolean NOT NULL DEFAULT false
    `);

    // Reporter le stock global existant sur la taille M pour ne rien perdre.
    await queryRunner.query(`
      INSERT INTO "product_sizes" ("product_id", "size", "stock")
      SELECT "id", 'M', "stock" FROM "products"
    `);

    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "stock"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "products"
      ADD COLUMN "stock" integer NOT NULL DEFAULT 0
    `);

    // Restaurer le stock global à partir de la somme des tailles.
    await queryRunner.query(`
      UPDATE "products" p
      SET "stock" = COALESCE(
        (SELECT SUM(s."stock") FROM "product_sizes" s WHERE s."product_id" = p."id"),
        0
      )
    `);

    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN "available_on_order"`
    );
    await queryRunner.query(`DROP TABLE "product_sizes"`);
  }
}

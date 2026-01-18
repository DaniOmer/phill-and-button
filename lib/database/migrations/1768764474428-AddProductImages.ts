import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductImages1768764474428 implements MigrationInterface {
  name = "AddProductImages1768764474428";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Créer la table product_images
    await queryRunner.query(`
            CREATE TABLE "product_images" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "product_id" uuid NOT NULL,
                "url" text NOT NULL,
                "order_index" integer NOT NULL DEFAULT 0,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_product_images" PRIMARY KEY ("id")
            )
        `);

    // Ajouter la clé étrangère
    await queryRunner.query(`
            ALTER TABLE "product_images" 
            ADD CONSTRAINT "FK_product_images_product_id" 
            FOREIGN KEY ("product_id") 
            REFERENCES "products"("id") 
            ON DELETE CASCADE 
            ON UPDATE NO ACTION
        `);

    // Créer les index pour optimiser les requêtes
    await queryRunner.query(`
            CREATE INDEX "idx_product_images_product_id" 
            ON "product_images"("product_id")
        `);

    await queryRunner.query(`
            CREATE INDEX "idx_product_images_order_index" 
            ON "product_images"("product_id", "order_index")
        `);

    // Supprimer la colonne image_url de products
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN IF EXISTS "image_url"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Supprimer les index
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_product_images_order_index"`
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_product_images_product_id"`
    );

    // Supprimer la contrainte de clé étrangère
    await queryRunner.query(`
            ALTER TABLE "product_images" 
            DROP CONSTRAINT IF EXISTS "FK_product_images_product_id"
        `);

    // Restaurer la colonne image_url
    await queryRunner.query(`
            ALTER TABLE "products" 
            ADD COLUMN "image_url" text
        `);

    // Supprimer la table
    await queryRunner.query(`DROP TABLE IF EXISTS "product_images"`);
  }
}

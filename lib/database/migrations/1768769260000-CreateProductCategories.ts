import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductCategories1768769260000
  implements MigrationInterface
{
  name = "CreateProductCategories1768769260000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Créer la table product_categories
    await queryRunner.query(`
      CREATE TABLE "product_categories" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" text NOT NULL,
        "slug" text,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_product_categories" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_product_categories_name" UNIQUE ("name"),
        CONSTRAINT "UQ_product_categories_slug" UNIQUE ("slug")
      )
    `);

    // 2. Extraire les catégories distinctes depuis products.category
    const distinctCategories = await queryRunner.query(`
      SELECT DISTINCT category
      FROM products
      WHERE category IS NOT NULL AND category != ''
    `);

    // 3. Insérer ces catégories dans product_categories
    if (distinctCategories.length > 0) {
      for (const row of distinctCategories) {
        const categoryName = row.category;
        // Générer un slug à partir du nom
        const slug = categoryName
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
          .replace(/[^a-z0-9]+/g, "-") // Remplacer les caractères spéciaux par des tirets
          .replace(/^-+|-+$/g, ""); // Supprimer les tirets en début/fin

        // Vérifier si le slug existe déjà
        const existingSlug = await queryRunner.query(
          `SELECT id FROM product_categories WHERE slug = $1`,
          [slug]
        );

        let finalSlug = slug;
        if (existingSlug.length > 0) {
          // Ajouter un suffixe numérique si le slug existe
          let counter = 1;
          let uniqueSlug = `${slug}-${counter}`;
          while (
            (
              await queryRunner.query(
                `SELECT id FROM product_categories WHERE slug = $1`,
                [uniqueSlug]
              )
            ).length > 0
          ) {
            counter++;
            uniqueSlug = `${slug}-${counter}`;
          }
          finalSlug = uniqueSlug;
        }

        await queryRunner.query(
          `INSERT INTO product_categories (name, slug) VALUES ($1, $2)`,
          [categoryName, finalSlug]
        );
      }
    }

    // 4. Ajouter la colonne category_id à products
    await queryRunner.query(`
      ALTER TABLE "products" 
      ADD COLUMN "category_id" uuid
    `);

    // 5. Mettre à jour products.category_id en joignant avec product_categories sur le nom
    await queryRunner.query(`
      UPDATE products p
      SET category_id = pc.id
      FROM product_categories pc
      WHERE p.category = pc.name
    `);

    // 6. Créer l'index et la contrainte de clé étrangère
    await queryRunner.query(`
      CREATE INDEX "idx_products_category_id" 
      ON "products"("category_id")
    `);

    await queryRunner.query(`
      ALTER TABLE "products" 
      ADD CONSTRAINT "FK_products_category_id" 
      FOREIGN KEY ("category_id") 
      REFERENCES "product_categories"("id") 
      ON DELETE SET NULL 
      ON UPDATE NO ACTION
    `);

    // 7. Supprimer la colonne products.category
    await queryRunner.query(`
      ALTER TABLE "products" 
      DROP COLUMN IF EXISTS "category"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Restaurer la colonne category
    await queryRunner.query(`
      ALTER TABLE "products" 
      ADD COLUMN "category" text
    `);

    // 2. Remplir category depuis product_categories
    await queryRunner.query(`
      UPDATE products p
      SET category = pc.name
      FROM product_categories pc
      WHERE p.category_id = pc.id
    `);

    // 3. Supprimer la contrainte de clé étrangère
    await queryRunner.query(`
      ALTER TABLE "products" 
      DROP CONSTRAINT IF EXISTS "FK_products_category_id"
    `);

    // 4. Supprimer l'index
    await queryRunner.query(`
      DROP INDEX IF EXISTS "idx_products_category_id"
    `);

    // 5. Supprimer la colonne category_id
    await queryRunner.query(`
      ALTER TABLE "products" 
      DROP COLUMN IF EXISTS "category_id"
    `);

    // 6. Supprimer la table product_categories
    await queryRunner.query(`DROP TABLE IF EXISTS "product_categories"`);
  }
}

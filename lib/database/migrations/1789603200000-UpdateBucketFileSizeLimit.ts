import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Aligne la limite de taille du bucket Storage "product-images" sur la limite
 * applicative (10 Mo). Idempotent : crée le bucket s'il n'existe pas, sinon
 * met à jour sa limite et ses types MIME autorisés.
 */
export class UpdateBucketFileSizeLimit1789603200000
  implements MigrationInterface
{
  name = "UpdateBucketFileSizeLimit1789603200000";

  private readonly bucketId = "product-images";
  private readonly tenMB = 10 * 1024 * 1024; // 10485760
  private readonly fiveMB = 5 * 1024 * 1024; // 5242880
  private readonly mimeTypes = ["image/jpeg", "image/png", "image/webp"];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
      VALUES ($1, $1, true, $2, $3)
      ON CONFLICT (id) DO UPDATE SET
        file_size_limit = EXCLUDED.file_size_limit,
        allowed_mime_types = EXCLUDED.allowed_mime_types
      `,
      [this.bucketId, this.tenMB, this.mimeTypes]
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      UPDATE storage.buckets
      SET file_size_limit = $2
      WHERE id = $1
      `,
      [this.bucketId, this.fiveMB]
    );
  }
}

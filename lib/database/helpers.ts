/**
 * Helpers pour transformer les entités TypeORM en format API
 * Convertit les Date en string et formate les relations
 */
import type { Product as ProductEntity } from "./entities/Product";
import type { ProductImage as ProductImageEntity } from "./entities/ProductImage";
import type { Product, ProductImage } from "@/types/product";

/**
 * Transforme une entité ProductImage TypeORM en format API
 */
function transformProductImage(
  image: ProductImageEntity,
  productId: string
): ProductImage {
  return {
    id: image.id,
    product_id: productId,
    url: image.url,
    order_index: image.order_index,
    created_at: image.created_at.toISOString(),
  };
}

/**
 * Transforme une entité Product TypeORM en format API
 */
export function transformProduct(product: ProductEntity): Product {
  // Trier les images par order_index
  const sortedImages = (product.images || [])
    .sort((a, b) => a.order_index - b.order_index)
    .map((img) => transformProductImage(img, product.id));

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price), // Convertir decimal en number
    images: sortedImages,
    is_trending: product.is_trending,
    stock: product.stock,
    category: product.category,
    created_at: product.created_at.toISOString(),
    updated_at: product.updated_at.toISOString(),
  };
}

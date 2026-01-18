import { getDataSource } from "./data-source";
import { Product } from "./entities/Product";
import { ProductCategory } from "./entities/ProductCategory";
import { Profile } from "./entities/Profile";

export { Product, ProductCategory, Profile } from "./entities";
export { getDataSource } from "./data-source";

/**
 * Récupère le repository Product
 */
export async function getProductRepository() {
  const dataSource = await getDataSource();
  return dataSource.getRepository(Product);
}

/**
 * Récupère le repository ProductCategory
 */
export async function getCategoryRepository() {
  const dataSource = await getDataSource();
  return dataSource.getRepository(ProductCategory);
}

/**
 * Récupère le repository Profile
 */
export async function getProfileRepository() {
  const dataSource = await getDataSource();
  return dataSource.getRepository(Profile);
}

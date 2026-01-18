import { getDataSource } from "./data-source";
import { Product } from "./entities/Product";
import { Profile } from "./entities/Profile";

export { Product, Profile } from "./entities";
export { getDataSource } from "./data-source";

/**
 * Récupère le repository Product
 */
export async function getProductRepository() {
  const dataSource = await getDataSource();
  return dataSource.getRepository(Product);
}

/**
 * Récupère le repository Profile
 */
export async function getProfileRepository() {
  const dataSource = await getDataSource();
  return dataSource.getRepository(Profile);
}

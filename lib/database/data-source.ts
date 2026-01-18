import "reflect-metadata";
import { DataSource } from "typeorm";
import { join } from "path";
import { Product } from "./entities/Product";
import { ProductImage } from "./entities/ProductImage";
import { ProductCategory } from "./entities/ProductCategory";
import { Profile } from "./entities/Profile";

// Extraire les informations de connexion depuis l'URL Supabase
function getConnectionConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined");
  }

  // Extraire le project ref de l'URL (ex: https://akmvpnidhxsdknjdslki.supabase.co)
  const projectRef = supabaseUrl
    .replace("https://", "")
    .replace(".supabase.co", "");

  return {
    host: `db.${projectRef}.supabase.co`,
    port: 5432,
    username: "postgres",
    password: process.env.SUPABASE_DB_PASSWORD,
    database: "postgres",
  };
}

let AppDataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (AppDataSource && AppDataSource.isInitialized) {
    return AppDataSource;
  }

  const config = getConnectionConfig();

  AppDataSource = new DataSource({
    type: "postgres",
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: config.database,
    ssl: {
      rejectUnauthorized: false,
    },
    entities: [Product, ProductImage, ProductCategory, Profile],
    synchronize: false, // Ne jamais mettre true en production !
    logging: process.env.NODE_ENV === "development",
  });

  await AppDataSource.initialize();
  return AppDataSource;
}

// Pour les migrations CLI - Configuration utilisée par TypeORM CLI
function getDataSourceConfigForCLI() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined");
  }

  const projectRef = supabaseUrl
    .replace("https://", "")
    .replace(".supabase.co", "");

  if (!process.env.SUPABASE_DB_PASSWORD) {
    throw new Error("SUPABASE_DB_PASSWORD is not defined");
  }

  return {
    type: "postgres" as const,
    host: `db.${projectRef}.supabase.co`,
    port: 5432,
    username: "postgres",
    password: process.env.SUPABASE_DB_PASSWORD,
    database: "postgres",
    ssl: {
      rejectUnauthorized: false,
    },
    entities: [join(process.cwd(), "lib", "database", "entities", "*.{ts,js}")],
    migrations: [
      join(process.cwd(), "lib", "database", "migrations", "*.{ts,js}"),
    ],
    synchronize: false,
    logging: process.env.NODE_ENV === "development",
  };
}

// Export pour TypeORM CLI
export const dataSourceOptions = getDataSourceConfigForCLI();

export default new DataSource(dataSourceOptions);

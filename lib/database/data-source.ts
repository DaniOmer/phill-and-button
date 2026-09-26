import "reflect-metadata";
import { DataSource } from "typeorm";
import { join } from "path";
import { Product } from "./entities/Product";
import { ProductImage } from "./entities/ProductImage";
import { ProductSize } from "./entities/ProductSize";
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

  // En serverless (Vercel), DATABASE_URL doit pointer vers le pooler Supabase
  // (aws-0-<region>.pooler.supabase.com, IPv4). La connexion directe
  // db.<ref>.supabase.co est IPv6-only et injoignable depuis Vercel.
  // À défaut de DATABASE_URL (dev local / CLI), on dérive la connexion directe.
  const databaseUrl = process.env.DATABASE_URL;

  const commonOptions = {
    type: "postgres" as const,
    ssl: {
      rejectUnauthorized: false,
    },
    entities: [Product, ProductImage, ProductSize, ProductCategory, Profile],
    synchronize: false, // Ne jamais mettre true en production !
    logging: process.env.NODE_ENV === "development",
  };

  AppDataSource = new DataSource(
    databaseUrl
      ? { ...commonOptions, url: databaseUrl }
      : { ...commonOptions, ...getConnectionConfig() }
  );

  await AppDataSource.initialize();
  return AppDataSource;
}

// Pour les migrations CLI - Configuration utilisée par TypeORM CLI
function getDataSourceConfigForCLI() {
  const entities = [
    join(process.cwd(), "lib", "database", "entities", "*.{ts,js}"),
  ];
  const migrations = [
    join(process.cwd(), "lib", "database", "migrations", "*.{ts,js}"),
  ];
  const common = {
    type: "postgres" as const,
    ssl: { rejectUnauthorized: false },
    entities,
    migrations,
    synchronize: false,
    logging: process.env.NODE_ENV === "development",
  };

  // Priorité au pooler (DATABASE_URL) : la connexion directe
  // db.<ref>.supabase.co est IPv6-only / injoignable depuis beaucoup d'environnements.
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    return { ...common, url: databaseUrl };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined");
  }
  if (!process.env.SUPABASE_DB_PASSWORD) {
    throw new Error("SUPABASE_DB_PASSWORD is not defined");
  }
  const projectRef = supabaseUrl
    .replace("https://", "")
    .replace(".supabase.co", "");

  return {
    ...common,
    host: `db.${projectRef}.supabase.co`,
    port: 5432,
    username: "postgres",
    password: process.env.SUPABASE_DB_PASSWORD,
    database: "postgres",
  };
}

// Export pour TypeORM CLI
export const dataSourceOptions = getDataSourceConfigForCLI();

export default new DataSource(dataSourceOptions);

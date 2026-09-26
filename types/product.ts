import { z } from "zod";
import { SIZE_ORDER } from "@/lib/sizes";

/**
 * Schéma d'une taille avec son stock.
 */
export const sizeStockSchema = z.object({
  size: z.enum(SIZE_ORDER),
  stock: z
    .number()
    .int()
    .nonnegative("Le stock doit être positif ou nul"),
});

/**
 * Schéma Zod pour la validation des produits (API)
 */
export const productSchema = z.object({
  name: z
    .string()
    .min(3, "Le nom doit contenir au moins 3 caractères")
    .max(100),
  description: z.string().max(1000).optional().nullable(),
  price: z.number().positive("Le prix doit être positif"),
  image_urls: z
    .array(z.string().url("URL invalide"))
    .max(10, "Maximum 10 images par produit")
    .default([]),
  is_trending: z.boolean().default(false),
  available_on_order: z.boolean().default(false),
  sizes: z.array(sizeStockSchema).default([]),
  category_id: z.string().uuid().optional().nullable(),
});

/**
 * Schéma pour le formulaire (sans defaults pour éviter les conflits de types)
 */
export const productFormSchema = z.object({
  name: z
    .string()
    .min(3, "Le nom doit contenir au moins 3 caractères")
    .max(100),
  description: z.string().max(1000).optional().nullable(),
  price: z.number().positive("Le prix doit être positif"),
  image_urls: z
    .array(z.string().url("URL invalide"))
    .max(10, "Maximum 10 images par produit"),
  is_trending: z.boolean(),
  available_on_order: z.boolean(),
  sizes: z.array(sizeStockSchema),
  category_id: z.string().uuid().optional().nullable(),
});

export const createProductSchema = productSchema;

export const updateProductSchema = productSchema.partial().extend({
  id: z.string().uuid(),
});

/**
 * Types TypeScript dérivés des schémas Zod
 */
export type ProductInput = z.infer<typeof productSchema>;
export type ProductFormInput = z.infer<typeof productFormSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

/**
 * Type pour une image de produit
 */
export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  order_index: number;
  created_at: string;
}

/**
 * Stock d'une taille donnée pour un produit.
 */
export interface ProductSizeStock {
  size: string;
  stock: number;
}

/**
 * Type complet du produit (avec id et timestamps)
 */
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  images: ProductImage[];
  is_trending: boolean;
  available_on_order: boolean;
  sizes: ProductSizeStock[];
  /** Stock total, calculé comme la somme des stocks par taille. */
  stock: number;
  category: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Type pour le profil utilisateur
 */
export interface Profile {
  id: string;
  role: "admin" | "user";
  created_at: string;
}

import { z } from 'zod'

/**
 * Schéma Zod pour la validation des produits (API)
 */
export const productSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères').max(100),
  description: z.string().max(1000).optional().nullable(),
  price: z.number().positive('Le prix doit être positif'),
  image_url: z.string().url('URL invalide').optional().nullable(),
  is_trending: z.boolean().default(false),
  stock: z.number().int().nonnegative('Le stock doit être positif ou nul').default(0),
  category: z.string().optional().nullable(),
})

/**
 * Schéma pour le formulaire (sans defaults pour éviter les conflits de types)
 */
export const productFormSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères').max(100),
  description: z.string().max(1000).optional().nullable(),
  price: z.number().positive('Le prix doit être positif'),
  image_url: z.string().url('URL invalide').optional().nullable().or(z.literal('')),
  is_trending: z.boolean(),
  stock: z.number().int().nonnegative('Le stock doit être positif ou nul'),
  category: z.string().optional().nullable(),
})

export const createProductSchema = productSchema

export const updateProductSchema = productSchema.partial().extend({
  id: z.string().uuid(),
})

/**
 * Types TypeScript dérivés des schémas Zod
 */
export type ProductInput = z.infer<typeof productSchema>
export type ProductFormInput = z.infer<typeof productFormSchema>
export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>

/**
 * Type complet du produit (avec id et timestamps)
 */
export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  is_trending: boolean
  stock: number
  category: string | null
  created_at: string
  updated_at: string
}

/**
 * Type pour le profil utilisateur
 */
export interface Profile {
  id: string
  role: 'admin' | 'user'
  created_at: string
}

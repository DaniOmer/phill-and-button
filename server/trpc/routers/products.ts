/**
 * Router tRPC pour les produits
 * Contient les routes publiques et admin
 */
import { z } from 'zod'
import { router, publicProcedure, adminProcedure } from '../trpc'
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server'
import { createProductSchema, updateProductSchema } from '@/types/product'
import { TRPCError } from '@trpc/server'

export const productsRouter = router({
  /**
   * Route publique : récupère tous les produits
   */
  getAll: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const supabase = await createServerSupabaseClient()

      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (input?.category) {
        query = query.eq('category', input.category)
      }

      if (input?.search) {
        query = query.ilike('name', `%${input.search}%`)
      }

      const { data, error } = await query

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de la récupération des produits',
        })
      }

      return data
    }),

  /**
   * Route publique : récupère les produits tendance
   */
  getTrending: publicProcedure.query(async () => {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_trending', true)
      .order('created_at', { ascending: false })
      .limit(6)

    if (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erreur lors de la récupération des produits tendance',
      })
    }

    return data
  }),

  /**
   * Route publique : récupère un produit par ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const supabase = await createServerSupabaseClient()

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', input.id)
        .single()

      if (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Produit non trouvé',
        })
      }

      return data
    }),

  /**
   * Route publique : récupère les catégories uniques
   */
  getCategories: publicProcedure.query(async () => {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('products')
      .select('category')
      .not('category', 'is', null)

    if (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erreur lors de la récupération des catégories',
      })
    }

    // Extraire les catégories uniques
    const categories = [...new Set(data.map(p => p.category).filter(Boolean))]
    return categories as string[]
  }),

  /**
   * Route admin : créer un produit
   */
  create: adminProcedure
    .input(createProductSchema)
    .mutation(async ({ input }) => {
      const supabase = createServiceRoleClient()

      const { data, error } = await supabase
        .from('products')
        .insert(input)
        .select()
        .single()

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de la création du produit',
        })
      }

      return data
    }),

  /**
   * Route admin : mettre à jour un produit
   */
  update: adminProcedure
    .input(updateProductSchema)
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input
      const supabase = createServiceRoleClient()

      const { data, error } = await supabase
        .from('products')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de la mise à jour du produit',
        })
      }

      return data
    }),

  /**
   * Route admin : supprimer un produit
   */
  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const supabase = createServiceRoleClient()

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', input.id)

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de la suppression du produit',
        })
      }

      return { success: true }
    }),

  /**
   * Route admin : toggle tendance
   */
  toggleTrending: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const supabase = createServiceRoleClient()

      // Récupérer l'état actuel
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('is_trending')
        .eq('id', input.id)
        .single()

      if (fetchError) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Produit non trouvé',
        })
      }

      // Toggle
      const { data, error } = await supabase
        .from('products')
        .update({
          is_trending: !product.is_trending,
          updated_at: new Date().toISOString(),
        })
        .eq('id', input.id)
        .select()
        .single()

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erreur lors de la mise à jour du produit',
        })
      }

      return data
    }),

  /**
   * Route admin : upload d'image
   */
  uploadImage: adminProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileBase64: z.string(),
        contentType: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const supabase = createServiceRoleClient()

      // Convertir base64 en buffer
      const buffer = Buffer.from(input.fileBase64, 'base64')

      // Générer un nom unique
      const uniqueName = `${Date.now()}-${input.fileName}`

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(uniqueName, buffer, {
          contentType: input.contentType,
          upsert: false,
        })

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: "Erreur lors de l'upload de l'image",
        })
      }

      // Récupérer l'URL publique
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path)

      return { url: urlData.publicUrl }
    }),
})

export type ProductsRouter = typeof productsRouter

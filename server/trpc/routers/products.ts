/**
 * Router tRPC pour les produits
 * Contient les routes publiques et admin
 */
import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../trpc";
import {
  createServerSupabaseClient,
  createServiceRoleClient,
} from "@/lib/supabase/server";
import { createProductSchema, updateProductSchema } from "@/types/product";
import { TRPCError } from "@trpc/server";

export const productsRouter = router({
  /**
   * Route publique : récupère tous les produits
   */
  getAll: publicProcedure
    .input(
      z
        .object({
          category: z.string().optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const supabase = await createServerSupabaseClient();

      let query = supabase
        .from("products")
        .select(
          `
          *,
          product_images (
            id,
            url,
            order_index,
            created_at
          )
        `
        )
        .order("created_at", { ascending: false });

      if (input?.category) {
        query = query.eq("category", input.category);
      }

      if (input?.search) {
        query = query.ilike("name", `%${input.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de la récupération des produits",
        });
      }

      // Transformer les données pour avoir images triées par order_index
      return (data || []).map((product: any) => ({
        ...product,
        images: (product.product_images || [])
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((img: any) => ({
            id: img.id,
            product_id: product.id,
            url: img.url,
            order_index: img.order_index,
            created_at: img.created_at,
          })),
      }));
    }),

  /**
   * Route publique : récupère les produits tendance
   */
  getTrending: publicProcedure.query(async () => {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        product_images (
          id,
          url,
          order_index,
          created_at
        )
      `
      )
      .eq("is_trending", true)
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erreur lors de la récupération des produits tendance",
      });
    }

    // Transformer les données pour avoir images triées par order_index
    return (data || []).map((product: any) => ({
      ...product,
      images: (product.product_images || [])
        .sort((a: any, b: any) => a.order_index - b.order_index)
        .map((img: any) => ({
          id: img.id,
          product_id: product.id,
          url: img.url,
          order_index: img.order_index,
          created_at: img.created_at,
        })),
    }));
  }),

  /**
   * Route publique : récupère un produit par ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const supabase = await createServerSupabaseClient();

      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          product_images (
            id,
            url,
            order_index,
            created_at
          )
        `
        )
        .eq("id", input.id)
        .single();

      if (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Produit non trouvé",
        });
      }

      // Transformer les données pour avoir images triées par order_index
      return {
        ...data,
        images: ((data as any).product_images || [])
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((img: any) => ({
            id: img.id,
            product_id: data.id,
            url: img.url,
            order_index: img.order_index,
            created_at: img.created_at,
          })),
      };
    }),

  /**
   * Route publique : récupère les catégories uniques
   */
  getCategories: publicProcedure.query(async () => {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("products")
      .select("category")
      .not("category", "is", null);

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erreur lors de la récupération des catégories",
      });
    }

    // Extraire les catégories uniques
    const categories = [
      ...new Set(data.map((p) => p.category).filter(Boolean)),
    ];
    return categories as string[];
  }),

  /**
   * Route admin : créer un produit
   */
  create: adminProcedure
    .input(createProductSchema)
    .mutation(async ({ input }) => {
      const supabase = createServiceRoleClient();
      const { image_urls, ...productData } = input;

      // Créer le produit
      const { data: product, error: productError } = await supabase
        .from("products")
        .insert(productData)
        .select()
        .single();

      if (productError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de la création du produit",
        });
      }

      // Créer les images si fournies
      if (image_urls && image_urls.length > 0) {
        const imagesToInsert = image_urls.map((url, index) => ({
          product_id: product.id,
          url,
          order_index: index,
        }));

        const { error: imagesError } = await supabase
          .from("product_images")
          .insert(imagesToInsert);

        if (imagesError) {
          // Supprimer le produit si l'insertion des images échoue
          await supabase.from("products").delete().eq("id", product.id);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Erreur lors de la création des images",
          });
        }
      }

      // Récupérer le produit avec ses images
      const { data: productWithImages, error: fetchError } = await supabase
        .from("products")
        .select(
          `
          *,
          product_images (
            id,
            url,
            order_index,
            created_at
          )
        `
        )
        .eq("id", product.id)
        .single();

      if (fetchError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de la récupération du produit",
        });
      }

      return {
        ...productWithImages,
        images: ((productWithImages as any).product_images || [])
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((img: any) => ({
            id: img.id,
            product_id: product.id,
            url: img.url,
            order_index: img.order_index,
            created_at: img.created_at,
          })),
      };
    }),

  /**
   * Route admin : mettre à jour un produit
   */
  update: adminProcedure
    .input(updateProductSchema)
    .mutation(async ({ input }) => {
      const { id, image_urls, ...updateData } = input;
      const supabase = createServiceRoleClient();

      // Mettre à jour le produit
      const { error: productError } = await supabase
        .from("products")
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (productError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de la mise à jour du produit",
        });
      }

      // Si image_urls est fourni, mettre à jour les images
      if (image_urls !== undefined) {
        // Supprimer toutes les images existantes
        await supabase.from("product_images").delete().eq("product_id", id);

        // Créer les nouvelles images si fournies
        if (image_urls.length > 0) {
          const imagesToInsert = image_urls.map((url, index) => ({
            product_id: id,
            url,
            order_index: index,
          }));

          const { error: imagesError } = await supabase
            .from("product_images")
            .insert(imagesToInsert);

          if (imagesError) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Erreur lors de la mise à jour des images",
            });
          }
        }
      }

      // Récupérer le produit avec ses images
      const { data: productWithImages, error: fetchError } = await supabase
        .from("products")
        .select(
          `
          *,
          product_images (
            id,
            url,
            order_index,
            created_at
          )
        `
        )
        .eq("id", id)
        .single();

      if (fetchError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de la récupération du produit",
        });
      }

      return {
        ...productWithImages,
        images: ((productWithImages as any).product_images || [])
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((img: any) => ({
            id: img.id,
            product_id: id,
            url: img.url,
            order_index: img.order_index,
            created_at: img.created_at,
          })),
      };
    }),

  /**
   * Route admin : supprimer un produit
   */
  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const supabase = createServiceRoleClient();

      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", input.id);

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de la suppression du produit",
        });
      }

      return { success: true };
    }),

  /**
   * Route admin : toggle tendance
   */
  toggleTrending: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const supabase = createServiceRoleClient();

      // Récupérer l'état actuel
      const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("is_trending")
        .eq("id", input.id)
        .single();

      if (fetchError) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Produit non trouvé",
        });
      }

      // Toggle
      const { data, error } = await supabase
        .from("products")
        .update({
          is_trending: !product.is_trending,
          updated_at: new Date().toISOString(),
        })
        .eq("id", input.id)
        .select()
        .single();

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de la mise à jour du produit",
        });
      }

      return data;
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
      const supabase = createServiceRoleClient();

      // Convertir base64 en buffer
      const buffer = Buffer.from(input.fileBase64, "base64");

      // Générer un nom unique
      const uniqueName = `${Date.now()}-${input.fileName}`;

      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(uniqueName, buffer, {
          contentType: input.contentType,
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Erreur lors de l'upload de l'image",
        });
      }

      // Récupérer l'URL publique
      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(data.path);

      return { url: urlData.publicUrl };
    }),
});

export type ProductsRouter = typeof productsRouter;

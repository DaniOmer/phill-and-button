/**
 * Router tRPC pour les produits
 * Contient les routes publiques et admin
 */
import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../trpc";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { createProductSchema, updateProductSchema } from "@/types/product";
import { TRPCError } from "@trpc/server";
import { getProductRepository, getDataSource } from "@/lib/database";
import { Product, ProductImage } from "@/lib/database/entities";
import { ILike } from "typeorm";
import { transformProduct } from "@/lib/database/helpers";

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
      try {
        const repository = await getProductRepository();

        const where: any = {};
        if (input?.category) {
          where.category = input.category;
        }
        if (input?.search) {
          where.name = ILike(`%${input.search}%`);
        }

        const products = await repository.find({
          where,
          relations: ["images"],
          order: {
            created_at: "DESC",
            images: {
              order_index: "ASC",
            },
          },
        });

        return products.map(transformProduct);
      } catch (error) {
        console.error("Error in getAll:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Erreur lors de la récupération des produits",
        });
      }
    }),

  /**
   * Route publique : récupère les produits tendance
   */
  getTrending: publicProcedure.query(async () => {
    try {
      const repository = await getProductRepository();

      const products = await repository.find({
        where: { is_trending: true },
        relations: ["images"],
        order: {
          created_at: "DESC",
          images: {
            order_index: "ASC",
          },
        },
        take: 6,
      });

      return products.map(transformProduct);
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erreur lors de la récupération des produits tendance",
      });
    }
  }),

  /**
   * Route publique : récupère un produit par ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      try {
        const repository = await getProductRepository();

        const product = await repository.findOne({
          where: { id: input.id },
          relations: ["images"],
          order: {
            images: {
              order_index: "ASC",
            },
          },
        });

        if (!product) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Produit non trouvé",
          });
        }

        return transformProduct(product);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de la récupération du produit",
        });
      }
    }),

  /**
   * Route publique : récupère les catégories uniques
   */
  getCategories: publicProcedure.query(async () => {
    try {
      const repository = await getProductRepository();

      const products = await repository
        .createQueryBuilder("product")
        .select("DISTINCT product.category", "category")
        .where("product.category IS NOT NULL")
        .getRawMany();

      const categories = products
        .map((p) => p.category)
        .filter((cat): cat is string => Boolean(cat));

      return [...new Set(categories)];
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erreur lors de la récupération des catégories",
      });
    }
  }),

  /**
   * Route admin : créer un produit
   */
  create: adminProcedure
    .input(createProductSchema)
    .mutation(async ({ input }) => {
      try {
        const repository = await getProductRepository();
        const { image_urls = [], ...productData } = input;

        // Créer les images si fournies
        const images =
          image_urls.length > 0
            ? image_urls.map((url, index) =>
                repository.manager.create(ProductImage, {
                  url,
                  order_index: index,
                })
              )
            : [];

        // Créer le produit avec les images
        const product = repository.create({
          ...productData,
          images,
        });

        // Sauvegarder (la cascade créera automatiquement les images)
        const savedProduct = await repository.save(product);

        // Recharger avec les relations pour avoir toutes les données
        const productWithImages = await repository.findOne({
          where: { id: savedProduct.id },
          relations: ["images"],
          order: {
            images: {
              order_index: "ASC",
            },
          },
        });

        if (!productWithImages) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Erreur lors de la récupération du produit",
          });
        }

        return transformProduct(productWithImages);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de la création du produit",
        });
      }
    }),

  /**
   * Route admin : mettre à jour un produit
   */
  update: adminProcedure
    .input(updateProductSchema)
    .mutation(async ({ input }) => {
      try {
        const repository = await getProductRepository();
        const dataSource = await getDataSource();
        const imageRepository = dataSource.getRepository(ProductImage);
        const { id, image_urls, ...updateData } = input;

        // Vérifier que le produit existe
        const existingProduct = await repository.findOne({
          where: { id },
        });

        if (!existingProduct) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Produit non trouvé",
          });
        }

        // Mettre à jour le produit
        await repository.update(id, updateData);

        // Si image_urls est fourni, mettre à jour les images
        if (image_urls !== undefined) {
          // Supprimer toutes les images existantes
          await imageRepository.delete({ product_id: id });

          // Créer les nouvelles images si fournies
          if (image_urls.length > 0) {
            const imagesToInsert = image_urls.map((url, index) =>
              imageRepository.create({
                product_id: id,
                url,
                order_index: index,
              })
            );
            await imageRepository.save(imagesToInsert);
          }
        }

        // Recharger le produit avec ses images
        const productWithImages = await repository.findOne({
          where: { id },
          relations: ["images"],
          order: {
            images: {
              order_index: "ASC",
            },
          },
        });

        if (!productWithImages) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Erreur lors de la récupération du produit",
          });
        }

        return transformProduct(productWithImages);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de la mise à jour du produit",
        });
      }
    }),

  /**
   * Route admin : supprimer un produit
   */
  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      try {
        const repository = await getProductRepository();

        // La cascade supprimera automatiquement les images
        const result = await repository.delete(input.id);

        if (result.affected === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Produit non trouvé",
          });
        }

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de la suppression du produit",
        });
      }
    }),

  /**
   * Route admin : toggle tendance
   */
  toggleTrending: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      try {
        const repository = await getProductRepository();

        // Récupérer l'état actuel
        const product = await repository.findOne({
          where: { id: input.id },
          select: ["id", "is_trending"],
        });

        if (!product) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Produit non trouvé",
          });
        }

        // Toggle et sauvegarder
        product.is_trending = !product.is_trending;
        const updatedProduct = await repository.save(product);

        return {
          id: updatedProduct.id,
          is_trending: updatedProduct.is_trending,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de la mise à jour du produit",
        });
      }
    }),

  /**
   * Route admin : récupère les statistiques des produits
   */
  getStats: adminProcedure.query(async () => {
    try {
      const repository = await getProductRepository();

      // Compter tous les produits
      const totalProducts = await repository.count();

      // Compter les produits tendance
      const trendingProducts = await repository.count({
        where: { is_trending: true },
      });

      // Compter les produits en rupture de stock
      const outOfStock = await repository.count({
        where: { stock: 0 },
      });

      return {
        totalProducts,
        trendingProducts,
        outOfStock,
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Erreur lors de la récupération des statistiques",
      });
    }
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

/**
 * Router tRPC pour les catégories de produits
 * Contient les routes publiques et admin
 */
import { z } from "zod";
import { router, publicProcedure, adminProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { getCategoryRepository, getProductRepository } from "@/lib/database";

export const categoriesRouter = router({
  /**
   * Route publique : récupère toutes les catégories
   */
  getAll: publicProcedure.query(async () => {
    try {
      const repository = await getCategoryRepository();
      const categories = await repository.find({
        order: {
          name: "ASC",
        },
      });
      return categories;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Erreur lors de la récupération des catégories: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  }),

  /**
   * Route publique : récupère une catégorie par ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      try {
        const repository = await getCategoryRepository();
        const category = await repository.findOne({
          where: { id: input.id },
        });

        if (!category) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Catégorie non trouvée",
          });
        }

        return category;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Erreur lors de la récupération de la catégorie: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }
    }),

  /**
   * Route admin : crée une nouvelle catégorie
   */
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
        slug: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const repository = await getCategoryRepository();

        // Vérifier si une catégorie avec ce nom existe déjà
        const existing = await repository.findOne({
          where: { name: input.name },
        });

        if (existing) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Une catégorie avec ce nom existe déjà",
          });
        }

        // Générer un slug si non fourni
        let slug = input.slug;
        if (!slug) {
          slug = input.name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
            .replace(/[^a-z0-9]+/g, "-") // Remplacer les caractères spéciaux par des tirets
            .replace(/^-+|-+$/g, ""); // Supprimer les tirets en début/fin
        }

        // Vérifier si un slug existe déjà
        if (slug) {
          const existingSlug = await repository.findOne({
            where: { slug },
          });

          if (existingSlug) {
            // Ajouter un suffixe numérique si le slug existe
            let counter = 1;
            let uniqueSlug = `${slug}-${counter}`;
            while (
              await repository.findOne({
                where: { slug: uniqueSlug },
              })
            ) {
              counter++;
              uniqueSlug = `${slug}-${counter}`;
            }
            slug = uniqueSlug;
          }
        }

        const category = repository.create({
          name: input.name,
          slug,
        });

        const savedCategory = await repository.save(category);
        return savedCategory;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Erreur lors de la création de la catégorie: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }
    }),

  /**
   * Route admin : met à jour une catégorie
   */
  update: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(2).optional(),
        slug: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const repository = await getCategoryRepository();
        const { id, ...updateData } = input;

        const category = await repository.findOne({
          where: { id },
        });

        if (!category) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Catégorie non trouvée",
          });
        }

        // Vérifier si le nouveau nom existe déjà (si modifié)
        if (updateData.name && updateData.name !== category.name) {
          const existing = await repository.findOne({
            where: { name: updateData.name },
          });

          if (existing) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Une catégorie avec ce nom existe déjà",
            });
          }
        }

        // Générer un slug si le nom est modifié et qu'aucun slug n'est fourni
        if (updateData.name && !updateData.slug) {
          updateData.slug = updateData.name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

          // Vérifier l'unicité du slug
          if (updateData.slug) {
            const existingSlug = await repository.findOne({
              where: { slug: updateData.slug },
            });

            if (existingSlug && existingSlug.id !== id) {
              let counter = 1;
              let uniqueSlug = `${updateData.slug}-${counter}`;
              while (
                await repository.findOne({
                  where: { slug: uniqueSlug },
                })
              ) {
                counter++;
                uniqueSlug = `${updateData.slug}-${counter}`;
              }
              updateData.slug = uniqueSlug;
            }
          }
        }

        Object.assign(category, updateData);
        const updatedCategory = await repository.save(category);
        return updatedCategory;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Erreur lors de la mise à jour de la catégorie: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }
    }),

  /**
   * Route admin : supprime une catégorie
   */
  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      try {
        const categoryRepository = await getCategoryRepository();
        const productRepository = await getProductRepository();

        const category = await categoryRepository.findOne({
          where: { id: input.id },
        });

        if (!category) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Catégorie non trouvée",
          });
        }

        // Vérifier si des produits utilisent cette catégorie
        const productsCount = await productRepository.count({
          where: { category_id: input.id },
        });

        if (productsCount > 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: `Impossible de supprimer cette catégorie car ${productsCount} produit(s) l'utilise(nt)`,
          });
        }

        await categoryRepository.remove(category);
        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Erreur lors de la suppression de la catégorie: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }
    }),
});

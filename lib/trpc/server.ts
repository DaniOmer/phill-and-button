/**
 * Client tRPC pour les Server Components
 * Permet d'appeler les procedures tRPC côté serveur
 * Appelle directement le router sans passer par HTTP pour préserver l'authentification
 */
import "server-only";
import { appRouter } from "@/server/trpc/root";
import { createContext } from "@/server/trpc/context";

/**
 * Crée un caller tRPC avec le contexte d'authentification
 * Utilise directement le router sans passer par HTTP
 */
export async function createServerTRPC() {
  const context = await createContext();
  return appRouter.createCaller(context);
}

/**
 * Helper pour appeler les procedures tRPC depuis les Server Components
 * Appelle directement le router avec le contexte d'authentification
 */
export const serverTrpc = {
  products: {
    getById: async (input: { id: string }) => {
      const caller = await createServerTRPC();
      return caller.products.getById(input);
    },
    getStats: async () => {
      const caller = await createServerTRPC();
      return caller.products.getStats();
    },
    getAll: async (input?: { category?: string; search?: string }) => {
      const caller = await createServerTRPC();
      return caller.products.getAll(input);
    },
    getTrending: async () => {
      const caller = await createServerTRPC();
      return caller.products.getTrending();
    },
    getCategories: async () => {
      const caller = await createServerTRPC();
      return caller.products.getCategories();
    },
  },
};

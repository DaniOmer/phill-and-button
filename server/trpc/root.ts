/**
 * Root router tRPC
 * Combine tous les routers de l'application
 */
import { router } from './trpc'
import { productsRouter } from './routers/products'
import { categoriesRouter } from './routers/categories'

export const appRouter = router({
  products: productsRouter,
  categories: categoriesRouter,
})

export type AppRouter = typeof appRouter

/**
 * Configuration de base tRPC
 * Définit les procedures publiques et protégées
 */
import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import type { Context } from './context'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

export const router = t.router
export const publicProcedure = t.procedure

/**
 * Middleware pour vérifier l'authentification
 */
const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Vous devez être connecté pour effectuer cette action',
    })
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  })
})

/**
 * Middleware pour vérifier le rôle admin
 */
const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Vous devez être connecté pour effectuer cette action',
    })
  }
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Accès réservé aux administrateurs',
    })
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  })
})

export const protectedProcedure = t.procedure.use(isAuthenticated)
export const adminProcedure = t.procedure.use(isAdmin)

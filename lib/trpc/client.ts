/**
 * Client tRPC pour les composants React
 * Utilise React Query pour le caching et la synchronisation
 */
'use client'

import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@/server/trpc/root'

export const trpc = createTRPCReact<AppRouter>()

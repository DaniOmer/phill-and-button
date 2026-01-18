/**
 * Contexte tRPC avec authentification Supabase
 * Ce contexte est créé pour chaque requête tRPC
 */
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { Profile } from '@/types/product'

export interface Context {
  user: {
    id: string
    email: string | undefined
    role: 'admin' | 'user'
  } | null
}

/**
 * Crée le contexte tRPC avec les informations utilisateur
 */
export async function createContext(): Promise<Context> {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { user: null }
  }

  // Récupérer le profil avec le rôle
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single<Pick<Profile, 'role'>>()

  return {
    user: {
      id: user.id,
      email: user.email,
      role: profile?.role ?? 'user',
    },
  }
}

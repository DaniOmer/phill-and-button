/**
 * Hook personnalisé pour l'authentification
 * Gère la session utilisateur et le rôle admin
 */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  role: 'admin' | 'user' | null
  isLoading: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    role: null,
    isLoading: true,
  })
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        setAuthState({
          user,
          role: profile?.role ?? 'user',
          isLoading: false,
        })
      } else {
        setAuthState({
          user: null,
          role: null,
          isLoading: false,
        })
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()

          setAuthState({
            user: session.user,
            role: profile?.role ?? 'user',
            isLoading: false,
          })
        } else {
          setAuthState({
            user: null,
            role: null,
            isLoading: false,
          })
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return authState
}

/**
 * Hook pour protéger les composants admin
 * Redirige vers login si non connecté ou non admin
 */
export function useRequireAuth(requiredRole: 'admin' | 'user' = 'user') {
  const { user, role, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login')
      } else if (requiredRole === 'admin' && role !== 'admin') {
        router.push('/')
      }
    }
  }, [user, role, isLoading, router, requiredRole])

  return { user, role, isLoading }
}

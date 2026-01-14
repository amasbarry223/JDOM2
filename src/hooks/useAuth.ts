/**
 * Authentication hook
 * Provides authentication state and actions
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/lib/utils/constants'

/**
 * Authentication hook
 * @param options - Options for authentication behavior
 * @returns Authentication state and actions
 */
export function useAuth(options: { redirectOnUnauth?: boolean; redirectTo?: string } = {}) {
  const { redirectOnUnauth = false, redirectTo = ROUTES.LOGIN } = options
  const router = useRouter()

  const {
    user,
    session,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    checkSession,
    updateUser,
    clearError,
  } = useAuthStore()

  // Check session on mount
  useEffect(() => {
    checkSession()
  }, [checkSession])

  // Handle redirect on unauthorized
  useEffect(() => {
    if (redirectOnUnauth && !isLoading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [redirectOnUnauth, isLoading, isAuthenticated, redirectTo, router])

  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password)
    return result
  }

  const handleLogout = () => {
    logout()
    if (redirectOnUnauth) {
      router.push(redirectTo)
    }
  }

  return {
    user,
    session,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    logout: handleLogout,
    updateUser,
    clearError,
    checkSession,
  }
}


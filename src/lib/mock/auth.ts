/**
 * Mock authentication system using localStorage
 */

import { loadMockData, saveMockData, type MockUser } from './data'

const SESSION_KEY = 'mock_session'
const USER_KEY = 'mock_current_user'

export interface MockSession {
  userId: string
  email: string
  expiresAt: string
}

export interface AuthResponse {
  success: boolean
  user?: Omit<MockUser, 'password'>
  error?: string
  message?: string
}

/**
 * Initialize mock data if not present
 */
function initializeMockData() {
  if (typeof window === 'undefined') return
  const data = loadMockData()
  saveMockData(data)
}

/**
 * Get current session from localStorage
 */
export function getMockSession(): MockSession | null {
  if (typeof window === 'undefined') return null
  initializeMockData()

  const sessionStr = localStorage.getItem(SESSION_KEY)
  if (!sessionStr) return null

  try {
    const session: MockSession = JSON.parse(sessionStr)
    
    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      localStorage.removeItem(SESSION_KEY)
      localStorage.removeItem(USER_KEY)
      return null
    }

    return session
  } catch {
    return null
  }
}

/**
 * Get current authenticated user
 */
export function getMockUser(): Omit<MockUser, 'password'> | null {
  if (typeof window === 'undefined') return null

  const session = getMockSession()
  if (!session) return null

  const userStr = localStorage.getItem(USER_KEY)
  if (!userStr) return null

  try {
    const user: MockUser = JSON.parse(userStr)
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch {
    return null
  }
}

/**
 * Mock login function
 */
export async function mockLogin(
  email: string,
  password: string
): Promise<AuthResponse> {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Not available on server' }
  }

  initializeMockData()
  const data = loadMockData()

  // Find user by email
  const user = data.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.isActive
  )

  if (!user) {
    return {
      success: false,
      error: 'Email ou mot de passe incorrect',
    }
  }

  // Check password (simple comparison for mock)
  if (user.password !== password) {
    return {
      success: false,
      error: 'Email ou mot de passe incorrect',
    }
  }

  // Create session
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 24) // 24 hours

  const session: MockSession = {
    userId: user.id,
    email: user.email,
    expiresAt: expiresAt.toISOString(),
  }

  // Update last login
  user.lastLoginAt = new Date().toISOString()
  saveMockData({ users: data.users })

  // Store session and user
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  const { password: _, ...userWithoutPassword } = user
  localStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword))

  return {
    success: true,
    user: userWithoutPassword,
    message: 'Connexion réussie',
  }
}

/**
 * Mock register function
 */
export async function mockRegister(
  name: string,
  email: string,
  password: string,
  role: 'admin' | 'contributor' | 'public' = 'public'
): Promise<AuthResponse> {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Not available on server' }
  }

  initializeMockData()
  const data = loadMockData()

  // Check if email already exists
  const existingUser = data.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  )

  if (existingUser) {
    return {
      success: false,
      error: 'Cet email est déjà utilisé',
    }
  }

  // Create new user
  const newUser: MockUser = {
    id: Date.now().toString(),
    email: email.toLowerCase(),
    name,
    role,
    organizationId: null,
    isActive: true,
    emailVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: null,
    password, // Store password for mock (in real app, this would be hashed)
  }

  data.users.push(newUser)
  saveMockData({ users: data.users })

  const { password: _, ...userWithoutPassword } = newUser

  return {
    success: true,
    user: userWithoutPassword,
    message: 'Compte créé avec succès',
  }
}

/**
 * Mock logout function
 */
export function mockLogout(): void {
  if (typeof window === 'undefined') return

  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(USER_KEY)
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getMockSession() !== null
}

/**
 * Check if user has specific role
 */
export function hasRole(role: 'admin' | 'contributor' | 'public'): boolean {
  const user = getMockUser()
  return user?.role === role
}

/**
 * Check if user is admin
 */
export function isAdmin(): boolean {
  return hasRole('admin')
}


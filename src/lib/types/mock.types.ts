/**
 * Mock data types
 * Types for mock data structures that may differ from app types
 */

import type { Dataset, User, Organization, Theme, License } from './index'

/**
 * Mock user type (includes password field)
 */
export interface MockUser extends Omit<User, 'password'> {
  password?: string
}

/**
 * Mock dataset type (may have different structure)
 */
export type MockDataset = Dataset

/**
 * Mock organization type
 */
export type MockOrganization = Organization

/**
 * Mock theme type
 */
export type MockTheme = Theme

/**
 * Mock license type
 */
export type MockLicense = License

/**
 * Type guard to check if user has password
 */
export function hasPassword(user: User | MockUser): user is MockUser {
  return 'password' in user && user.password !== undefined
}

/**
 * Convert mock user to app user (removes password)
 */
export function toAppUser(user: MockUser): User {
  const { password, ...appUser } = user
  return appUser
}

/**
 * Convert mock users array to app users array
 */
export function toAppUsers(users: MockUser[]): User[] {
  return users.filter((u) => !hasPassword(u) || u.password === undefined).map(toAppUser)
}

/**
 * Convert app users array to mock users array (for localStorage sync)
 */
export function toMockUsers(users: User[]): MockUser[] {
  return users.map((user) => ({ ...user } as MockUser))
}


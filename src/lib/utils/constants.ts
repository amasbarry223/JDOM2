/**
 * Application-wide constants
 */

/**
 * User roles
 */
export const ROLES = {
  ADMIN: 'admin',
  CONTRIBUTOR: 'contributor',
  PUBLIC: 'public',
} as const

export type UserRole = typeof ROLES[keyof typeof ROLES]

export const ALLOWED_ROLES: UserRole[] = [ROLES.ADMIN, ROLES.CONTRIBUTOR, ROLES.PUBLIC]

/**
 * Dataset statuses
 */
export const DATASET_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const

export type DatasetStatus = typeof DATASET_STATUS[keyof typeof DATASET_STATUS]

/**
 * Session configuration
 */
export const SESSION_DURATION_HOURS = 24
export const PASSWORD_MIN_LENGTH = 8
export const BCRYPT_SALT_ROUNDS = 10

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const

/**
 * Application routes
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/',
  DATASETS: '/datasets',
  USERS: '/users',
  ORGANIZATIONS: '/organizations',
  THEMES: '/themes',
  LICENSES: '/licenses',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
} as const

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Vous devez être connecté pour accéder à cette ressource',
  FORBIDDEN: "Vous n'avez pas les permissions nécessaires",
  NOT_FOUND: 'Ressource non trouvée',
  VALIDATION_ERROR: 'Les données fournies ne sont pas valides',
  NETWORK_ERROR: 'Erreur de connexion. Veuillez réessayer.',
  UNKNOWN_ERROR: 'Une erreur inattendue est survenue',
} as const

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  CREATED: 'Créé avec succès',
  UPDATED: 'Modifié avec succès',
  DELETED: 'Supprimé avec succès',
  LOGGED_IN: 'Connexion réussie',
  LOGGED_OUT: 'Déconnexion réussie',
} as const

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const


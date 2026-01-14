/**
 * Validation utilities
 */

/**
 * Validate email address
 * @param email - Email to validate
 * @returns True if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate URL
 * @param url - URL to validate
 * @returns True if URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate slug format (lowercase, alphanumeric, hyphens, underscores)
 * @param slug - Slug to validate
 * @returns True if slug is valid
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:[_-][a-z0-9]+)*$/
  return slugRegex.test(slug)
}

/**
 * Generate slug from string
 * @param text - Text to convert to slug
 * @returns Slug string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with validation result and errors
 */
export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Au moins 8 caractères')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Une majuscule')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Une minuscule')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Un chiffre')
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Un caractère spécial')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Sanitize string input (remove HTML tags, trim)
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[^;]+;/g, '') // Remove HTML entities
}


import { z } from 'zod'
import { ALLOWED_ROLES, ROLES, PASSWORD_MIN_LENGTH } from '@/lib/constants'

/**
 * Validation schemas using Zod
 */

export const emailSchema = z
  .string()
  .email('Format d\'email invalide')
  .toLowerCase()
  .trim()

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères`)
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
  .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
  .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Le mot de passe doit contenir au moins un caractère spécial')

export const roleSchema = z.enum([ROLES.ADMIN, ROLES.CONTRIBUTOR, ROLES.PUBLIC], {
  errorMap: () => ({ message: 'Rôle invalide' }),
})

export const nameSchema = z
  .string()
  .min(1, 'Le nom est requis')
  .max(100, 'Le nom ne peut pas dépasser 100 caractères')
  .trim()

/**
 * Registration schema
 */
export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: roleSchema.default(ROLES.PUBLIC),
})

export type RegisterInput = z.infer<typeof registerSchema>

/**
 * Login schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Le mot de passe est requis'),
})

export type LoginInput = z.infer<typeof loginSchema>

/**
 * User update schema
 */
export const updateUserSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  role: roleSchema.optional(),
  organizationId: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>


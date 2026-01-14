/**
 * User validation schema
 * Zod schema for user validation
 */

import { z } from 'zod'

export const userFormSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Le nom est trop long'),
  email: z.string().email('Email invalide').min(1, "L'email est requis"),
  role: z.enum(['admin', 'contributor', 'public'], {
    errorMap: () => ({ message: 'Rôle invalide' }),
  }),
  organizationId: z.string().optional(),
  isActive: z.boolean().optional(),
})

export type UserFormSchema = z.infer<typeof userFormSchema>


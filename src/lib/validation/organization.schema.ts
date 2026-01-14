/**
 * Organization validation schema
 * Zod schema for organization validation
 */

import { z } from 'zod'

export const organizationFormSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(200, 'Le nom est trop long'),
  description: z.string().max(1000, 'La description est trop longue').optional(),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  website: z.string().url('URL invalide').optional().or(z.literal('')),
  logo: z.string().url('URL invalide').optional().or(z.literal('')),
})

export type OrganizationFormSchema = z.infer<typeof organizationFormSchema>


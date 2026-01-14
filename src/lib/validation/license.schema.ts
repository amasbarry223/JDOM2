/**
 * License validation schema
 * Zod schema for license validation
 */

import { z } from 'zod'

export const licenseFormSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(200, 'Le nom est trop long'),
  slug: z
    .string()
    .min(1, 'Le slug est requis')
    .max(100, 'Le slug est trop long')
    .regex(/^[a-z0-9]+(?:[_-][a-z0-9]+)*$/, 'Le slug doit être en minuscules avec des tirets ou underscores'),
  description: z.string().max(500, 'La description est trop longue').optional(),
  url: z.string().url('URL invalide').optional().or(z.literal('')),
})

export type LicenseFormSchema = z.infer<typeof licenseFormSchema>


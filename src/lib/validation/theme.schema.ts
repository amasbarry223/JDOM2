/**
 * Theme validation schema
 * Zod schema for theme validation
 */

import { z } from 'zod'

export const themeFormSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Le nom est trop long'),
  slug: z
    .string()
    .min(1, 'Le slug est requis')
    .max(100, 'Le slug est trop long')
    .regex(/^[a-z0-9]+(?:[_-][a-z0-9]+)*$/, 'Le slug doit être en minuscules avec des tirets ou underscores'),
  description: z.string().max(500, 'La description est trop longue').optional(),
  icon: z.string().optional(),
})

export type ThemeFormSchema = z.infer<typeof themeFormSchema>


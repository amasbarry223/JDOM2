/**
 * Dataset validation schema
 * Zod schema for dataset validation
 */

import { z } from 'zod'

export const datasetFormSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre est trop long'),
  shortDescription: z.string().max(500, 'La description est trop longue').optional(),
  description: z.string().max(5000, 'La description est trop longue').optional(),
  format: z.enum(['CSV', 'JSON', 'XML', 'XLSX', 'API'], {
    errorMap: () => ({ message: 'Format invalide' }),
  }),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  producerId: z.string().min(1, 'Le producteur est requis'),
  themeId: z.string().optional(),
  licenseId: z.string().min(1, 'La licence est requise'),
  updateFrequency: z.string().optional(),
  featured: z.boolean().optional(),
  spatialCoverage: z.string().optional(),
  temporalCoverage: z.string().optional(),
})

export type DatasetFormSchema = z.infer<typeof datasetFormSchema>


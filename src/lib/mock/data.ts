/**
 * Mock data for frontend-only application
 * All data is stored in memory and localStorage
 */

import { ROLES, DATASET_STATUS } from '@/lib/constants'

export interface MockUser {
  id: string
  email: string
  name: string | null
  role: 'admin' | 'contributor' | 'public'
  organizationId: string | null
  isActive: boolean
  emailVerified: boolean | null
  createdAt: string
  updatedAt: string
  lastLoginAt: string | null
  password?: string // Only for initial mock data
}

export interface MockOrganization {
  id: string
  name: string
  description: string | null
  email: string | null
  website: string | null
  logo: string | null
  createdAt: string
  updatedAt: string
}

export interface MockTheme {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  createdAt: string
  updatedAt: string
}

export interface MockLicense {
  id: string
  name: string
  slug: string
  description: string | null
  url: string | null
  createdAt: string
  updatedAt: string
}

export interface MockDataset {
  id: string
  title: string
  slug: string
  shortDescription: string | null
  description: string | null
  format: string
  downloadUrl: string | null
  apiUrl: string | null
  spatialCoverage: string | null
  temporalCoverage: string | null
  publicationDate: string
  updateFrequency: string | null
  lastUpdated: string
  fileSize: number | null
  recordCount: number | null
  downloadsCount: number
  viewsCount: number
  featured: boolean
  status: 'draft' | 'published' | 'archived'
  currentVersion: number
  producerId: string
  themeId: string | null
  licenseId: string
  createdById: string | null
  createdAt: string
  updatedAt: string
}

// Initial mock data
export const initialUsers: MockUser[] = [
  {
    id: '1',
    email: 'admin@jdom.ml',
    name: 'Administrateur JDOM',
    role: 'admin',
    organizationId: '1',
    isActive: true,
    emailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: null,
    password: 'Admin123!',
  },
  {
    id: '2',
    email: 'contributor@jdom.ml',
    name: 'Contributeur Test',
    role: 'contributor',
    organizationId: '1',
    isActive: true,
    emailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: null,
    password: 'Contributor123!',
  },
  {
    id: '3',
    email: 'public@jdom.ml',
    name: 'Utilisateur Public',
    role: 'public',
    organizationId: null,
    isActive: true,
    emailVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: null,
    password: 'Public123!',
  },
]

export const initialOrganizations: MockOrganization[] = [
  {
    id: '1',
    name: 'Ministère de l\'Économie et des Finances',
    description: 'Organisation gouvernementale responsable des données économiques',
    email: 'contact@finances.ml',
    website: 'https://finances.ml',
    logo: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Institut National de la Statistique',
    description: 'Organisme chargé de la collecte et de l\'analyse des statistiques',
    email: 'contact@instat.ml',
    website: 'https://instat.ml',
    logo: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Agence Nationale de l\'Aviation Civile',
    description: 'Données sur le transport aérien',
    email: 'contact@anac.ml',
    website: null,
    logo: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const initialThemes: MockTheme[] = [
  {
    id: '1',
    name: 'Économie',
    slug: 'economie',
    description: 'Données économiques et financières',
    icon: '💰',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Santé',
    slug: 'sante',
    description: 'Données de santé publique',
    icon: '🏥',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Éducation',
    slug: 'education',
    description: 'Données sur l\'éducation',
    icon: '📚',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Transport',
    slug: 'transport',
    description: 'Données sur les transports',
    icon: '🚗',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Environnement',
    slug: 'environnement',
    description: 'Données environnementales',
    icon: '🌍',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const initialLicenses: MockLicense[] = [
  {
    id: '1',
    name: 'Open Data Commons Open Database License (ODbL)',
    slug: 'odbl',
    description: 'Licence pour bases de données ouvertes',
    url: 'https://opendatacommons.org/licenses/odbl/',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Creative Commons Attribution 4.0',
    slug: 'cc-by-4',
    description: 'Attribution requise',
    url: 'https://creativecommons.org/licenses/by/4.0/',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Domaine Public',
    slug: 'public-domain',
    description: 'Données dans le domaine public',
    url: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const initialDatasets: MockDataset[] = [
  {
    id: '1',
    title: 'Indicateurs économiques du Mali 2023',
    slug: 'indicateurs-economiques-mali-2023',
    shortDescription: 'Principaux indicateurs économiques du Mali pour l\'année 2023',
    description: 'Données complètes sur le PIB, l\'inflation, le commerce extérieur, etc.',
    format: 'CSV',
    downloadUrl: '/datasets/indicateurs-economiques-2023.csv',
    apiUrl: null,
    spatialCoverage: 'Mali',
    temporalCoverage: '2023',
    publicationDate: new Date('2024-01-15').toISOString(),
    updateFrequency: 'Annuelle',
    lastUpdated: new Date('2024-01-15').toISOString(),
    fileSize: 245760,
    recordCount: 150,
    downloadsCount: 342,
    viewsCount: 1250,
    featured: true,
    status: 'published',
    currentVersion: 1,
    producerId: '1',
    themeId: '1',
    licenseId: '1',
    createdById: '1',
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    title: 'Statistiques sanitaires par région',
    slug: 'statistiques-sanitaires-regions',
    shortDescription: 'Données sanitaires détaillées par région du Mali',
    description: 'Nombre de centres de santé, taux de vaccination, etc.',
    format: 'JSON',
    downloadUrl: '/datasets/sante-regions.json',
    apiUrl: null,
    spatialCoverage: 'Mali - Toutes régions',
    temporalCoverage: '2022-2023',
    publicationDate: new Date('2024-02-01').toISOString(),
    updateFrequency: 'Mensuelle',
    lastUpdated: new Date('2024-02-01').toISOString(),
    fileSize: 512000,
    recordCount: 450,
    downloadsCount: 189,
    viewsCount: 678,
    featured: false,
    status: 'published',
    currentVersion: 1,
    producerId: '2',
    themeId: '2',
    licenseId: '2',
    createdById: '2',
    createdAt: new Date('2024-01-25').toISOString(),
    updatedAt: new Date('2024-02-01').toISOString(),
  },
  {
    id: '3',
    title: 'Effectifs scolaires par niveau',
    slug: 'effectifs-scolaires-niveaux',
    shortDescription: 'Nombre d\'élèves par niveau d\'enseignement',
    description: 'Données sur les effectifs du primaire au supérieur',
    format: 'CSV',
    downloadUrl: '/datasets/effectifs-scolaires.csv',
    apiUrl: null,
    spatialCoverage: 'Mali',
    temporalCoverage: '2023-2024',
    publicationDate: new Date('2024-03-10').toISOString(),
    updateFrequency: 'Annuelle',
    lastUpdated: new Date('2024-03-10').toISOString(),
    fileSize: 128000,
    recordCount: 89,
    downloadsCount: 156,
    viewsCount: 432,
    featured: false,
    status: 'published',
    currentVersion: 1,
    producerId: '2',
    themeId: '3',
    licenseId: '1',
    createdById: '2',
    createdAt: new Date('2024-03-05').toISOString(),
    updatedAt: new Date('2024-03-10').toISOString(),
  },
  {
    id: '4',
    title: 'Trafic aérien - Aéroports du Mali',
    slug: 'trafic-aerien-aeroports',
    shortDescription: 'Données sur le trafic aérien dans les aéroports maliens',
    description: 'Nombre de passagers, vols, destinations par aéroport',
    format: 'CSV',
    downloadUrl: '/datasets/trafic-aerien.csv',
    apiUrl: null,
    spatialCoverage: 'Mali - Aéroports',
    temporalCoverage: '2023',
    publicationDate: new Date('2024-01-20').toISOString(),
    updateFrequency: 'Mensuelle',
    lastUpdated: new Date('2024-01-20').toISOString(),
    fileSize: 89000,
    recordCount: 120,
    downloadsCount: 98,
    viewsCount: 234,
    featured: false,
    status: 'published',
    currentVersion: 1,
    producerId: '3',
    themeId: '4',
    licenseId: '2',
    createdById: '1',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
  },
  {
    id: '5',
    title: 'Qualité de l\'air - Bamako',
    slug: 'qualite-air-bamako',
    shortDescription: 'Données sur la qualité de l\'air à Bamako',
    description: 'Mesures de pollution atmosphérique quotidiennes',
    format: 'JSON',
    downloadUrl: '/datasets/qualite-air.json',
    apiUrl: null,
    spatialCoverage: 'Bamako',
    temporalCoverage: '2024',
    publicationDate: new Date('2024-04-01').toISOString(),
    updateFrequency: 'Quotidienne',
    lastUpdated: new Date().toISOString(),
    fileSize: 1024000,
    recordCount: 365,
    downloadsCount: 67,
    viewsCount: 189,
    featured: false,
    status: 'draft',
    currentVersion: 1,
    producerId: '2',
    themeId: '5',
    licenseId: '3',
    createdById: '2',
    createdAt: new Date('2024-03-25').toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

/**
 * Load data from localStorage or use initial data
 */
export function loadMockData() {
  if (typeof window === 'undefined') {
    return {
      users: initialUsers,
      organizations: initialOrganizations,
      themes: initialThemes,
      licenses: initialLicenses,
      datasets: initialDatasets,
    }
  }

  const storedUsers = localStorage.getItem('mock_users')
  const storedOrgs = localStorage.getItem('mock_organizations')
  const storedThemes = localStorage.getItem('mock_themes')
  const storedLicenses = localStorage.getItem('mock_licenses')
  const storedDatasets = localStorage.getItem('mock_datasets')

  return {
    users: storedUsers ? JSON.parse(storedUsers) : initialUsers,
    organizations: storedOrgs ? JSON.parse(storedOrgs) : initialOrganizations,
    themes: storedThemes ? JSON.parse(storedThemes) : initialThemes,
    licenses: storedLicenses ? JSON.parse(storedLicenses) : initialLicenses,
    datasets: storedDatasets ? JSON.parse(storedDatasets) : initialDatasets,
  }
}

/**
 * Save data to localStorage
 */
export function saveMockData(data: {
  users?: MockUser[]
  organizations?: MockOrganization[]
  themes?: MockTheme[]
  licenses?: MockLicense[]
  datasets?: MockDataset[]
}) {
  if (typeof window === 'undefined') return

  if (data.users) {
    localStorage.setItem('mock_users', JSON.stringify(data.users))
  }
  if (data.organizations) {
    localStorage.setItem('mock_organizations', JSON.stringify(data.organizations))
  }
  if (data.themes) {
    localStorage.setItem('mock_themes', JSON.stringify(data.themes))
  }
  if (data.licenses) {
    localStorage.setItem('mock_licenses', JSON.stringify(data.licenses))
  }
  if (data.datasets) {
    localStorage.setItem('mock_datasets', JSON.stringify(data.datasets))
  }
}


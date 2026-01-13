/**
 * Mock API simulator
 * Simulates API calls by returning mock data
 */

import { loadMockData, saveMockData, type MockUser, type MockDataset, type MockOrganization, type MockTheme, type MockLicense } from './data'
import { getMockUser } from './auth'

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Mock API response wrapper
 */
function mockResponse<T>(data: T, message?: string) {
  return delay(300).then(() => ({
    success: true,
    data,
    message,
  }))
}

function mockError(message: string, statusCode: number = 400) {
  return delay(300).then(() => ({
    success: false,
    error: message,
    statusCode,
  }))
}

/**
 * Users API
 */
export const mockUsersApi = {
  async getAll(filters?: {
    role?: string
    search?: string
    organizationId?: string
    page?: number
    limit?: number
  }) {
    const data = loadMockData()
    let users = data.users.filter(u => u.password === undefined) // Remove password from response

    if (filters?.role) {
      users = users.filter(u => u.role === filters.role)
    }

    if (filters?.organizationId) {
      users = users.filter(u => u.organizationId === filters.organizationId)
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase()
      users = users.filter(
        u =>
          u.email.toLowerCase().includes(search) ||
          (u.name && u.name.toLowerCase().includes(search))
      )
    }

    const page = filters?.page || 1
    const limit = filters?.limit || 10
    const start = (page - 1) * limit
    const end = start + limit

    return mockResponse({
      users: users.slice(start, end),
      pagination: {
        page,
        limit,
        total: users.length,
        pages: Math.ceil(users.length / limit),
      },
    })
  },

  async getById(id: string) {
    const data = loadMockData()
    const user = data.users.find(u => u.id === id)
    
    if (!user) {
      return mockError('Utilisateur non trouvé', 404)
    }

    const { password, ...userWithoutPassword } = user
    return mockResponse(userWithoutPassword)
  },
}

/**
 * Datasets API
 */
export const mockDatasetsApi = {
  async getAll(filters?: {
    status?: string
    themeId?: string
    producerId?: string
    search?: string
    page?: number
    limit?: number
  }) {
    const data = loadMockData()
    const currentUser = getMockUser()
    
    let datasets = data.datasets

    // Apply RLS-like filtering based on user role
    if (currentUser) {
      if (currentUser.role === 'public') {
        datasets = datasets.filter(d => d.status === 'published')
      }
      // Admin and contributor can see all
    } else {
      datasets = datasets.filter(d => d.status === 'published')
    }

    if (filters?.status) {
      datasets = datasets.filter(d => d.status === filters.status)
    }

    if (filters?.themeId) {
      datasets = datasets.filter(d => d.themeId === filters.themeId)
    }

    if (filters?.producerId) {
      datasets = datasets.filter(d => d.producerId === filters.producerId)
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase()
      datasets = datasets.filter(
        d =>
          d.title.toLowerCase().includes(search) ||
          (d.shortDescription && d.shortDescription.toLowerCase().includes(search))
      )
    }

    const page = filters?.page || 1
    const limit = filters?.limit || 10
    const start = (page - 1) * limit
    const end = start + limit

    // Enrich with related data
    const enrichedDatasets = datasets.slice(start, end).map(dataset => ({
      ...dataset,
      producer: data.organizations.find(o => o.id === dataset.producerId),
      theme: dataset.themeId ? data.themes.find(t => t.id === dataset.themeId) : null,
      license: data.licenses.find(l => l.id === dataset.licenseId),
      createdBy: dataset.createdById ? data.users.find(u => u.id === dataset.createdById && !u.password) : null,
    }))

    return mockResponse({
      datasets: enrichedDatasets,
      pagination: {
        page,
        limit,
        total: datasets.length,
        pages: Math.ceil(datasets.length / limit),
      },
    })
  },

  async getById(id: string) {
    const data = loadMockData()
    const currentUser = getMockUser()
    const dataset = data.datasets.find(d => d.id === id)

    if (!dataset) {
      return mockError('Dataset non trouvé', 404)
    }

    // Check permissions
    if (!currentUser && dataset.status !== 'published') {
      return mockError('Accès non autorisé', 403)
    }

    if (currentUser?.role === 'public' && dataset.status !== 'published') {
      return mockError('Accès non autorisé', 403)
    }

    // Enrich with related data
    const enriched = {
      ...dataset,
      producer: data.organizations.find(o => o.id === dataset.producerId),
      theme: dataset.themeId ? data.themes.find(t => t.id === dataset.themeId) : null,
      license: data.licenses.find(l => l.id === dataset.licenseId),
      createdBy: dataset.createdById ? data.users.find(u => u.id === dataset.createdById && !u.password) : null,
    }

    return mockResponse(enriched)
  },
}

/**
 * Organizations API
 */
export const mockOrganizationsApi = {
  async getAll(filters?: { search?: string; page?: number; limit?: number }) {
    const data = loadMockData()
    let organizations = data.organizations

    if (filters?.search) {
      const search = filters.search.toLowerCase()
      organizations = organizations.filter(
        o =>
          o.name.toLowerCase().includes(search) ||
          (o.description && o.description.toLowerCase().includes(search))
      )
    }

    const page = filters?.page || 1
    const limit = filters?.limit || 10
    const start = (page - 1) * limit
    const end = start + limit

    return mockResponse({
      organizations: organizations.slice(start, end),
      pagination: {
        page,
        limit,
        total: organizations.length,
        pages: Math.ceil(organizations.length / limit),
      },
    })
  },

  async getById(id: string) {
    const data = loadMockData()
    const org = data.organizations.find(o => o.id === id)

    if (!org) {
      return mockError('Organisation non trouvée', 404)
    }

    return mockResponse(org)
  },
}

/**
 * Themes API
 */
export const mockThemesApi = {
  async getAll(filters?: { search?: string; page?: number; limit?: number }) {
    const data = loadMockData()
    let themes = data.themes

    if (filters?.search) {
      const search = filters.search.toLowerCase()
      themes = themes.filter(
        t =>
          t.name.toLowerCase().includes(search) ||
          t.slug.toLowerCase().includes(search) ||
          (t.description && t.description.toLowerCase().includes(search))
      )
    }

    const page = filters?.page || 1
    const limit = filters?.limit || 100
    const start = (page - 1) * limit
    const end = start + limit

    return mockResponse({
      themes: themes.slice(start, end),
      pagination: {
        page,
        limit,
        total: themes.length,
        pages: Math.ceil(themes.length / limit),
      },
    })
  },

  async getById(id: string) {
    const data = loadMockData()
    const theme = data.themes.find(t => t.id === id)

    if (!theme) {
      return mockError('Thème non trouvé', 404)
    }

    return mockResponse(theme)
  },
}

/**
 * Licenses API
 */
export const mockLicensesApi = {
  async getAll(filters?: { search?: string; page?: number; limit?: number }) {
    const data = loadMockData()
    let licenses = data.licenses

    if (filters?.search) {
      const search = filters.search.toLowerCase()
      licenses = licenses.filter(
        l =>
          l.name.toLowerCase().includes(search) ||
          l.slug.toLowerCase().includes(search) ||
          (l.description && l.description.toLowerCase().includes(search))
      )
    }

    const page = filters?.page || 1
    const limit = filters?.limit || 100
    const start = (page - 1) * limit
    const end = start + limit

    return mockResponse({
      licenses: licenses.slice(start, end),
      pagination: {
        page,
        limit,
        total: licenses.length,
        pages: Math.ceil(licenses.length / limit),
      },
    })
  },

  async getById(id: string) {
    const data = loadMockData()
    const license = data.licenses.find(l => l.id === id)

    if (!license) {
      return mockError('Licence non trouvée', 404)
    }

    return mockResponse(license)
  },
}

/**
 * Stats API
 */
export const mockStatsApi = {
  async getStats() {
    const data = loadMockData()

    const totalDatasets = data.datasets.length
    const publishedDatasets = data.datasets.filter(d => d.status === 'published').length
    const draftDatasets = data.datasets.filter(d => d.status === 'draft').length
    const archivedDatasets = data.datasets.filter(d => d.status === 'archived').length
    const totalDownloads = data.datasets.reduce((sum, d) => sum + d.downloadsCount, 0)
    const totalViews = data.datasets.reduce((sum, d) => sum + d.viewsCount, 0)
    const totalUsers = data.users.length
    const activeUsers = data.users.filter(u => u.role !== 'public').length
    const totalOrganizations = data.organizations.length
    const totalThemes = data.themes.length
    const totalLicenses = data.licenses.length
    const featuredDatasets = data.datasets.filter(d => d.featured).length

    // Datasets by theme
    const datasetsByTheme = data.themes.map(theme => ({
      id: theme.id,
      name: theme.name,
      slug: theme.slug,
      datasetsCount: data.datasets.filter(d => d.themeId === theme.id).length,
    }))

    // Datasets by organization
    const datasetsByOrganization = data.organizations.map(org => ({
      id: org.id,
      name: org.name,
      datasetsCount: data.datasets.filter(d => d.producerId === org.id).length,
    }))

    // Recent datasets
    const recentDatasets = [...data.datasets]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map(dataset => ({
        ...dataset,
        producer: data.organizations.find(o => o.id === dataset.producerId),
        theme: dataset.themeId ? data.themes.find(t => t.id === dataset.themeId) : null,
        license: data.licenses.find(l => l.id === dataset.licenseId),
      }))

    // Top downloaded datasets
    const topDatasets = [...data.datasets]
      .sort((a, b) => b.downloadsCount - a.downloadsCount)
      .slice(0, 10)
      .map(dataset => ({
        ...dataset,
        producer: data.organizations.find(o => o.id === dataset.producerId),
        theme: dataset.themeId ? data.themes.find(t => t.id === dataset.themeId) : null,
        license: data.licenses.find(l => l.id === dataset.licenseId),
      }))

    return mockResponse({
      overview: {
        totalDatasets,
        publishedDatasets,
        draftDatasets,
        archivedDatasets,
        totalDownloads,
        totalViews,
        totalUsers,
        activeUsers,
        totalOrganizations,
        totalThemes,
        totalLicenses,
        featuredDatasets,
      },
      datasetsByTheme,
      datasetsByOrganization,
      recentDatasets,
      topDatasets,
    })
  },
}

/**
 * Session API
 */
export const mockSessionApi = {
  async getSession() {
    const { getMockUser, getMockSession } = await import('./auth')
    const user = getMockUser()
    const session = getMockSession()

    if (!user || !session) {
      return mockResponse({
        authenticated: false,
        message: 'Aucune session active',
      })
    }

    return mockResponse({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organizationId: user.organizationId,
        emailVerified: user.emailVerified,
      },
      expiresAt: session.expiresAt,
    })
  },
}


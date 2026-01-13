'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Database,
  Users,
  Building2,
  Tag,
  Scale,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Plus,
  MoreHorizontal,
  Filter,
  Eye,
  Download,
  Edit,
  Trash2,
  ExternalLink,
  Calendar,
  FileText,
  TrendingUp,
  Package,
  Globe,
  Layers,
  Shield,
  Lock,
  Unlock,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import UserManagement from '@/components/UserManagement'

// Helper function to format numbers consistently across server and client
function formatNumber(num: number): string {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

// Counter for generating consistent IDs
let idCounter = Date.now()

// Helper function to generate IDs consistently
function generateId(): string {
  idCounter += 1
  return `id_${idCounter}`
}

// Helper function to generate current date string consistently
function getCurrentDate(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

interface Dataset {
  id: string
  title: string
  shortDescription: string
  format: string
  status: 'draft' | 'published' | 'archived'
  downloadsCount: number
  viewsCount: number
  publicationDate: string
  updateFrequency: string
  producer: string
  theme: string
  license: string
  featured: boolean
}

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'contributor' | 'public'
  organization?: string
  createdAt: string
}

interface Organization {
  id: string
  name: string
  description: string
  email?: string
  website?: string
  datasetsCount: number
}

export default function Dashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)

  // Check authentication on mount (optional - dashboard is public)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { mockSessionApi } = await import('@/lib/mock/api')
        const result = await mockSessionApi.getSession()

        if (result.success && result.data?.authenticated) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          // Don't redirect - allow public access to dashboard
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
        // Don't redirect - allow public access to dashboard
      } finally {
        setIsLoadingAuth(false)
      }
    }

    checkAuth()
  }, [router])

  // Dataset states
  const [datasets, setDatasets] = useState<Dataset[]>([
    {
      id: '1',
      title: 'Statistiques démographiques du Mali 2024',
      shortDescription: 'Données démographiques détaillées par région',
      format: 'CSV',
      status: 'published',
      downloadsCount: 1250,
      viewsCount: 5432,
      publicationDate: '2024-01-15',
      updateFrequency: 'Annuelle',
      producer: 'INSTAT',
      theme: 'Démographie',
      license: 'ODbL',
      featured: true
    },
    {
      id: '2',
      title: 'Infrastructures de santé',
      shortDescription: 'Localisation et caractéristiques des centres de santé',
      format: 'JSON',
      status: 'published',
      downloadsCount: 892,
      viewsCount: 3210,
      publicationDate: '2024-02-01',
      updateFrequency: 'Mensuelle',
      producer: 'Ministère de la Santé',
      theme: 'Santé',
      license: 'CC-BY 4.0',
      featured: false
    },
    {
      id: '3',
      title: 'Indicateurs économiques régionaux',
      shortDescription: 'PIB, emploi et commerce par région',
      format: 'CSV',
      status: 'published',
      downloadsCount: 2100,
      viewsCount: 7654,
      publicationDate: '2024-01-20',
      updateFrequency: 'Trimestrielle',
      producer: 'Ministère de l\'Économie',
      theme: 'Économie',
      license: 'ODbL',
      featured: true
    },
    {
      id: '4',
      title: 'Établissements scolaires',
      shortDescription: 'Données sur les écoles primaires et secondaires',
      format: 'JSON',
      status: 'draft',
      downloadsCount: 0,
      viewsCount: 23,
      publicationDate: '2024-03-10',
      updateFrequency: 'Annuelle',
      producer: 'Ministère de l\'Éducation',
      theme: 'Éducation',
      license: 'CC-BY 4.0',
      featured: false
    },
    {
      id: '5',
      title: 'Qualité de l\'air',
      shortDescription: 'Mesures de pollution atmosphérique dans les grandes villes',
      format: 'CSV',
      status: 'published',
      downloadsCount: 567,
      viewsCount: 2100,
      publicationDate: '2024-02-15',
      updateFrequency: 'Quotidienne',
      producer: 'Ministère de l\'Environnement',
      theme: 'Environnement',
      license: 'CC0',
      featured: false
    }
  ])

  // User states
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Admin Principal',
      email: 'admin@jdom.ml',
      role: 'admin',
      organization: 'Équipe JDOM',
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Marie Koné',
      email: 'marie.kone@instat.ml',
      role: 'contributor',
      organization: 'INSTAT',
      createdAt: '2024-01-15'
    },
    {
      id: '3',
      name: 'Ahoudo Touré',
      email: 'ahoudo@sante.ml',
      role: 'contributor',
      organization: 'Ministère de la Santé',
      createdAt: '2024-02-01'
    },
    {
      id: '4',
      name: 'Utilisateur Test',
      email: 'test@example.com',
      role: 'public',
      createdAt: '2024-03-01'
    }
  ])

  // Organization states
  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      id: '1',
      name: 'INSTAT',
      description: 'Institut National de la Statistique du Mali',
      email: 'contact@instat.ml',
      website: 'https://www.instat.ml',
      datasetsCount: 15
    },
    {
      id: '2',
      name: 'Ministère de la Santé',
      description: 'Ministère de la Santé et de l\'Hygiène Publique',
      email: 'contact@sante.ml',
      datasetsCount: 12
    },
    {
      id: '3',
      name: 'Ministère de l\'Économie',
      description: 'Ministère de l\'Économie et des Finances',
      email: 'contact@economie.ml',
      datasetsCount: 8
    }
  ])

  // Modal states
  const [datasetModalOpen, setDatasetModalOpen] = useState(false)
  const [userModalOpen, setUserModalOpen] = useState(false)
  const [organizationModalOpen, setOrganizationModalOpen] = useState(false)
  const [themeModalOpen, setThemeModalOpen] = useState(false)
  const [licenseModalOpen, setLicenseModalOpen] = useState(false)
  const [editDataset, setEditDataset] = useState<Dataset | null>(null)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [editOrganization, setEditOrganization] = useState<Organization | null>(null)

  // Theme and License states
  const [themes, setThemes] = useState([
    { id: '1', name: 'Démographie', slug: 'demographie', datasetsCount: 5 },
    { id: '2', name: 'Santé', slug: 'sante', datasetsCount: 12 },
    { id: '3', name: 'Économie', slug: 'economie', datasetsCount: 8 },
    { id: '4', name: 'Éducation', slug: 'education', datasetsCount: 10 },
    { id: '5', name: 'Environnement', slug: 'environnement', datasetsCount: 6 },
    { id: '6', name: 'Transport', slug: 'transport', datasetsCount: 4 },
    { id: '7', name: 'Infrastructure', slug: 'infrastructure', datasetsCount: 7 }
  ])

  const [licenses, setLicenses] = useState([
    { id: '1', name: 'ODbL', slug: 'odbl', description: 'Open Database License', url: 'https://opendatacommons.org/licenses/odbl/' },
    { id: '2', name: 'CC-BY 4.0', slug: 'cc-by-4', description: 'Creative Commons Attribution 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' },
    { id: '3', name: 'CC0', slug: 'cc0', description: 'Creative Commons Zero (Public Domain)', url: 'https://creativecommons.org/publicdomain/zero/1.0/' }
  ])

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'datasets', label: 'Jeux de données', icon: Database },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'organizations', label: 'Organisations', icon: Building2 },
    { id: 'themes', label: 'Thèmes', icon: Tag },
    { id: 'licenses', label: 'Licences', icon: Scale },
    { id: 'analytics', label: 'Analytique', icon: BarChart3 },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ]

  const stats = {
    totalDatasets: datasets.length,
    publishedDatasets: datasets.filter(d => d.status === 'published').length,
    totalDownloads: datasets.reduce((sum, d) => sum + d.downloadsCount, 0),
    totalViews: datasets.reduce((sum, d) => sum + d.viewsCount, 0),
    totalUsers: users.length,
    totalOrganizations: organizations.length,
    activeUsers: users.filter(u => u.role !== 'public').length
  }

  const handleAddDataset = () => {
    setEditDataset(null)
    setDatasetModalOpen(true)
  }

  const handleEditDataset = (dataset: Dataset) => {
    setEditDataset(dataset)
    setDatasetModalOpen(true)
  }

  const handleDeleteDataset = (id: string) => {
    setDatasets(datasets.filter(d => d.id !== id))
    toast({
      title: 'Jeu de données supprimé',
      description: 'Le jeu de données a été supprimé avec succès.'
    })
  }

  const handleSaveDataset = (formData: Partial<Dataset>) => {
    if (editDataset) {
      setDatasets(datasets.map(d =>
        d.id === editDataset.id ? { ...d, ...formData } : d
      ))
      toast({
        title: 'Jeu de données modifié',
        description: 'Les modifications ont été enregistrées avec succès.'
      })
    } else {
      const newDataset: Dataset = {
        id: generateId(),
        title: formData.title || 'Nouveau jeu de données',
        shortDescription: formData.shortDescription || '',
        format: formData.format || 'CSV',
        status: 'draft',
        downloadsCount: 0,
        viewsCount: 0,
        publicationDate: getCurrentDate(),
        updateFrequency: formData.updateFrequency || 'Annuelle',
        producer: formData.producer || '',
        theme: formData.theme || '',
        license: formData.license || 'ODbL',
        featured: false
      }
      setDatasets([newDataset, ...datasets])
      toast({
        title: 'Jeu de données créé',
        description: 'Le nouveau jeu de données a été créé avec succès.'
      })
    }
    setDatasetModalOpen(false)
  }

  const handleAddUser = () => {
    setEditUser(null)
    setUserModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    setEditUser(user)
    setUserModalOpen(true)
  }

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id))
    toast({
      title: 'Utilisateur supprimé',
      description: 'L\'utilisateur a été supprimé avec succès.'
    })
  }

  const handleSaveUser = (formData: Partial<User>) => {
    if (editUser) {
      setUsers(users.map(u =>
        u.id === editUser.id ? { ...u, ...formData } : u
      ))
      toast({
        title: 'Utilisateur modifié',
        description: 'Les modifications ont été enregistrées avec succès.'
      })
    } else {
      const newUser: User = {
        id: generateId(),
        name: formData.name || 'Nouvel utilisateur',
        email: formData.email || '',
        role: formData.role || 'public',
        organization: formData.organization,
        createdAt: getCurrentDate()
      }
      setUsers([newUser, ...users])
      toast({
        title: 'Utilisateur créé',
        description: 'Le nouvel utilisateur a été créé avec succès.'
      })
    }
    setUserModalOpen(false)
  }

  const handleAddOrganization = () => {
    setEditOrganization(null)
    setOrganizationModalOpen(true)
  }

  const handleEditOrganization = (org: Organization) => {
    setEditOrganization(org)
    setOrganizationModalOpen(true)
  }

  const handleDeleteOrganization = (id: string) => {
    setOrganizations(organizations.filter(o => o.id !== id))
    toast({
      title: 'Organisation supprimée',
      description: 'L\'organisation a été supprimée avec succès.'
    })
  }

  const handleSaveOrganization = (formData: Partial<Organization>) => {
    if (editOrganization) {
      setOrganizations(organizations.map(o =>
        o.id === editOrganization.id ? { ...o, ...formData } : o
      ))
      toast({
        title: 'Organisation modifiée',
        description: 'Les modifications ont été enregistrées avec succès.'
      })
    } else {
      const newOrganization: Organization = {
        id: generateId(),
        name: formData.name || 'Nouvelle organisation',
        description: formData.description || '',
        email: formData.email,
        website: formData.website,
        datasetsCount: 0
      }
      setOrganizations([newOrganization, ...organizations])
      toast({
        title: 'Organisation créée',
        description: 'La nouvelle organisation a été créée avec succès.'
      })
    }
    setOrganizationModalOpen(false)
  }

  const handleSaveTheme = (formData: { name: string; slug: string; description?: string }) => {
    const newTheme = {
      id: generateId(),
      name: formData.name,
      slug: formData.slug,
      datasetsCount: 0
    }
    setThemes([...themes, newTheme])
    toast({
      title: 'Thème créé',
      description: 'Le nouveau thème a été créé avec succès.'
    })
    setThemeModalOpen(false)
  }

  const handleSaveLicense = (formData: { name: string; slug: string; description?: string; url?: string }) => {
    const newLicense = {
      id: generateId(),
      name: formData.name,
      slug: formData.slug,
      description: formData.description || '',
      url: formData.url || ''
    }
    setLicenses([...licenses, newLicense])
    toast({
      title: 'Licence créée',
      description: 'La nouvelle licence a été créée avec succès.'
    })
    setLicenseModalOpen(false)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      published: 'default',
      draft: 'secondary',
      archived: 'destructive'
    }
    const labels: Record<string, string> = {
      published: 'Publié',
      draft: 'Brouillon',
      archived: 'Archivé'
    }
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {labels[status] || status}
      </Badge>
    )
  }

  const getRoleBadge = (role: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      admin: 'default',
      contributor: 'secondary',
      public: 'outline'
    }
    const labels: Record<string, string> = {
      admin: 'Admin',
      contributor: 'Contributeur',
      public: 'Public'
    }
    return (
      <Badge variant={variants[role] || 'outline'}>
        {labels[role] || role}
      </Badge>
    )
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Vue d'ensemble de la plateforme JDOM
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Datasets
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDatasets}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedDatasets} publiés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Téléchargements
            </CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalDownloads)}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Vues
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalViews)}</div>
            <p className="text-xs text-muted-foreground">
              +8.3% ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Organisations
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrganizations}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsers} contributeurs actifs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Datasets par Thème</CardTitle>
            <CardDescription>Répartition des jeux de données par catégorie</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {themes.map(theme => (
                <div key={theme.id} className="flex items-center">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{theme.name}</span>
                      <span className="text-sm text-muted-foreground">{theme.datasetsCount}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${(theme.datasetsCount / 15) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Datasets Récents</CardTitle>
            <CardDescription>Les derniers jeux de données ajoutés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {datasets.slice(0, 5).map(dataset => (
                <div key={dataset.id} className="flex items-start gap-3">
                  <div className="mt-1">
                    <Database className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{dataset.title}</p>
                    <p className="text-xs text-muted-foreground">{dataset.producer}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(dataset.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Downloaded Datasets */}
      <Card>
        <CardHeader>
          <CardTitle>Top Datasets</CardTitle>
          <CardDescription>Les jeux de données les plus téléchargés</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Producteur</TableHead>
                <TableHead>Thème</TableHead>
                <TableHead>Téléchargements</TableHead>
                <TableHead>Vues</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datasets
                .sort((a, b) => b.downloadsCount - a.downloadsCount)
                .slice(0, 5)
                .map(dataset => (
                  <TableRow key={dataset.id}>
                    <TableCell>{dataset.title}</TableCell>
                    <TableCell>{dataset.producer}</TableCell>
                    <TableCell>{dataset.theme}</TableCell>
                    <TableCell>{formatNumber(dataset.downloadsCount)}</TableCell>
                    <TableCell>{formatNumber(dataset.viewsCount)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderDatasets = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Jeux de Données</h2>
          <p className="text-muted-foreground">
            Gestion des jeux de données publiques
          </p>
        </div>
        <Button onClick={handleAddDataset}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Dataset
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="published">Publié</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="archived">Archivé</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Thème" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les thèmes</SelectItem>
                {themes.map(theme => (
                  <SelectItem key={theme.id} value={theme.slug}>{theme.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Producteur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les producteurs</SelectItem>
                {organizations.map(org => (
                  <SelectItem key={org.id} value={org.name}>{org.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Plus de filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Datasets Table */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Producteur</TableHead>
                <TableHead>Thème</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Téléchargements</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datasets.map(dataset => (
                <TableRow key={dataset.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {dataset.featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                      {dataset.title}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {dataset.shortDescription}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{dataset.format}</Badge>
                  </TableCell>
                  <TableCell>{dataset.producer}</TableCell>
                  <TableCell>{dataset.theme}</TableCell>
                  <TableCell>{getStatusBadge(dataset.status)}</TableCell>
                  <TableCell>{formatNumber(dataset.downloadsCount)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditDataset(dataset)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteDataset(dataset.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderUsers = () => <UserManagement />

  const renderOrganizations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Organisations</h2>
          <p className="text-muted-foreground">
            Gestion des organisations productrices
          </p>
        </div>
        <Button onClick={handleAddOrganization}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Organisation
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {organizations.map(org => (
          <Card key={org.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{org.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {org.datasetsCount} datasets
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleEditOrganization(org)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Users className="h-4 w-4 mr-2" />
                      Voir utilisateurs
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDeleteOrganization(org.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {org.description}
              </p>
              <div className="space-y-2 text-sm">
                {org.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {org.email}
                  </div>
                )}
                {org.website && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ExternalLink className="h-4 w-4" />
                    <a href={org.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      Site web
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderThemes = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Thèmes</h2>
          <p className="text-muted-foreground">
            Gestion des catégories de jeux de données
          </p>
        </div>
        <Button onClick={() => setThemeModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Thème
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {themes.map(theme => (
          <Card key={theme.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{theme.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {theme.slug}
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Datasets</span>
                <Badge variant="secondary">{theme.datasetsCount}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderLicenses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Licences</h2>
          <p className="text-muted-foreground">
            Gestion des licences d'utilisation
          </p>
        </div>
        <Button onClick={() => setLicenseModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Licence
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {licenses.map(license => (
          <Card key={license.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Scale className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{license.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {license.slug}
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Voir détails
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {license.description}
              </p>
              {license.url && (
                <a
                  href={license.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Voir la licence
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytique</h2>
        <p className="text-muted-foreground">
          Statistiques et métriques de la plateforme
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Taux de téléchargement
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23.1%</div>
            <p className="text-xs text-muted-foreground">
              +2.3% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Utilisateurs actifs
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              +1 nouveau ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Datasets mis à jour
            </CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Requêtes API
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,432</div>
            <p className="text-xs text-muted-foreground">
              Aujourd'hui
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des téléchargements</CardTitle>
            <CardDescription>Derniers 30 jours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-end justify-between gap-2">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-primary/20 rounded-t transition-all hover:bg-primary/30"
                  style={{
                    height: `${Math.random() * 80 + 20}%`
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribution par format</CardTitle>
            <CardDescription>Formats de fichiers les plus utilisés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { format: 'CSV', count: 45, percentage: 60 },
                { format: 'JSON', count: 20, percentage: 27 },
                { format: 'XML', count: 6, percentage: 8 },
                { format: 'XLSX', count: 4, percentage: 5 }
              ].map(item => (
                <div key={item.format} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.format}</span>
                    <span className="text-sm text-muted-foreground">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Paramètres</h2>
        <p className="text-muted-foreground">
          Configuration de la plateforme
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations du site</CardTitle>
              <CardDescription>Informations générales de la plateforme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nom du site</Label>
                <Input defaultValue="JDOM - Jeux de Données Ouverts du Mali" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  defaultValue="Portail de données ouvertes pour le Mali"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Email de contact</Label>
                <Input defaultValue="contact@jdom.ml" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Enregistrer</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
              <CardDescription>Paramètres de sécurité de la plateforme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Authentification à deux facteurs</Label>
                  <p className="text-sm text-muted-foreground">
                    Exiger 2FA pour les administrateurs
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Session sécurisée</Label>
                  <p className="text-sm text-muted-foreground">
                    Utiliser HTTPS uniquement
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Limitation des tentatives</Label>
                  <p className="text-sm text-muted-foreground">
                    Bloquer après 5 tentatives échouées
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Enregistrer</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration API</CardTitle>
              <CardDescription>Paramètres de l'API REST</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>API publique</Label>
                  <p className="text-sm text-muted-foreground">
                    Autoriser l'accès public à l'API
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rate limiting</Label>
                  <p className="text-sm text-muted-foreground">
                    Limiter les requêtes par IP
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Requêtes par minute</Label>
                <Input type="number" defaultValue="60" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Enregistrer</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clés API</CardTitle>
              <CardDescription>Gestion des clés d'accès API</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Générer une nouvelle clé
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Préférences de notification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir les notifications par email
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nouveaux datasets</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifier lors de nouveaux datasets
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rapports hebdomadaires</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir un rapport hebdomadaire
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Enregistrer</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return renderDashboard()
      case 'datasets':
        return renderDatasets()
      case 'users':
        return renderUsers()
      case 'organizations':
        return renderOrganizations()
      case 'themes':
        return renderThemes()
      case 'licenses':
        return renderLicenses()
      case 'analytics':
        return renderAnalytics()
      case 'settings':
        return renderSettings()
      default:
        return renderDashboard()
    }
  }

  // Show loading state while checking authentication (optional - can show dashboard immediately)
  if (isLoadingAuth && isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  // Dashboard is now public - no redirect needed

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
          `}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 p-6 border-b">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Database className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg">JDOM</h1>
                <p className="text-xs text-muted-foreground">
                  Jeux de Données Ouverts
                </p>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <nav className="space-y-1">
                {sidebarItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                      ${currentPage === item.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                      }
                    `}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </ScrollArea>

            <div className="p-4 border-t">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Admin Principal</p>
                      <p className="text-xs text-muted-foreground truncate">
                        admin@jdom.ml
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="sm"
                    onClick={async () => {
                      const { mockLogout } = await import('@/lib/mock/auth')
                      mockLogout()
                      setIsAuthenticated(false)
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </Button>
                </>
              ) : (
                <Button 
                  variant="default" 
                  className="w-full" 
                  size="sm"
                  onClick={() => router.push('/login')}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Se connecter
                </Button>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          {/* Header */}
          <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center gap-4 px-6">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              <div className="flex-1" />

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6">
            {renderPage()}
          </main>
        </div>
      </div>

      {/* Dataset Modal */}
      <Dialog open={datasetModalOpen} onOpenChange={setDatasetModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editDataset ? 'Modifier le Dataset' : 'Nouveau Dataset'}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations du jeu de données
            </DialogDescription>
          </DialogHeader>
          <DatasetForm
            dataset={editDataset}
            organizations={organizations}
            themes={themes}
            licenses={licenses}
            onSave={handleSaveDataset}
            onCancel={() => setDatasetModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* User Modal */}
      <Dialog open={userModalOpen} onOpenChange={setUserModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editUser ? 'Modifier l\'Utilisateur' : 'Nouvel Utilisateur'}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations de l'utilisateur
            </DialogDescription>
          </DialogHeader>
          <UserForm
            user={editUser}
            organizations={organizations}
            onSave={handleSaveUser}
            onCancel={() => setUserModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Organization Modal */}
      <Dialog open={organizationModalOpen} onOpenChange={setOrganizationModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editOrganization ? 'Modifier l\'Organisation' : 'Nouvelle Organisation'}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations de l'organisation
            </DialogDescription>
          </DialogHeader>
          <OrganizationForm
            organization={editOrganization}
            onSave={handleSaveOrganization}
            onCancel={() => setOrganizationModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Theme Modal */}
      <Dialog open={themeModalOpen} onOpenChange={setThemeModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nouveau Thème</DialogTitle>
            <DialogDescription>
              Créer une nouvelle catégorie de jeu de données
            </DialogDescription>
          </DialogHeader>
          <ThemeForm
            onSave={handleSaveTheme}
            onCancel={() => setThemeModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* License Modal */}
      <Dialog open={licenseModalOpen} onOpenChange={setLicenseModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nouvelle Licence</DialogTitle>
            <DialogDescription>
              Ajouter une nouvelle licence d'utilisation
            </DialogDescription>
          </DialogHeader>
          <LicenseForm
            onSave={handleSaveLicense}
            onCancel={() => setLicenseModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Dataset Form Component
function DatasetForm({
  dataset,
  organizations,
  themes,
  licenses,
  onSave,
  onCancel
}: {
  dataset: Dataset | null
  organizations: Organization[]
  themes: Array<{ id: string; name: string; slug: string }>
  licenses: Array<{ id: string; name: string; slug: string }>
  onSave: (data: Partial<Dataset>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<Partial<Dataset>>(dataset || {
    title: '',
    shortDescription: '',
    format: 'CSV',
    status: 'draft',
    updateFrequency: 'Annuelle',
    producer: '',
    theme: '',
    license: 'ODbL',
    featured: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2">
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Titre du jeu de données"
            required
          />
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="description">Description courte</Label>
          <Textarea
            id="description"
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            placeholder="Description courte du jeu de données"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="format">Format *</Label>
          <Select
            value={formData.format}
            onValueChange={(value) => setFormData({ ...formData, format: value })}
          >
            <SelectTrigger id="format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CSV">CSV</SelectItem>
              <SelectItem value="JSON">JSON</SelectItem>
              <SelectItem value="XML">XML</SelectItem>
              <SelectItem value="XLSX">XLSX</SelectItem>
              <SelectItem value="API">API</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select
            value={formData.status}
            onValueChange={(value: any) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Brouillon</SelectItem>
              <SelectItem value="published">Publié</SelectItem>
              <SelectItem value="archived">Archivé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="producer">Producteur *</Label>
          <Select
            value={formData.producer}
            onValueChange={(value) => setFormData({ ...formData, producer: value })}
          >
            <SelectTrigger id="producer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {organizations.map(org => (
                <SelectItem key={org.id} value={org.name}>{org.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="theme">Thème</Label>
          <Select
            value={formData.theme}
            onValueChange={(value) => setFormData({ ...formData, theme: value })}
          >
            <SelectTrigger id="theme">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {themes.map(theme => (
                <SelectItem key={theme.id} value={theme.name}>{theme.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="license">Licence *</Label>
          <Select
            value={formData.license}
            onValueChange={(value) => setFormData({ ...formData, license: value })}
          >
            <SelectTrigger id="license">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {licenses.map(license => (
                <SelectItem key={license.id} value={license.name}>{license.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="frequency">Fréquence de mise à jour</Label>
          <Select
            value={formData.updateFrequency}
            onValueChange={(value) => setFormData({ ...formData, updateFrequency: value })}
          >
            <SelectTrigger id="frequency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Quotidienne">Quotidienne</SelectItem>
              <SelectItem value="Hebdomadaire">Hebdomadaire</SelectItem>
              <SelectItem value="Mensuelle">Mensuelle</SelectItem>
              <SelectItem value="Trimestrielle">Trimestrielle</SelectItem>
              <SelectItem value="Annuelle">Annuelle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2 col-span-2">
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
          />
          <Label htmlFor="featured">Dataset à la une</Label>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {dataset ? 'Modifier' : 'Créer'}
        </Button>
      </DialogFooter>
    </form>
  )
}

// User Form Component
function UserForm({
  user,
  organizations,
  onSave,
  onCancel
}: {
  user: User | null
  organizations: Organization[]
  onSave: (data: Partial<User>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<Partial<User>>(user || {
    name: '',
    email: '',
    role: 'public',
    organization: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom complet *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nom de l'utilisateur"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="email@exemple.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Rôle *</Label>
        <Select
          value={formData.role}
          onValueChange={(value: any) => setFormData({ ...formData, role: value })}
        >
          <SelectTrigger id="role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="contributor">Contributeur</SelectItem>
            <SelectItem value="public">Public</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="organization">Organisation</Label>
        <Select
          value={formData.organization}
          onValueChange={(value) => setFormData({ ...formData, organization: value })}
        >
          <SelectTrigger id="organization">
            <SelectValue placeholder="Sélectionner une organisation" />
          </SelectTrigger>
          <SelectContent>
            {organizations.map(org => (
              <SelectItem key={org.id} value={org.name}>{org.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {user ? 'Modifier' : 'Créer'}
        </Button>
      </DialogFooter>
    </form>
  )
}

// Organization Form Component
function OrganizationForm({
  organization,
  onSave,
  onCancel
}: {
  organization: Organization | null
  onSave: (data: Partial<Organization>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<Partial<Organization>>(organization || {
    name: '',
    description: '',
    email: '',
    website: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="orgName">Nom *</Label>
        <Input
          id="orgName"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nom de l'organisation"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="orgDescription">Description</Label>
        <Textarea
          id="orgDescription"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description de l'organisation"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="orgEmail">Email</Label>
        <Input
          id="orgEmail"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="contact@organisation.ml"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="orgWebsite">Site web</Label>
        <Input
          id="orgWebsite"
          type="url"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          placeholder="https://www.organisation.ml"
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {organization ? 'Modifier' : 'Créer'}
        </Button>
      </DialogFooter>
    </form>
  )
}

// Theme Form Component
function ThemeForm({ 
  onSave, 
  onCancel 
}: { 
  onSave: (data: { name: string; slug: string; description?: string }) => void
  onCancel: () => void 
}) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !slug.trim()) {
      return
    }
    onSave({ name: name.trim(), slug: slug.trim(), description: description.trim() || undefined })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="themeName">Nom *</Label>
        <Input
          id="themeName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom du thème"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="themeSlug">Slug *</Label>
        <Input
          id="themeSlug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="slug-du-theme"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="themeDescription">Description</Label>
        <Textarea
          id="themeDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description du thème"
          rows={3}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">Créer</Button>
      </DialogFooter>
    </form>
  )
}

// License Form Component
function LicenseForm({ 
  onSave, 
  onCancel 
}: { 
  onSave: (data: { name: string; slug: string; description?: string; url?: string }) => void
  onCancel: () => void 
}) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !slug.trim()) {
      return
    }
    onSave({ 
      name: name.trim(), 
      slug: slug.trim(), 
      description: description.trim() || undefined,
      url: url.trim() || undefined
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="licenseName">Nom *</Label>
        <Input
          id="licenseName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom de la licence"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="licenseSlug">Slug *</Label>
        <Input
          id="licenseSlug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="slug-de-la-licence"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="licenseDescription">Description</Label>
        <Textarea
          id="licenseDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description de la licence"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="licenseUrl">URL</Label>
        <Input
          id="licenseUrl"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">Créer</Button>
      </DialogFooter>
    </form>
  )
}

// Add missing icon
function Mail({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function Star({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

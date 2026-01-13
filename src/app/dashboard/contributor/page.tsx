'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Database,
  Plus,
  Search,
  Filter,
  FileText,
  Upload,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  BarChart3,
  Users,
  LogOut,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'

interface Dataset {
  id: string
  title: string
  shortDescription: string
  format: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'published'
  publicationDate: string
  updateFrequency: string
  producer: string
  theme: string
  license: string
  version: number
  lastUpdated: string
  downloadsCount: number
  viewsCount: number
}

interface Organization {
  id: string
  name: string
  description: string
  datasetsCount: number
  pendingCount: number
}

export default function ContributorDashboard() {
  const router = useRouter()
  const { toast } = useToast()

  // Authentication check
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)

  // States
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [themeFilter, setThemeFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('datasets')

  // Dialog states
  const [submitModalOpen, setSubmitModalOpen] = useState(false)
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null)

  // Mock data
  const [datasets] = useState<Dataset[]>([
    {
      id: '1',
      title: 'Statistiques démographiques 2024',
      shortDescription: 'Données démographiques détaillées par région',
      format: 'CSV',
      status: 'published',
      publicationDate: '2024-01-15',
      updateFrequency: 'Annuelle',
      producer: 'INSTAT',
      theme: 'Démographie',
      license: 'ODbL',
      version: 2,
      lastUpdated: '2024-01-15',
      downloadsCount: 1250,
      viewsCount: 5432
    },
    {
      id: '2',
      title: 'Infrastructures de santé',
      shortDescription: 'Localisation et caractéristiques des centres de santé',
      format: 'JSON',
      status: 'published',
      publicationDate: '2024-02-01',
      updateFrequency: 'Mensuelle',
      producer: 'Ministère de la Santé',
      theme: 'Santé',
      license: 'CC-BY 4.0',
      version: 1,
      lastUpdated: '2024-02-01',
      downloadsCount: 892,
      viewsCount: 3210
    },
    {
      id: '3',
      title: 'Indicateurs économiques régionaux Q1',
      shortDescription: 'PIB, emploi et commerce par région - 1er trimestre 2024',
      format: 'CSV',
      status: 'submitted',
      publicationDate: '',
      updateFrequency: 'Trimestrielle',
      producer: 'Ministère de l\'Économie',
      theme: 'Économie',
      license: 'ODbL',
      version: 1,
      lastUpdated: '2024-03-01',
      downloadsCount: 0,
      viewsCount: 0
    },
    {
      id: '4',
      title: 'Établissements scolaires - Mise à jour',
      shortDescription: 'Données mises à jour avec les nouvelles écoles',
      format: 'JSON',
      status: 'draft',
      publicationDate: '',
      updateFrequency: 'Annuelle',
      producer: 'Ministère de l\'Éducation',
      theme: 'Éducation',
      license: 'CC-BY 4.0',
      version: 3,
      lastUpdated: '2024-03-05',
      downloadsCount: 0,
      viewsCount: 0
    },
    {
      id: '5',
      title: 'Qualité de l\'air 2024',
      shortDescription: 'Mesures de pollution atmosphérique dans les grandes villes',
      format: 'CSV',
      status: 'rejected',
      publicationDate: '',
      updateFrequency: 'Quotidienne',
      producer: 'Ministère de l\'Environnement',
      theme: 'Environnement',
      license: 'CC0',
      version: 1,
      lastUpdated: '2024-02-20',
      downloadsCount: 0,
      viewsCount: 0
    }
  ])

  const [organizations] = useState<Organization[]>([
    {
      id: '1',
      name: 'INSTAT',
      description: 'Institut National de la Statistique du Mali',
      datasetsCount: 15,
      pendingCount: 2
    },
    {
      id: '2',
      name: 'Ministère de la Santé',
      description: 'Ministère de la Santé et de l\'Hygiène Publique',
      datasetsCount: 12,
      pendingCount: 1
    },
    {
      id: '3',
      name: 'Ministère de l\'Économie',
      description: 'Ministère de l\'Économie et des Finances',
      datasetsCount: 8,
      pendingCount: 3
    }
  ])

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { mockSessionApi } = await import('@/lib/mock/api')
        const result = await mockSessionApi.getSession()

        if (result.success && result.data?.authenticated) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          // Redirect to login with return URL
          const currentPath = window.location.pathname
          router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
        router.push('/login')
      } finally {
        setIsLoadingAuth(false)
      }
    }

    checkAuth()
  }, [router])

  // Stats calculations
  const stats = {
    totalDatasets: datasets.length,
    publishedDatasets: datasets.filter(d => d.status === 'published').length,
    submittedDatasets: datasets.filter(d => d.status === 'submitted').length,
    draftDatasets: datasets.filter(d => d.status === 'draft').length,
    rejectedDatasets: datasets.filter(d => d.status === 'rejected').length,
    totalDownloads: datasets.reduce((sum, d) => sum + d.downloadsCount, 0),
    totalViews: datasets.reduce((sum, d) => sum + d.viewsCount, 0),
    organizations: organizations.length,
    pendingApprovals: datasets.filter(d => d.status === 'submitted').length
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      published: 'default',
      submitted: 'secondary',
      draft: 'outline',
      rejected: 'destructive',
      approved: 'default'
    }
    const labels: Record<string, string> = {
      published: 'Publié',
      submitted: 'Soumis',
      draft: 'Brouillon',
      rejected: 'Rejeté',
      approved: 'Approuvé'
    }
    const icons: Record<string, any> = {
      published: CheckCircle2,
      submitted: Clock,
      draft: FileText,
      rejected: XCircle,
      approved: CheckCircle2
    }
    const Icon = icons[status] || FileText

    return (
      <Badge variant={variants[status] || 'secondary'} className="gap-1">
        <Icon className="h-3 w-3" />
        {labels[status] || status}
      </Badge>
    )
  }

  const handleLogout = async () => {
    try {
      const { mockLogout } = await import('@/lib/mock/auth')
      mockLogout()

      toast({
        title: 'Déconnexion réussie',
        description: 'Vous avez été déconnecté avec succès'
      })

      // Force redirect after a short delay
      setTimeout(() => {
        window.location.href = '/login'
      }, 500)
    } catch (error) {
      console.error('Logout: Error caught:', error)

      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur lors de la déconnexion',
        variant: 'destructive'
      })

      // Force redirect even on error
      setTimeout(() => {
        window.location.href = '/login'
      }, 1000)
    }
  }

  const handleSubmitDataset = async (formData: any) => {
    try {
      // Mock: Simulate dataset creation
      // In a real app, this would call the API
      await new Promise(resolve => setTimeout(resolve, 500))

      toast({
        title: 'Dataset soumis',
        description: 'Votre dataset a été soumis pour validation (mode mock)'
      })

      setSubmitModalOpen(false)
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur lors de la soumission',
        variant: 'destructive'
      })
    }
  }

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = searchTerm === '' ||
      dataset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dataset.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || dataset.status === statusFilter
    const matchesTheme = themeFilter === 'all' || dataset.theme === themeFilter
    return matchesSearch && matchesStatus && matchesTheme
  })

  // Show loading state while checking authentication
  if (isLoadingAuth || isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Vérification de l'authentification...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated (handled by useEffect, but show message just in case)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Database className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Dashboard Contributeur</h1>
              <p className="text-sm text-muted-foreground">JDOM - Jeux de Données Ouverts</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <LogOut className="h-4 w-4" onClick={handleLogout} />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Mes Datasets</CardTitle>
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
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{stats.submittedDatasets}</div>
              <p className="text-xs text-muted-foreground">
                Soumissions en attente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Téléchargements</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDownloads.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +15% ce mois
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Organisations</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.organizations}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingApprovals} en attente
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="datasets">
              <FileText className="h-4 w-4 mr-2" />
              Mes Datasets
            </TabsTrigger>
            <TabsTrigger value="organizations">
              <Building2 className="h-4 w-4 mr-2" />
              Organisations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="datasets" className="space-y-4">
            {/* Action Bar */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher dans mes datasets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="published">Publié</SelectItem>
                    <SelectItem value="submitted">Soumis</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="rejected">Rejeté</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => setSubmitModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Soumettre
                </Button>
              </div>
            </div>

            {/* Datasets Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Mà à jour</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDatasets.map(dataset => (
                      <TableRow key={dataset.id}>
                        <TableCell className="font-medium">{dataset.title}</TableCell>
                        <TableCell className="max-w-xs truncate text-muted-foreground">
                          {dataset.shortDescription}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{dataset.format}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(dataset.status)}</TableCell>
                        <TableCell>v{dataset.version}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {dataset.lastUpdated}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Users className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => setSelectedDataset(dataset)}>
                                <Upload className="h-4 w-4 mr-2" />
                                Mise à jour
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setSelectedDataset(dataset)}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Nouvelle version
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setPreviewModalOpen(true)}>
                                <Database className="h-4 w-4 mr-2" />
                                Aperçu
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {dataset.status === 'rejected' && (
                                <DropdownMenuItem>
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Resoumettre
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organizations" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {organizations.map(org => (
                <Card key={org.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{org.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {org.datasetsCount} datasets
                          </CardDescription>
                        </div>
                      </div>
                      {org.pendingCount > 0 && (
                        <Badge variant="secondary">{org.pendingCount}</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {org.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Datasets en attente
                      </span>
                      <span className="text-sm font-medium text-yellow-600">
                        {org.pendingCount}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Submit Dataset Modal */}
      <Dialog open={submitModalOpen} onOpenChange={setSubmitModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Soumettre un nouveau Dataset</DialogTitle>
            <DialogDescription>
              Remplissez les métadonnées de votre jeu de données
            </DialogDescription>
          </DialogHeader>
          <DatasetForm
            mode="create"
            onSubmit={handleSubmitDataset}
            onCancel={() => setSubmitModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Update Dataset Modal */}
      <Dialog open={updateModalOpen} onOpenChange={setUpdateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Mettre à jour le Dataset</DialogTitle>
            <DialogDescription>
              Créer une nouvelle version du dataset
            </DialogDescription>
          </DialogHeader>
          <DatasetForm
            mode="update"
            dataset={selectedDataset}
            onSubmit={handleSubmitDataset}
            onCancel={() => setUpdateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Dataset Form Component with Validation
function DatasetForm({
  mode,
  dataset,
  onSubmit,
  onCancel
}: {
  mode: 'create' | 'update'
  dataset: Dataset | null
  onSubmit: (data: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: dataset?.title || '',
    shortDescription: dataset?.shortDescription || '',
    description: dataset?.description || '',
    format: dataset?.format || 'CSV',
    theme: dataset?.theme || '',
    producer: dataset?.producer || '',
    license: dataset?.license || 'ODbL',
    updateFrequency: dataset?.updateFrequency || 'Annuelle',
    spatialCoverage: '',
    temporalCoverage: '',
    keywords: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const themes = [
    { id: '1', name: 'Démographie' },
    { id: '2', name: 'Santé' },
    { id: '3', name: 'Économie' },
    { id: '4', name: 'Éducation' },
    { id: '5', name: 'Environnement' },
    { id: '6', name: 'Transport' },
    { id: '7', name: 'Infrastructure' }
  ]

  const licenses = [
    { id: '1', name: 'ODbL', description: 'Open Database License' },
    { id: '2', name: 'CC-BY 4.0', description: 'Creative Commons Attribution 4.0' },
    { id: '3', name: 'CC0', description: 'Creative Commons Zero (Public Domain)' }
  ]

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis'
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'La description courte est requise'
    }

    if (!formData.theme) {
      newErrors.theme = 'Le thème est requis'
    }

    if (!formData.producer) {
      newErrors.producer = 'Le producteur est requis'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Titre *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Titre du jeu de données"
          className={errors.title ? 'border-destructive' : ''}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortDescription">Description courte *</Label>
        <Textarea
          id="shortDescription"
          value={formData.shortDescription}
          onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
          placeholder="Brève description du dataset"
          rows={2}
          className={errors.shortDescription ? 'border-destructive' : ''}
        />
        {errors.shortDescription && (
          <p className="text-sm text-destructive">{errors.shortDescription}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
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
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="updateFrequency">Fréquence de mise à jour *</Label>
          <Select
            value={formData.updateFrequency}
            onValueChange={(value) => setFormData({ ...formData, updateFrequency: value })}
          >
            <SelectTrigger id="updateFrequency">
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="theme">Thème *</Label>
        <Select
          value={formData.theme}
          onValueChange={(value) => setFormData({ ...formData, theme: value })}
        >
          <SelectTrigger id="theme" className={errors.theme ? 'border-destructive' : ''}>
            <SelectValue placeholder="Sélectionner un thème" />
          </SelectTrigger>
          <SelectContent>
            {themes.map(theme => (
              <SelectItem key={theme.id} value={theme.name}>{theme.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.theme && (
          <p className="text-sm text-destructive">{errors.theme}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="producer">Producteur *</Label>
        <Input
          id="producer"
          value={formData.producer}
          onChange={(e) => setFormData({ ...formData, producer: e.target.value })}
          placeholder="Organisation productrice"
          className={errors.producer ? 'border-destructive' : ''}
        />
        {errors.producer && (
          <p className="text-sm text-destructive">{errors.producer}</p>
        )}
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
              <SelectItem key={license.id} value={license.name}>
                {license.name} - {license.description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="spatialCoverage">Couverture spatiale</Label>
        <Input
          id="spatialCoverage"
          value={formData.spatialCoverage}
          onChange={(e) => setFormData({ ...formData, spatialCoverage: e.target.value })}
          placeholder="Ex: Mali, Région de Kayes"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="temporalCoverage">Couverture temporelle</Label>
        <Input
          id="temporalCoverage"
          value={formData.temporalCoverage}
          onChange={(e) => setFormData({ ...formData, temporalCoverage: e.target.value })}
          placeholder="Ex: 2020-2024"
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Soumission...' : mode === 'create' ? 'Soumettre' : 'Créer version'}
        </Button>
      </DialogFooter>
    </form>
  )
}

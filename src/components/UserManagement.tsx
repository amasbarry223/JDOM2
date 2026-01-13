'use client'
import { useState } from 'react'
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  User,
  Crown,
  BadgeCheck,
  Eye,
  Check,
  X,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Key,
  Lock,
  Unlock,
  Users,
  Database,
  Building2,
  ChevronDown,
  ChevronUp,
  MoreHorizontal
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'

interface EnhancedUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'contributor' | 'public'
  organization?: string
  createdAt: string
  datasetsCount?: number
  publishedDatasetsCount?: number
  draftDatasetsCount?: number
  permissions?: string[]
}

interface RoleInfo {
  key: string
  name: string
  nameEn: string
  description: string
  descriptionEn: string
  color: string
  priority: number
  permissions: Array<{
    key: string
    category: string
    description: string
  }>
  permissionsCount: number
}

// Role definitions
const ROLES: RoleInfo[] = [
  {
    key: 'admin',
    name: 'Administrateur',
    nameEn: 'Administrator',
    description: 'Accès complet à toutes les fonctionnalités de la plateforme',
    descriptionEn: 'Full access to all platform features',
    color: 'red',
    priority: 3,
    permissions: [
      { key: 'users:read', category: 'Utilisateurs', description: 'Voir les utilisateurs' },
      { key: 'users:create', category: 'Utilisateurs', description: 'Créer des utilisateurs' },
      { key: 'users:update', category: 'Utilisateurs', description: 'Modifier des utilisateurs' },
      { key: 'users:delete', category: 'Utilisateurs', description: 'Supprimer des utilisateurs' },
      { key: 'datasets:read', category: 'Datasets', description: 'Voir les datasets' },
      { key: 'datasets:create', category: 'Datasets', description: 'Créer des datasets' },
      { key: 'datasets:update', category: 'Datasets', description: 'Modifier des datasets' },
      { key: 'datasets:delete', category: 'Datasets', description: 'Supprimer des datasets' },
      { key: 'datasets:publish', category: 'Datasets', description: 'Publier des datasets' },
      { key: 'organizations:read', category: 'Organisations', description: 'Voir les organisations' },
      { key: 'organizations:create', category: 'Organisations', description: 'Créer des organisations' },
      { key: 'organizations:update', category: 'Organisations', description: 'Modifier les organisations' },
      { key: 'organizations:delete', category: 'Organisations', description: 'Supprimer les organisations' },
      { key: 'themes:read', category: 'Thèmes', description: 'Voir les thèmes' },
      { key: 'themes:create', category: 'Thèmes', description: 'Créer des thèmes' },
      { key: 'themes:update', category: 'Thèmes', description: 'Modifier les thèmes' },
      { key: 'themes:delete', category: 'Thèmes', description: 'Supprimer les thèmes' },
      { key: 'licenses:read', category: 'Licences', description: 'Voir les licences' },
      { key: 'licenses:create', category: 'Licences', description: 'Créer des licences' },
      { key: 'licenses:update', category: 'Licences', description: 'Modifier les licences' },
      { key: 'licenses:delete', category: 'Licences', description: 'Supprimer les licences' },
      { key: 'stats:read', category: 'Statistiques', description: 'Voir les statistiques' },
      { key: 'settings:read', category: 'Paramètres', description: 'Voir les paramètres' },
      { key: 'settings:update', category: 'Paramètres', description: 'Modifier les paramètres' }
    ],
    permissionsCount: 23
  },
  {
    key: 'contributor',
    name: 'Contributeur',
    nameEn: 'Contributor',
    description: 'Peut créer et modifier des datasets, lire les organisations et les statistiques',
    descriptionEn: 'Can create and edit datasets, read organizations and statistics',
    color: 'blue',
    priority: 2,
    permissions: [
      { key: 'users:read', category: 'Utilisateurs', description: 'Voir les utilisateurs' },
      { key: 'datasets:read', category: 'Datasets', description: 'Voir les datasets' },
      { key: 'datasets:create', category: 'Datasets', description: 'Créer des datasets' },
      { key: 'datasets:update', category: 'Datasets', description: 'Modifier des datasets' },
      { key: 'datasets:publish', category: 'Datasets', description: 'Publier des datasets' },
      { key: 'organizations:read', category: 'Organisations', description: 'Voir les organisations' },
      { key: 'themes:read', category: 'Thèmes', description: 'Voir les thèmes' },
      { key: 'licenses:read', category: 'Licences', description: 'Voir les licences' },
      { key: 'stats:read', category: 'Statistiques', description: 'Voir les statistiques' }
    ],
    permissionsCount: 9
  },
  {
    key: 'public',
    name: 'Public',
    nameEn: 'Public',
    description: 'Accès en lecture seule aux données publiques',
    descriptionEn: 'Read-only access to public data',
    color: 'gray',
    priority: 1,
    permissions: [
      { key: 'datasets:read', category: 'Datasets', description: 'Voir les datasets' },
      { key: 'organizations:read', category: 'Organisations', description: 'Voir les organisations' },
      { key: 'themes:read', category: 'Thèmes', description: 'Voir les thèmes' },
      { key: 'licenses:read', category: 'Licences', description: 'Voir les licences' }
    ],
    permissionsCount: 4
  }
]

export default function UserManagement() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [orgFilter, setOrgFilter] = useState('all')

  // Dialog states
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false)
  const [editUserModalOpen, setEditUserModalOpen] = useState(false)
  const [changeRoleModalOpen, setChangeRoleModalOpen] = useState(false)
  const [viewPermissionsModalOpen, setViewPermissionsModalOpen] = useState(false)

  // Selected states
  const [selectedUser, setSelectedUser] = useState<EnhancedUser | null>(null)
  const [selectedRole, setSelectedRole] = useState<EnhancedUser | null>(null)

  // Mock data
  const [users] = useState<EnhancedUser[]>([
    {
      id: '1',
      name: 'Admin Principal',
      email: 'admin@jdom.ml',
      role: 'admin',
      organization: 'Équipe JDOM',
      createdAt: '2024-01-01',
      datasetsCount: 0,
      publishedDatasetsCount: 0,
      draftDatasetsCount: 0,
      permissions: ROLES[0].permissions.map(p => p.key)
    },
    {
      id: '2',
      name: 'Marie Koné',
      email: 'marie.kone@instat.ml',
      role: 'contributor',
      organization: 'INSTAT',
      createdAt: '2024-01-15',
      datasetsCount: 5,
      publishedDatasetsCount: 4,
      draftDatasetsCount: 1,
      permissions: ROLES[1].permissions.map(p => p.key)
    },
    {
      id: '3',
      name: 'Ahoudo Touré',
      email: 'ahoudo@sante.ml',
      role: 'contributor',
      organization: 'Ministère de la Santé',
      createdAt: '2024-02-01',
      datasetsCount: 8,
      publishedDatasetsCount: 6,
      draftDatasetsCount: 2,
      permissions: ROLES[1].permissions.map(p => p.key)
    },
    {
      id: '4',
      name: 'Ibrahim Diallo',
      email: 'ibrahim@economie.ml',
      role: 'contributor',
      organization: 'Ministère de l\'Économie',
      createdAt: '2024-02-15',
      datasetsCount: 3,
      publishedDatasetsCount: 3,
      draftDatasetsCount: 0,
      permissions: ROLES[1].permissions.map(p => p.key)
    },
    {
      id: '5',
      name: 'Fatoumata Coulibaly',
      email: 'fatoumata@education.ml',
      role: 'contributor',
      organization: 'Ministère de l\'Éducation',
      createdAt: '2024-03-01',
      datasetsCount: 12,
      publishedDatasetsCount: 10,
      draftDatasetsCount: 2,
      permissions: ROLES[1].permissions.map(p => p.key)
    },
    {
      id: '6',
      name: 'Utilisateur Test',
      email: 'test@example.com',
      role: 'public',
      createdAt: '2024-03-10',
      datasetsCount: 0,
      publishedDatasetsCount: 0,
      draftDatasetsCount: 0,
      permissions: ROLES[2].permissions.map(p => p.key)
    }
  ])

  const organizations = [
    { id: '1', name: 'Équipe JDOM' },
    { id: '2', name: 'INSTAT' },
    { id: '3', name: 'Ministère de la Santé' },
    { id: '4', name: 'Ministère de l\'Économie' },
    { id: '5', name: 'Ministère de l\'Éducation' }
  ]

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesOrg = orgFilter === 'all' || user.organization === orgFilter
    return matchesSearch && matchesRole && matchesOrg
  })

  const getRoleInfo = (role: string) => ROLES.find(r => r.key === role) || ROLES[2]

  const getRoleBadge = (role: string) => {
    const roleInfo = getRoleInfo(role)
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      admin: 'default',
      contributor: 'secondary',
      public: 'outline'
    }
    return (
      <Badge variant={variants[role] || 'outline'} className="gap-1">
        {role === 'admin' && <Crown className="h-3 w-3" />}
        {role === 'contributor' && <ShieldCheck className="h-3 w-3" />}
        {role === 'public' && <Users className="h-3 w-3" />}
        {roleInfo.name}
      </Badge>
    )
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-5 w-5 text-red-500" />
      case 'contributor':
        return <ShieldCheck className="h-5 w-5 text-blue-500" />
      default:
        return <Users className="h-5 w-5 text-gray-500" />
    }
  }

  const handleChangeRole = (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (user) {
      setSelectedUser(user)
      setChangeRoleModalOpen(true)
    }
  }

  const handleViewPermissions = (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (user) {
      setSelectedUser(user)
      setViewPermissionsModalOpen(true)
    }
  }

  const handleEditUser = (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (user) {
      setSelectedUser(user)
      setEditUserModalOpen(true)
    }
  }

  const handleDeleteUser = (userId: string) => {
    toast({
      title: 'Utilisateur supprimé',
      description: 'L\'utilisateur a été supprimé avec succès.'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground">
            Gérer les utilisateurs, les rôles et les permissions d'accès
          </p>
        </div>
        <Button onClick={() => setCreateUserModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel Utilisateur
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              Actifs sur la plateforme
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Administrateurs</CardTitle>
            <Crown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</div>
            <p className="text-xs text-muted-foreground">
              Accès complet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Contributeurs</CardTitle>
            <ShieldCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.role === 'contributor').length}</div>
            <p className="text-xs text-muted-foreground">
              Peuvent créer des datasets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Public</CardTitle>
            <Lock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.role === 'public').length}</div>
            <p className="text-xs text-muted-foreground">
              Accès lecture seule
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="roles">Rôles & Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par nom ou email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les rôles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="contributor">Contributeur</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={orgFilter} onValueChange={setOrgFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Organisation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les organisations</SelectItem>
                    {organizations.map(org => (
                      <SelectItem key={org.id} value={org.name}>{org.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Organisation</TableHead>
                    <TableHead>Datasets</TableHead>
                    <TableHead>Créé le</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{user.name}</span>
                              {user.role === 'admin' && <Crown className="h-3 w-3 text-red-500" />}
                            </div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{user.organization || '-'}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{user.datasetsCount || 0} total</div>
                          <div className="text-xs text-muted-foreground">
                            {user.publishedDatasetsCount || 0} publiés
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.createdAt}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier profil
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewPermissions(user.id)}>
                              <Key className="h-4 w-4 mr-2" />
                              Voir permissions
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangeRole(user.id)}>
                              <Shield className="h-4 w-4 mr-2" />
                              Changer rôle
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteUser(user.id)}
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
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            {ROLES.map(role => (
              <Card key={role.key} className="relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-${role.color}-500`} />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-lg bg-${role.color}-500/10 flex items-center justify-center`}>
                        {getRoleIcon(role.key)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{role.name}</CardTitle>
                        <CardDescription className="text-xs">{role.nameEn}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {role.permissionsCount} permissions
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {role.description}
                  </p>
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">
                      Accès principal :
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 4).map(perm => (
                        <Badge key={perm.key} variant="secondary" className="text-xs">
                          {perm.category}
                        </Badge>
                      ))}
                      {role.permissions.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{role.permissions.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedUser({
                        id: role.key,
                        name: role.name,
                        email: '',
                        role: role.key as any,
                        createdAt: '',
                        permissions: role.permissions.map(p => p.key)
                      } as any)
                      setViewPermissionsModalOpen(true)
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir toutes les permissions
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create User Modal */}
      <Dialog open={createUserModalOpen} onOpenChange={setCreateUserModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
            <DialogDescription>
              Remplissez les informations du nouvel utilisateur
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newUserName">Nom complet *</Label>
              <Input id="newUserName" placeholder="Nom de l'utilisateur" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newUserEmail">Email *</Label>
              <Input id="newUserEmail" type="email" placeholder="email@exemple.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newUserPassword">Mot de passe *</Label>
              <Input id="newUserPassword" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newUserRole">Rôle *</Label>
              <Select>
                <SelectTrigger id="newUserRole">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map(role => (
                    <SelectItem key={role.key} value={role.key}>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(role.key)}
                        <span>{role.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newUserOrg">Organisation</Label>
              <Select>
                <SelectTrigger id="newUserOrg">
                  <SelectValue placeholder="Sélectionner une organisation" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map(org => (
                    <SelectItem key={org.id} value={org.name}>{org.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateUserModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={() => {
              toast({
                title: 'Utilisateur créé',
                description: 'L\'utilisateur a été créé avec succès.'
              })
              setCreateUserModalOpen(false)
            }}>
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={editUserModalOpen} onOpenChange={setEditUserModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              Modifier les informations de l'utilisateur
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editUserName">Nom complet</Label>
              <Input id="editUserName" defaultValue={selectedUser?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editUserEmail">Email</Label>
              <Input id="editUserEmail" type="email" defaultValue={selectedUser?.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editUserOrg">Organisation</Label>
              <Select>
                <SelectTrigger id="editUserOrg">
                  <SelectValue placeholder={selectedUser?.organization || 'Sélectionner une organisation'} />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map(org => (
                    <SelectItem key={org.id} value={org.name}>{org.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUserModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={() => {
              toast({
                title: 'Utilisateur modifié',
                description: 'Les modifications ont été enregistrées.'
              })
              setEditUserModalOpen(false)
            }}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Modal */}
      <Dialog open={changeRoleModalOpen} onOpenChange={setChangeRoleModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Changer le rôle de l'utilisateur</DialogTitle>
            <DialogDescription>
              Modifier le rôle et les permissions d'accès de {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  {selectedUser?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{selectedUser?.name}</div>
                <div className="text-sm text-muted-foreground">{selectedUser?.email}</div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="changeRole">Nouveau rôle *</Label>
              <Select>
                <SelectTrigger id="changeRole">
                  <SelectValue placeholder={selectedUser?.role} />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map(role => (
                    <SelectItem key={role.key} value={role.key}>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(role.key)}
                        <div>
                          <div className="font-medium">{role.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {role.permissionsCount} permissions
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangeRoleModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={() => {
              toast({
                title: 'Rôle modifié',
                description: 'Le rôle de l\'utilisateur a été modifié avec succès.'
              })
              setChangeRoleModalOpen(false)
            }}>
              Changer le rôle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Permissions Modal */}
      <Dialog open={viewPermissionsModalOpen} onOpenChange={setViewPermissionsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Permissions d'accès</DialogTitle>
            <DialogDescription>
              {selectedUser?.name ? `Permissions de ${selectedUser.name}` : 'Liste des permissions'}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-6 py-4">
              {ROLES.map(role => {
                const isUserRole = selectedUser?.role === role.key
                const userPermissions = selectedUser?.permissions || []

                return (
                  <div key={role.key} className={`p-4 rounded-lg border ${isUserRole ? 'bg-primary/5 border-primary' : ''}`}>
                    <div className="flex items-center gap-3 mb-4">
                      {getRoleIcon(role.key)}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{role.name}</span>
                          {isUserRole && <Badge>Rôle actuel</Badge>}
                        </div>
                        <div className="text-sm text-muted-foreground">{role.description}</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {Object.entries(
                        role.permissions.reduce((acc: any, perm) => {
                          if (!acc[perm.category]) {
                            acc[perm.category] = []
                          }
                          acc[perm.category].push(perm)
                          return acc
                        }, {})
                      ).map(([category, perms]: [string, any]) => (
                        <div key={category}>
                          <div className="text-xs font-medium text-muted-foreground mb-2">
                            {category}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {perms.map((perm: any) => {
                              const hasPermission = isUserRole || userPermissions.includes(perm.key)
                              return (
                                <div
                                  key={perm.key}
                                  className={`flex items-center gap-2 p-2 rounded text-sm ${
                                    hasPermission ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'
                                  }`}
                                >
                                  {hasPermission ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                  <span className="truncate">{perm.description}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button onClick={() => setViewPermissionsModalOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

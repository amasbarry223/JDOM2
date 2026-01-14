/**
 * Analytics Page
 * Page for viewing platform analytics
 */

'use client'

import { TrendingUp, Users, RefreshCw, Globe } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useDatasetStore } from '@/store/datasetStore'
import { useUserStore } from '@/store/userStore'

export default function AnalyticsPage() {
  const datasets = useDatasetStore((state) => state.datasets)
  const users = useUserStore((state) => state.users)

  const stats = {
    downloadRate: 23.1,
    activeUsers: users.filter((u) => u.role !== 'public').length,
    updatedDatasets: 12,
    apiRequests: 8432,
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytique</h2>
        <p className="text-muted-foreground">Statistiques et métriques de la plateforme</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taux de téléchargement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.downloadRate}%</div>
            <p className="text-xs text-muted-foreground">+2.3% par rapport au mois dernier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">+1 nouveau ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Datasets mis à jour</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.updatedDatasets}</div>
            <p className="text-xs text-muted-foreground">Cette semaine</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Requêtes API</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.apiRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Aujourd'hui</p>
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
                    height: `${Math.random() * 80 + 20}%`,
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
                { format: 'XLSX', count: 4, percentage: 5 },
              ].map((item) => (
                <div key={item.format} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.format}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.count} ({item.percentage}%)
                    </span>
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
}


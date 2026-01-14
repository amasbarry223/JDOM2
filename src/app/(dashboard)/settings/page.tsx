/**
 * Settings Page
 * Page for platform settings
 */

'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Paramètres</h2>
        <p className="text-muted-foreground">Configuration de la plateforme</p>
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
                <Textarea defaultValue="Portail de données ouvertes pour le Mali" rows={3} />
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
                  <p className="text-sm text-muted-foreground">Exiger 2FA pour les administrateurs</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Session sécurisée</Label>
                  <p className="text-sm text-muted-foreground">Utiliser HTTPS uniquement</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Limitation des tentatives</Label>
                  <p className="text-sm text-muted-foreground">Bloquer après 5 tentatives échouées</p>
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
                  <p className="text-sm text-muted-foreground">Autoriser l'accès public à l'API</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rate limiting</Label>
                  <p className="text-sm text-muted-foreground">Limiter les requêtes par IP</p>
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
                  <p className="text-sm text-muted-foreground">Recevoir les notifications par email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nouveaux datasets</Label>
                  <p className="text-sm text-muted-foreground">Notifier lors de nouveaux datasets</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rapports hebdomadaires</Label>
                  <p className="text-sm text-muted-foreground">Recevoir un rapport hebdomadaire</p>
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
}


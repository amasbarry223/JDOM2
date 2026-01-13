'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, XCircle, LogOut, RefreshCw, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function TestAuthPage() {
  const router = useRouter()

  const [sessionStatus, setSessionStatus] = useState<{
    loading: boolean
    hasCookie: boolean
    hasSession: boolean
    authenticated: boolean
    userId: string | null
  }>({
    loading: true,
    hasCookie: false,
    hasSession: false,
    authenticated: false,
    userId: null
  })

  const [testResults, setTestResults] = useState<Array<{
    test: string
    status: 'success' | 'error' | 'pending'
    message: string
    timestamp: string
  }>>([])

  const checkSession = async () => {
    setSessionStatus(prev => ({ ...prev, loading: true }))

    try {
      const { getMockSession, getMockUser } = await import('@/lib/mock/auth')
      const session = getMockSession()
      const user = getMockUser()

      setSessionStatus({
        loading: false,
        hasCookie: !!session,
        hasSession: !!session,
        authenticated: !!user,
        userId: user?.id || null
      })
    } catch (error) {
      setSessionStatus({
        loading: false,
        hasCookie: false,
        hasSession: false,
        authenticated: false,
        userId: null
      })
    }
  }

  const testLogin = async () => {
    try {
      const { mockLogin } = await import('@/lib/mock/auth')
      const result = await mockLogin('contributor@jdom.ml', 'Contributor123!')

      if (!result.success) {
        addTestResult('Test Login', 'error', result.error || 'Échec de connexion')
        return
      }

      addTestResult('Test Login', 'success', 'Connexion réussie')

      setTimeout(() => checkSession(), 500)
    } catch (error) {
      addTestResult('Test Login', 'error', error instanceof Error ? error.message : 'Erreur inconnue')
    }
  }

  const testLogout = async () => {
    try {
      const { mockLogout } = await import('@/lib/mock/auth')
      mockLogout()
      addTestResult('Test Logout', 'success', 'Déconnexion réussie')
      setTimeout(() => checkSession(), 500)
    } catch (error) {
      addTestResult('Test Logout', 'error', error instanceof Error ? error.message : 'Erreur inconnue')
    }
  }

  const clearCookies = () => {
    if (typeof window === 'undefined') return
    
    const { mockLogout } = require('@/lib/mock/auth')
    mockLogout()
    
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.split('=')
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
    })

    addTestResult('Clear Cookies', 'success', 'Cookies et session supprimés')

    setTimeout(() => checkSession(), 500)
  }

  const addTestResult = (test: string, status: 'success' | 'error', message: string) => {
    setTestResults(prev => [{
      test,
      status,
      message,
      timestamp: new Date().toLocaleTimeString('fr-FR')
    }, ...prev])
  }

  useEffect(() => {
    checkSession()
  }, [])

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tests d'Authentification</h1>
            <p className="text-muted-foreground">
              Page de test pour vérifier le système de connexion
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/login')}>
              Login
            </Button>
            <Button variant="outline" onClick={() => router.push('/dashboard/contributor')}>
              Dashboard
            </Button>
          </div>
        </div>

        {/* Session Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>État de la Session</CardTitle>
            <CardDescription>
              État actuel de votre session d'authentification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Cookie de session</div>
                  <div className="text-xs text-muted-foreground">
                    {sessionStatus.hasCookie ? 'Présent' : 'Absent'}
                  </div>
                </div>
                <Badge variant={sessionStatus.hasCookie ? 'default' : 'secondary'}>
                  {sessionStatus.hasCookie ? '✓' : '✗'}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Session en base</div>
                  <div className="text-xs text-muted-foreground">
                    {sessionStatus.hasSession ? 'Active' : 'Inactive'}
                  </div>
                </div>
                <Badge variant={sessionStatus.hasSession ? 'default' : 'secondary'}>
                  {sessionStatus.hasSession ? '✓' : '✗'}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Utilisateur authentifié</div>
                  <div className="text-xs text-muted-foreground">
                    {sessionStatus.authenticated ? 'Oui' : 'Non'}
                  </div>
                </div>
                <Badge variant={sessionStatus.authenticated ? 'default' : 'secondary'}>
                  {sessionStatus.authenticated ? '✓' : '✗'}
                </Badge>
              </div>

              {sessionStatus.userId && (
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">ID Utilisateur</div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {sessionStatus.userId}
                    </div>
                  </div>
                  <Badge>📝</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Test Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions de Test</CardTitle>
            <CardDescription>
              Fonctions pour tester le système d'authentification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button
                onClick={checkSession}
                disabled={sessionStatus.loading}
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Vérifier Session
              </Button>

              <Button
                onClick={testLogin}
                variant="outline"
                className="flex-1"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Test Login
              </Button>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={testLogout}
                variant="outline"
                className="flex-1"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Test Logout
              </Button>

              <Button
                onClick={clearCookies}
                variant="destructive"
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer Cookies
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Résultats des Tests</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTestResults([])}
              >
                Effacer
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {testResults.slice().reverse().map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-4 rounded-lg border ${
                      result.status === 'success'
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                    }`}
                  >
                    {result.status === 'success' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{result.test}</span>
                        <span className="text-xs text-muted-foreground">
                          {result.timestamp}
                        </span>
                      </div>
                      <div className="text-sm">{result.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cookie Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informations des Cookies</CardTitle>
            <CardDescription>
              Cookies actuels dans votre navigateur
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg max-h-64 overflow-y-auto font-mono text-sm">
              {typeof window !== 'undefined' ? document.cookie || 'Aucun cookie' : 'Chargement...'}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>
              Navigation rapide vers les pages principales
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button onClick={() => router.push('/login')} className="h-16 flex flex-col">
              <span className="font-medium">Page de Login</span>
              <span className="text-xs text-muted-foreground">/login</span>
            </Button>
            <Button onClick={() => router.push('/dashboard/contributor')} className="h-16 flex flex-col">
              <span className="font-medium">Dashboard</span>
              <span className="text-xs text-muted-foreground">/dashboard/contributor</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

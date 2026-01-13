'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { mockLogin } from '@/lib/mock/auth'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Get redirect URL from query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const redirect = params.get('redirect')
    if (redirect) {
      // Store redirect URL for after login
      sessionStorage.setItem('loginRedirect', redirect)
    }
    
    // Show success message if user just registered
    const registered = params.get('registered')
    if (registered === 'true') {
      toast({
        title: 'Compte créé avec succès',
        description: 'Vous pouvez maintenant vous connecter avec vos identifiants.',
      })
      // Clean URL
      router.replace('/login', { scroll: false })
    }
  }, [router, toast])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Validation basique
    if (!formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await mockLogin(formData.email, formData.password)

      if (!result.success || !result.user) {
        setError(result.error || 'Erreur lors de la connexion')
        setIsLoading(false)
        return
      }

      // Success - redirect to dashboard
      const roleNames: Record<string, string> = {
        admin: 'Administrateur',
        contributor: 'Contributeur',
        public: 'Public'
      }
      const roleName = roleNames[result.user.role] || result.user.role
      
      toast({
        title: 'Connexion réussie',
        description: `Bienvenue ${result.user.name || ''}! Vous êtes connecté en tant que ${roleName}.`
      })

      // Small delay before redirect to show toast
      setTimeout(() => {
        // Check for redirect URL from query params or sessionStorage
        const redirectUrl = sessionStorage.getItem('loginRedirect')
        if (redirectUrl) {
          sessionStorage.removeItem('loginRedirect')
          router.push(redirectUrl)
          return
        }

        // Redirect based on role
        if (result.user!.role === 'admin') {
          router.push('/dashboard')
        } else if (result.user!.role === 'contributor') {
          router.push('/dashboard/contributor')
        } else {
          router.push('/')
        }
      }, 500)
    } catch (err) {
      setError('Erreur de connexion. Veuillez réessayer.')
      setIsLoading(false)
      console.error('Login error:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Formulaire de connexion */}
        <Card className="w-full">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-lg bg-primary flex items-center justify-center">
                <Lock className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
            <CardDescription>
              Connectez-vous à votre espace JDOM
            </CardDescription>
          </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="text-sm">{error}</div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isLoading}
                  className="pl-10"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isLoading}
                  className="pl-10 pr-10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !formData.email || !formData.password}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>
        </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground text-center">
              Mot de passe oublié?{' '}
              <a href="/forgot-password" className="text-primary hover:underline">
                Réinitialiser
              </a>
            </div>
            <div className="text-sm text-muted-foreground text-center">
              Pas encore de compte?{' '}
              <a href="/register" className="text-primary hover:underline">
                Créer un compte
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

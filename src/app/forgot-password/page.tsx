/**
 * Forgot Password Page
 * Page for resetting password
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { ROUTES } from '@/lib/utils/constants'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer votre adresse email',
        variant: 'destructive',
      })
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer une adresse email valide',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: 'Email envoyé',
        description: 'Si cette adresse email existe, vous recevrez un lien de réinitialisation.',
      })

      // Redirect to login after a delay
      setTimeout(() => {
        router.push(ROUTES.LOGIN)
      }, 2000)
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue. Veuillez réessayer.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md relative">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2 relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(ROUTES.LOGIN)}
              className="absolute left-0 top-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl text-center w-full">Mot de passe oublié</CardTitle>
          </div>
          <CardDescription className="text-center">
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                'Envoyer le lien de réinitialisation'
              )}
            </Button>

            <div className="text-center text-sm">
              <Link href={ROUTES.LOGIN} className="text-primary hover:underline">
                Retour à la connexion
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


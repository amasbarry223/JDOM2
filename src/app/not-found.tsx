import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Page non trouvée</h2>
        <p className="mt-2 text-muted-foreground">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
      </div>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">Retour à l'accueil</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/login">Se connecter</Link>
        </Button>
      </div>
    </div>
  )
}


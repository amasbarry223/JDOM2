/**
 * Error Boundary component
 * Catches and displays React errors gracefully
 */

'use client'

import React from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { logger } from '@/lib/utils/logger'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error | null; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error using centralized logger
    // In production, you would send this to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo })
    logger.error('Error caught by boundary', error, { errorInfo })
  }

  resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const Fallback = this.props.fallback
        return <Fallback error={this.state.error} resetError={this.resetError} />
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <CardTitle>Une erreur est survenue</CardTitle>
              </div>
              <CardDescription>
                Désolé, quelque chose s'est mal passé. Veuillez réessayer.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.error && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-mono text-muted-foreground">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={this.resetError} variant="outline">
                  Réessayer
                </Button>
                <Button onClick={() => window.location.reload()}>Recharger la page</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}


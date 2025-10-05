'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { Suspense } from 'react'

const errorMessages: Record<string, string> = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The sign in link is no longer valid. It may have expired or already been used.',
  Default: 'An error occurred during sign in.',
}

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'Default'
  const errorMessage = errorMessages[error] || errorMessages.Default

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md card-glow border-2 border-destructive/20">
        <div className="h-2 bg-gradient-to-r from-destructive/50 to-destructive" />
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-destructive/20 to-destructive/10 rounded-2xl mx-auto mb-4 border-2 border-destructive/30">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Sign In Error</CardTitle>
          <CardDescription className="text-base">
            {errorMessage}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            <Button asChild variant="default" size="lg">
              <Link href="/auth/signin">
                Try Again
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/">
                Back to Home
              </Link>
            </Button>
          </div>
          <div className="text-center text-sm text-muted-foreground pt-4">
            <p>
              You can still use Taslim in guest mode without signing in.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}

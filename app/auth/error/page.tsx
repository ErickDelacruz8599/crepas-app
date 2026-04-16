import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-lg border-2 border-destructive/20">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <CardTitle className="text-2xl">Error de autenticación</CardTitle>
          <CardDescription className="mt-2">
            Hubo un problema al verificar tu cuenta. El enlace puede haber expirado.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/auth/login" className="block">
            <Button className="w-full">Intentar de nuevo</Button>
          </Link>
          <Link href="/" className="block">
            <Button variant="outline" className="w-full">Volver al inicio</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

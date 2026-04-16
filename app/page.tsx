import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
                Crea tu crepa perfecta
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty">
                Deliciosas crepas artesanales personalizadas a tu gusto. 
                Elige tu base, toppings y extras favoritos para una experiencia única.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/menu">
                  <Button size="lg" className="text-lg px-8 h-14 w-full sm:w-auto">
                    Ver Menú
                  </Button>
                </Link>
                <Link href="/dashboard/crear">
                  <Button size="lg" variant="outline" className="text-lg px-8 h-14 w-full sm:w-auto">
                    Crear Mi Crepa
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent/20 rounded-full blur-xl" />
        </section>

        {/* Features Section */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">¿Por qué elegirnos?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-2 border-primary/10 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Personaliza tu crepa</h3>
                  <p className="text-muted-foreground">
                    Elige entre múltiples bases, toppings y extras para crear la crepa de tus sueños.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/10 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Seguimiento en tiempo real</h3>
                  <p className="text-muted-foreground">
                    Sigue el estado de tu pedido en tiempo real desde que lo ordenas hasta que está listo.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/10 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Ingredientes frescos</h3>
                  <p className="text-muted-foreground">
                    Usamos solo ingredientes frescos y de la mejor calidad para cada crepa.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">¿Listo para ordenar?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Regístrate ahora y comienza a crear tus crepas personalizadas. Tu primera orden te sorprenderá.
            </p>
            <Link href="/auth/sign-up">
              <Button size="lg" className="text-lg px-8 h-14">
                Crear cuenta gratis
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

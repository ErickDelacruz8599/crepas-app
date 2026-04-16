import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

interface Ingredient {
  id: string
  name: string
  category: 'base' | 'topping' | 'extra'
  price: number
  available: boolean
}

export default async function MenuPage() {
  const supabase = await createClient()
  
  const { data: ingredients } = await supabase
    .from('ingredients')
    .select('*')
    .eq('available', true)
    .order('name')

  const bases = ingredients?.filter((i: Ingredient) => i.category === 'base') || []
  const toppings = ingredients?.filter((i: Ingredient) => i.category === 'topping') || []
  const extras = ingredients?.filter((i: Ingredient) => i.category === 'extra') || []

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Nuestro Menú</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Descubre todos los ingredientes disponibles para crear tu crepa perfecta.
              Combina bases, toppings y extras a tu gusto.
            </p>
          </div>

          {/* CTA Banner */}
          <Card className="mb-12 bg-primary/5 border-primary/20">
            <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 py-6">
              <div>
                <h2 className="text-xl font-semibold mb-1">¿Quieres crear tu propia crepa?</h2>
                <p className="text-muted-foreground">
                  Personaliza tu orden eligiendo los ingredientes que más te gusten.
                </p>
              </div>
              <Link href="/dashboard/crear">
                <Button size="lg" className="whitespace-nowrap">
                  Crear Mi Crepa
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Bases */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">1</span>
              Bases de Crepa
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {bases.map((item: Ingredient) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{item.name}</h3>
                      <Badge variant="secondary" className="text-primary font-semibold">
                        {formatPrice(item.price)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Base de crepa artesanal</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Toppings */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">2</span>
              Toppings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {toppings.map((item: Ingredient) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{item.name}</h3>
                      <Badge variant="secondary" className="text-primary font-semibold">
                        +{formatPrice(item.price)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Topping adicional</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Extras */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">3</span>
              Extras
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {extras.map((item: Ingredient) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{item.name}</h3>
                      <Badge variant="secondary" className="text-primary font-semibold">
                        +{formatPrice(item.price)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Extra especial</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

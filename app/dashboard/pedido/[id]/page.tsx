import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pendiente', variant: 'secondary' },
  preparing: { label: 'Preparando', variant: 'default' },
  ready: { label: 'Listo para recoger', variant: 'outline' },
  delivered: { label: 'Entregado', variant: 'outline' },
  cancelled: { label: 'Cancelado', variant: 'destructive' },
}

const statusSteps = ['pending', 'preparing', 'ready', 'delivered']

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!order) {
    notFound()
  }

  const { data: orderItems } = await supabase
    .from('order_items')
    .select(`
      *,
      base_ingredient:ingredients!base_ingredient_id(name, price),
      toppings:order_item_toppings(
        ingredient:ingredients(name, price, category)
      )
    `)
    .eq('order_id', id)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('es-MX', {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(new Date(date))
  }

  const currentStepIndex = statusSteps.indexOf(order.status)

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="text-primary hover:underline text-sm mb-2 inline-block">
            &larr; Volver al dashboard
          </Link>
          <h1 className="text-2xl font-bold">Detalles del Pedido</h1>
        </div>
        <Badge variant={statusLabels[order.status].variant} className="text-base px-4 py-1">
          {statusLabels[order.status].label}
        </Badge>
      </div>

      {/* Order Progress */}
      {order.status !== 'cancelled' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Progreso del Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-4 left-0 right-0 h-1 bg-muted">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                />
              </div>
              
              {statusSteps.map((step, index) => (
                <div key={step} className="relative flex flex-col items-center z-10">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      index <= currentStepIndex 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index <= currentStepIndex ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="text-xs mt-2 text-center max-w-[60px]">
                    {statusLabels[step].label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información del Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Fecha</span>
            <span>{formatDate(order.created_at)}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Estado</span>
            <Badge variant={statusLabels[order.status].variant}>
              {statusLabels[order.status].label}
            </Badge>
          </div>
          {order.notes && (
            <div className="py-2 border-b">
              <span className="text-muted-foreground block mb-1">Notas</span>
              <span>{order.notes}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tu Crepa</CardTitle>
        </CardHeader>
        <CardContent>
          {orderItems?.map((item, index) => (
            <div key={item.id} className="space-y-3">
              {index > 0 && <hr className="my-4" />}
              
              <div className="flex justify-between items-center">
                <span className="font-semibold">Base: {item.base_ingredient?.name}</span>
                <span>{formatPrice(item.base_ingredient?.price || 0)}</span>
              </div>

              {item.toppings && item.toppings.length > 0 && (
                <div className="pl-4 space-y-1">
                  {item.toppings.map((t: { ingredient: { name: string; price: number; category: string } }, i: number) => (
                    <div key={i} className="flex justify-between text-sm text-muted-foreground">
                      <span>+ {t.ingredient.name}</span>
                      <span>+{formatPrice(t.ingredient.price)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Link href="/dashboard" className="flex-1">
          <Button variant="outline" className="w-full">Volver al Dashboard</Button>
        </Link>
        <Link href="/dashboard/crear" className="flex-1">
          <Button className="w-full">Ordenar Otra</Button>
        </Link>
      </div>
    </div>
  )
}

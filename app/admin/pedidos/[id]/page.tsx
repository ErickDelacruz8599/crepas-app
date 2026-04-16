import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { OrderStatusButtons } from '@/components/order-status-buttons'

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

export default async function AdminOrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*, profiles(full_name, phone)')
    .eq('id', id)
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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/pedidos" className="text-primary hover:underline text-sm mb-2 inline-block">
            &larr; Volver a pedidos
          </Link>
          <h1 className="text-2xl font-bold">Gestionar Pedido</h1>
        </div>
        <Badge variant={statusLabels[order.status].variant} className="text-base px-4 py-1">
          {statusLabels[order.status].label}
        </Badge>
      </div>

      {/* Status Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actualizar Estado</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderStatusButtons orderId={order.id} currentStatus={order.status} />
        </CardContent>
      </Card>

      {/* Customer Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información del Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nombre</span>
            <span className="font-medium">{order.profiles?.full_name || 'No especificado'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Teléfono</span>
            <span className="font-medium">{order.profiles?.phone || 'No especificado'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fecha del pedido</span>
            <span className="font-medium">{formatDate(order.created_at)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Order Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detalle del Pedido</CardTitle>
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
                  <p className="text-sm font-medium text-muted-foreground">Adicionales:</p>
                  {item.toppings.map((t: { ingredient: { name: string; price: number; category: string } }, i: number) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>+ {t.ingredient.name}</span>
                      <span>+{formatPrice(t.ingredient.price)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {order.notes && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-1">Notas del cliente:</p>
              <p className="text-sm text-muted-foreground">{order.notes}</p>
            </div>
          )}

          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

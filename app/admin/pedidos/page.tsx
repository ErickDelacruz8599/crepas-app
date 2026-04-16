import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Order {
  id: string
  status: string
  total: number
  notes: string | null
  created_at: string
  profiles: { full_name: string | null } | null
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pendiente', variant: 'secondary' },
  preparing: { label: 'Preparando', variant: 'default' },
  ready: { label: 'Listo', variant: 'outline' },
  delivered: { label: 'Entregado', variant: 'outline' },
  cancelled: { label: 'Cancelado', variant: 'destructive' },
}

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from('orders')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('es-MX', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(date))
  }

  const pendingOrders = orders?.filter((o: Order) => o.status === 'pending' || o.status === 'preparing') || []
  const completedOrders = orders?.filter((o: Order) => o.status !== 'pending' && o.status !== 'preparing') || []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Pedidos</h1>
        <p className="text-muted-foreground">Gestiona todos los pedidos de la crepería</p>
      </div>

      {/* Pending Orders */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          Por Atender
          {pendingOrders.length > 0 && (
            <Badge variant="secondary" className="text-orange-600 bg-orange-100">
              {pendingOrders.length}
            </Badge>
          )}
        </h2>

        {pendingOrders.length > 0 ? (
          <div className="grid gap-4">
            {pendingOrders.map((order: Order) => (
              <Card key={order.id} className="border-l-4 border-l-orange-500">
                <CardContent className="py-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={statusLabels[order.status].variant}>
                          {statusLabels[order.status].label}
                        </Badge>
                        <span className="font-medium">
                          {order.profiles?.full_name || 'Cliente'}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(order.created_at)}
                        </span>
                      </div>
                      {order.notes && (
                        <p className="text-sm text-muted-foreground">Notas: {order.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-lg">{formatPrice(order.total)}</span>
                      <Link href={`/admin/pedidos/${order.id}`}>
                        <Button size="sm">Gestionar</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No hay pedidos pendientes</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Completed Orders */}
      <section>
        <h2 className="text-xl font-bold mb-4">Historial</h2>

        {completedOrders.length > 0 ? (
          <div className="space-y-3">
            {completedOrders.map((order: Order) => (
              <Card key={order.id}>
                <CardContent className="py-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant={statusLabels[order.status].variant}>
                        {statusLabels[order.status].label}
                      </Badge>
                      <span className="font-medium">
                        {order.profiles?.full_name || 'Cliente'}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(order.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">{formatPrice(order.total)}</span>
                      <Link href={`/admin/pedidos/${order.id}`}>
                        <Button variant="outline" size="sm">Ver</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No hay pedidos en el historial</p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  )
}

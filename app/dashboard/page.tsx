import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Order {
  id: string
  status: string
  total: number
  notes: string | null
  created_at: string
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pendiente', variant: 'secondary' },
  preparing: { label: 'Preparando', variant: 'default' },
  ready: { label: 'Listo', variant: 'outline' },
  delivered: { label: 'Entregado', variant: 'outline' },
  cancelled: { label: 'Cancelado', variant: 'destructive' },
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('es-MX', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(date))
  }

  const activeOrders = orders?.filter((o: Order) => 
    o.status === 'pending' || o.status === 'preparing'
  ) || []

  const completedOrders = orders?.filter((o: Order) => 
    o.status === 'ready' || o.status === 'delivered' || o.status === 'cancelled'
  ) || []

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Hola, {profile?.full_name || user.email?.split('@')[0]}
          </h1>
          <p className="text-muted-foreground">
            Bienvenido a tu panel de crepas
          </p>
        </div>
        <Link href="/dashboard/crear">
          <Button size="lg" className="w-full md:w-auto">
            Crear Nueva Crepa
          </Button>
        </Link>
      </div>

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Pedidos en Proceso</h2>
          <div className="grid gap-4">
            {activeOrders.map((order: Order) => (
              <Card key={order.id} className="border-2 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={statusLabels[order.status].variant}>
                          {statusLabels[order.status].label}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(order.created_at)}
                        </span>
                      </div>
                      <p className="text-lg font-semibold">{formatPrice(order.total)}</p>
                      {order.notes && (
                        <p className="text-sm text-muted-foreground">Notas: {order.notes}</p>
                      )}
                    </div>
                    <Link href={`/dashboard/pedido/${order.id}`}>
                      <Button variant="outline">Ver Detalles</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-bold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/dashboard/crear">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="font-semibold">Nueva Crepa</h3>
                <p className="text-sm text-muted-foreground">Crea tu crepa perfecta</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/menu">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="font-semibold">Ver Menú</h3>
                <p className="text-sm text-muted-foreground">Explora ingredientes</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/historial">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold">Historial</h3>
                <p className="text-sm text-muted-foreground">Pedidos anteriores</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Order History */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Historial de Pedidos</h2>
          {completedOrders.length > 5 && (
            <Link href="/dashboard/historial" className="text-primary hover:underline text-sm">
              Ver todos
            </Link>
          )}
        </div>
        {completedOrders.length > 0 ? (
          <div className="space-y-3">
            {completedOrders.slice(0, 5).map((order: Order) => (
              <Card key={order.id}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge variant={statusLabels[order.status].variant}>
                        {statusLabels[order.status].label}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(order.created_at)}
                      </span>
                    </div>
                    <span className="font-semibold">{formatPrice(order.total)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Aún no tienes pedidos completados</p>
              <Link href="/dashboard/crear">
                <Button className="mt-4">Crear tu primera crepa</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  )
}

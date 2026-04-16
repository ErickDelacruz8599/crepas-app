'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface OrderStatusButtonsProps {
  orderId: string
  currentStatus: string
}

const statusFlow = {
  pending: { next: 'preparing', nextLabel: 'Comenzar a Preparar' },
  preparing: { next: 'ready', nextLabel: 'Marcar como Listo' },
  ready: { next: 'delivered', nextLabel: 'Marcar como Entregado' },
  delivered: { next: null, nextLabel: null },
  cancelled: { next: null, nextLabel: null },
}

export function OrderStatusButtons({ orderId, currentStatus }: OrderStatusButtonsProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleStatusChange = async (newStatus: string) => {
    setLoading(newStatus)
    
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId)

    if (!error) {
      router.refresh()
    }
    
    setLoading(null)
  }

  const flow = statusFlow[currentStatus as keyof typeof statusFlow]

  if (currentStatus === 'delivered' || currentStatus === 'cancelled') {
    return (
      <p className="text-muted-foreground text-center py-4">
        Este pedido ya ha sido {currentStatus === 'delivered' ? 'entregado' : 'cancelado'}
      </p>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {flow?.next && (
        <Button 
          onClick={() => handleStatusChange(flow.next!)}
          disabled={loading !== null}
          className="flex-1"
          size="lg"
        >
          {loading === flow.next ? <Spinner className="mr-2" /> : null}
          {flow.nextLabel}
        </Button>
      )}
      
      {currentStatus !== 'cancelled' && (
        <Button 
          variant="destructive"
          onClick={() => handleStatusChange('cancelled')}
          disabled={loading !== null}
          size="lg"
        >
          {loading === 'cancelled' ? <Spinner className="mr-2" /> : null}
          Cancelar Pedido
        </Button>
      )}
    </div>
  )
}

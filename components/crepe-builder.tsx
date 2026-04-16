'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

interface Ingredient {
  id: string
  name: string
  category: 'base' | 'topping' | 'extra'
  price: number
  available: boolean
}

interface CrepeBuilderProps {
  ingredients: Ingredient[]
  userId: string
}

export function CrepeBuilder({ ingredients, userId }: CrepeBuilderProps) {
  const [selectedBase, setSelectedBase] = useState<Ingredient | null>(null)
  const [selectedToppings, setSelectedToppings] = useState<Ingredient[]>([])
  const [selectedExtras, setSelectedExtras] = useState<Ingredient[]>([])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const bases = ingredients.filter(i => i.category === 'base')
  const toppings = ingredients.filter(i => i.category === 'topping')
  const extras = ingredients.filter(i => i.category === 'extra')

  const totalPrice = useMemo(() => {
    let total = selectedBase?.price || 0
    total += selectedToppings.reduce((sum, t) => sum + t.price, 0)
    total += selectedExtras.reduce((sum, e) => sum + e.price, 0)
    return total
  }, [selectedBase, selectedToppings, selectedExtras])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price)
  }

  const toggleTopping = (topping: Ingredient) => {
    setSelectedToppings(prev => 
      prev.find(t => t.id === topping.id)
        ? prev.filter(t => t.id !== topping.id)
        : [...prev, topping]
    )
  }

  const toggleExtra = (extra: Ingredient) => {
    setSelectedExtras(prev => 
      prev.find(e => e.id === extra.id)
        ? prev.filter(e => e.id !== extra.id)
        : [...prev, extra]
    )
  }

  async function handleSubmit() {
    if (!selectedBase) {
      setError('Por favor selecciona una base para tu crepa')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          total: totalPrice,
          notes: notes || null,
          status: 'pending',
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create the order item (crepa)
      const { data: orderItem, error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          base_ingredient_id: selectedBase.id,
          price: totalPrice,
        })
        .select()
        .single()

      if (itemError) throw itemError

      // Add toppings and extras
      const allToppings = [...selectedToppings, ...selectedExtras]
      if (allToppings.length > 0) {
        const toppingInserts = allToppings.map(t => ({
          order_item_id: orderItem.id,
          ingredient_id: t.id,
        }))

        const { error: toppingsError } = await supabase
          .from('order_item_toppings')
          .insert(toppingInserts)

        if (toppingsError) throw toppingsError
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el pedido')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Pedido creado</h2>
          <p className="text-muted-foreground mb-4">
            Tu crepa está siendo preparada. Redirigiendo a tu dashboard...
          </p>
          <Spinner />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Builder Section */}
      <div className="lg:col-span-2 space-y-8">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Base */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
            Elige tu base
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {bases.map(base => (
              <button
                key={base.id}
                onClick={() => setSelectedBase(base)}
                className={cn(
                  "p-4 rounded-xl border-2 text-left transition-all hover:shadow-md",
                  selectedBase?.id === base.id
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-primary/50"
                )}
              >
                <h3 className="font-semibold text-sm mb-1">{base.name}</h3>
                <p className="text-primary font-bold">{formatPrice(base.price)}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Step 2: Toppings */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
            Agrega toppings
            <span className="text-sm font-normal text-muted-foreground">(opcional)</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {toppings.map(topping => {
              const isSelected = selectedToppings.find(t => t.id === topping.id)
              return (
                <button
                  key={topping.id}
                  onClick={() => toggleTopping(topping)}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all hover:shadow-md",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <h3 className="font-semibold text-sm mb-1">{topping.name}</h3>
                  <p className="text-primary font-bold">+{formatPrice(topping.price)}</p>
                </button>
              )
            })}
          </div>
        </section>

        {/* Step 3: Extras */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</span>
            Extras especiales
            <span className="text-sm font-normal text-muted-foreground">(opcional)</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {extras.map(extra => {
              const isSelected = selectedExtras.find(e => e.id === extra.id)
              return (
                <button
                  key={extra.id}
                  onClick={() => toggleExtra(extra)}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all hover:shadow-md",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <h3 className="font-semibold text-sm mb-1">{extra.name}</h3>
                  <p className="text-primary font-bold">+{formatPrice(extra.price)}</p>
                </button>
              )
            })}
          </div>
        </section>

        {/* Notes */}
        <section>
          <h2 className="text-xl font-bold mb-4">Notas adicionales</h2>
          <Textarea
            placeholder="¿Alguna instrucción especial? (ej: sin nueces, extra chocolate...)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="resize-none"
            rows={3}
          />
        </section>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-24 border-2 border-primary/20">
          <CardHeader>
            <CardTitle>Tu Crepa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedBase ? (
              <>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">BASE</h4>
                  <div className="flex justify-between items-center">
                    <span>{selectedBase.name}</span>
                    <span className="font-semibold">{formatPrice(selectedBase.price)}</span>
                  </div>
                </div>

                {selectedToppings.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">TOPPINGS</h4>
                    {selectedToppings.map(t => (
                      <div key={t.id} className="flex justify-between items-center text-sm py-1">
                        <span>{t.name}</span>
                        <span>+{formatPrice(t.price)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {selectedExtras.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">EXTRAS</h4>
                    {selectedExtras.map(e => (
                      <div key={e.id} className="flex justify-between items-center text-sm py-1">
                        <span>{e.name}</span>
                        <span>+{formatPrice(e.price)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleSubmit} 
                  disabled={loading || !selectedBase}
                  className="w-full h-12 text-lg"
                >
                  {loading ? (
                    <>
                      <Spinner className="mr-2" />
                      Ordenando...
                    </>
                  ) : (
                    'Ordenar Crepa'
                  )}
                </Button>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Selecciona una base para comenzar</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

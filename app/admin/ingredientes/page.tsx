import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { IngredientToggle } from '@/components/ingredient-toggle'

interface Ingredient {
  id: string
  name: string
  category: 'base' | 'topping' | 'extra'
  price: number
  available: boolean
}

const categoryLabels: Record<string, string> = {
  base: 'Bases',
  topping: 'Toppings',
  extra: 'Extras',
}

export default async function AdminIngredientsPage() {
  const supabase = await createClient()

  const { data: ingredients } = await supabase
    .from('ingredients')
    .select('*')
    .order('category')
    .order('name')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price)
  }

  const bases = ingredients?.filter((i: Ingredient) => i.category === 'base') || []
  const toppings = ingredients?.filter((i: Ingredient) => i.category === 'topping') || []
  const extras = ingredients?.filter((i: Ingredient) => i.category === 'extra') || []

  const renderIngredientsList = (items: Ingredient[], category: string) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {categoryLabels[category]}
          <Badge variant="secondary">{items.length} items</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((ingredient) => (
            <div 
              key={ingredient.id} 
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{ingredient.name}</span>
                  {!ingredient.available && (
                    <Badge variant="destructive" className="text-xs">No disponible</Badge>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatPrice(ingredient.price)}
                </span>
              </div>
              <IngredientToggle 
                ingredientId={ingredient.id} 
                available={ingredient.available} 
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Ingredientes</h1>
        <p className="text-muted-foreground">
          Administra la disponibilidad de ingredientes. Los ingredientes no disponibles no aparecerán en el menú.
        </p>
      </div>

      <div className="grid gap-6">
        {renderIngredientsList(bases, 'base')}
        {renderIngredientsList(toppings, 'topping')}
        {renderIngredientsList(extras, 'extra')}
      </div>
    </div>
  )
}

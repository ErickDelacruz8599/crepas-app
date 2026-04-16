'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Switch } from '@/components/ui/switch'

interface IngredientToggleProps {
  ingredientId: string
  available: boolean
}

export function IngredientToggle({ ingredientId, available }: IngredientToggleProps) {
  const [isAvailable, setIsAvailable] = useState(available)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleToggle = async () => {
    setLoading(true)
    const newValue = !isAvailable
    setIsAvailable(newValue)

    const { error } = await supabase
      .from('ingredients')
      .update({ available: newValue })
      .eq('id', ingredientId)

    if (error) {
      setIsAvailable(!newValue) // Revert on error
    } else {
      router.refresh()
    }
    
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {isAvailable ? 'Disponible' : 'No disponible'}
      </span>
      <Switch 
        checked={isAvailable}
        onCheckedChange={handleToggle}
        disabled={loading}
      />
    </div>
  )
}

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CrepeBuilder } from '@/components/crepe-builder'

export default async function CreateCrepePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: ingredients } = await supabase
    .from('ingredients')
    .select('*')
    .eq('available', true)
    .order('name')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Crea tu Crepa</h1>
        <p className="text-muted-foreground">
          Personaliza tu crepa perfecta eligiendo base, toppings y extras.
        </p>
      </div>

      <CrepeBuilder ingredients={ingredients || []} userId={user.id} />
    </div>
  )
}

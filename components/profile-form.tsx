'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Check } from 'lucide-react'

interface ProfileFormProps {
  userId: string
  currentName: string
  email: string
}

export function ProfileForm({ userId, currentName, email }: ProfileFormProps) {
  const router = useRouter()
  const [name, setName] = useState(currentName)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    if (!name.trim()) {
      setError('O nome nao pode estar vazio.')
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ name: name.trim() })
        .eq('id', userId)

      if (updateError) throw updateError

      setSuccess(true)
      router.refresh()
      
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar perfil.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          disabled
          className="bg-muted"
        />
        <p className="text-xs text-muted-foreground">
          O email nao pode ser alterado.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nome de exibicao</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
          required
        />
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {success && (
        <p className="text-sm text-primary flex items-center gap-2">
          <Check className="h-4 w-4" />
          Perfil atualizado com sucesso!
        </p>
      )}

      <Button type="submit" disabled={isLoading || name === currentName}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          'Salvar alteracoes'
        )}
      </Button>
    </form>
  )
}

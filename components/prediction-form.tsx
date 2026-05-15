'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

interface Team {
  id: string
  name: string
  code: string
}

interface Prediction {
  id: string
  home_score: number
  away_score: number
}

interface PredictionFormProps {
  matchId: string
  userId: string
  homeTeam: Team
  awayTeam: Team
  existingPrediction: Prediction | null
}

export function PredictionForm({
  matchId,
  userId,
  homeTeam,
  awayTeam,
  existingPrediction,
}: PredictionFormProps) {
  const router = useRouter()
  const [homeScore, setHomeScore] = useState(
    existingPrediction?.home_score?.toString() ?? ''
  )
  const [awayScore, setAwayScore] = useState(
    existingPrediction?.away_score?.toString() ?? ''
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const homeScoreNum = parseInt(homeScore, 10)
    const awayScoreNum = parseInt(awayScore, 10)

    if (isNaN(homeScoreNum) || isNaN(awayScoreNum)) {
      setError('Por favor, insira um placar valido.')
      setIsLoading(false)
      return
    }

    if (homeScoreNum < 0 || awayScoreNum < 0) {
      setError('O placar nao pode ser negativo.')
      setIsLoading(false)
      return
    }

    if (homeScoreNum > 20 || awayScoreNum > 20) {
      setError('O placar parece invalido.')
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    try {
      if (existingPrediction) {
        // Atualizar palpite existente
        const { error: updateError } = await supabase
          .from('predictions')
          .update({
            home_score: homeScoreNum,
            away_score: awayScoreNum,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingPrediction.id)

        if (updateError) throw updateError
      } else {
        // Criar novo palpite
        const { error: insertError } = await supabase
          .from('predictions')
          .insert({
            user_id: userId,
            match_id: matchId,
            home_score: homeScoreNum,
            away_score: awayScoreNum,
          })

        if (insertError) throw insertError
      }

      router.push('/dashboard/matches')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar palpite.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-5 gap-4 items-end">
        <div className="col-span-2">
          <Label htmlFor="homeScore" className="text-center block mb-2">
            {homeTeam.name}
          </Label>
          <Input
            id="homeScore"
            type="number"
            min="0"
            max="20"
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
            className="text-center text-2xl font-bold h-14"
            placeholder="0"
            required
          />
        </div>
        <div className="text-center text-2xl font-bold text-muted-foreground">
          X
        </div>
        <div className="col-span-2">
          <Label htmlFor="awayScore" className="text-center block mb-2">
            {awayTeam.name}
          </Label>
          <Input
            id="awayScore"
            type="number"
            min="0"
            max="20"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
            className="text-center text-2xl font-bold h-14"
            placeholder="0"
            required
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : existingPrediction ? (
          'Atualizar palpite'
        ) : (
          'Salvar palpite'
        )}
      </Button>
    </form>
  )
}

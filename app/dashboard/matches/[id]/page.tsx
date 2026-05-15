import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PredictionForm } from '@/components/prediction-form'

interface MatchPageProps {
  params: Promise<{ id: string }>
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Buscar partida
  const { data: match, error } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!matches_home_team_id_fkey(id, name, code),
      away_team:teams!matches_away_team_id_fkey(id, name, code)
    `)
    .eq('id', id)
    .single()

  if (error || !match) {
    notFound()
  }

  // Verificar se a partida já começou
  const matchStarted = new Date(match.match_date) < new Date()

  // Buscar palpite existente
  const { data: existingPrediction } = await supabase
    .from('predictions')
    .select('*')
    .eq('user_id', user.id)
    .eq('match_id', id)
    .single()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link href="/dashboard/matches">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para partidas
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(match.match_date).toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </CardDescription>
          </div>
          <div className="text-sm text-muted-foreground">{match.stage}</div>
          {match.stadium && (
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {match.stadium}, {match.city}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {/* Match Display */}
          <div className="flex items-center justify-center gap-8 py-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{match.home_team?.code}</div>
              <div className="text-sm text-muted-foreground">{match.home_team?.name}</div>
            </div>
            
            {match.home_score !== null && match.away_score !== null ? (
              <div className="text-center">
                <div className="text-4xl font-bold">
                  {match.home_score} - {match.away_score}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Resultado Final</div>
              </div>
            ) : (
              <div className="text-2xl font-bold text-muted-foreground">VS</div>
            )}
            
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{match.away_team?.code}</div>
              <div className="text-sm text-muted-foreground">{match.away_team?.name}</div>
            </div>
          </div>

          {/* Prediction Form or Message */}
          {matchStarted ? (
            <div className="text-center py-8 border-t border-border">
              <p className="text-muted-foreground mb-2">
                Esta partida ja comecou. Nao e possivel fazer ou alterar palpites.
              </p>
              {existingPrediction && (
                <div className="mt-4 p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-2">Seu palpite:</p>
                  <p className="text-2xl font-bold">
                    {existingPrediction.home_score} - {existingPrediction.away_score}
                  </p>
                  {existingPrediction.points > 0 && (
                    <p className="text-primary font-semibold mt-2">
                      +{existingPrediction.points} pontos
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="border-t border-border pt-6">
              <CardTitle className="text-lg mb-4">
                {existingPrediction ? 'Editar seu palpite' : 'Fazer seu palpite'}
              </CardTitle>
              <PredictionForm
                matchId={match.id}
                userId={user.id}
                homeTeam={match.home_team}
                awayTeam={match.away_team}
                existingPrediction={existingPrediction}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scoring Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sistema de Pontuacao</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg bg-primary/10">
              <div className="text-2xl font-bold text-primary">10</div>
              <div className="text-sm text-muted-foreground">Placar exato</div>
            </div>
            <div className="p-4 rounded-lg bg-accent/10">
              <div className="text-2xl font-bold text-accent">5</div>
              <div className="text-sm text-muted-foreground">Acertou vencedor</div>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-muted-foreground">Acertou empate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

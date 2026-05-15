import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Calendar, MapPin, Check, Clock, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

export default async function MatchesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Buscar todas as partidas com times
  const { data: matches } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!matches_home_team_id_fkey(id, name, code),
      away_team:teams!matches_away_team_id_fkey(id, name, code)
    `)
    .order('match_date', { ascending: true })

  // Buscar palpites do usuário
  const { data: userPredictions } = await supabase
    .from('predictions')
    .select('*')
    .eq('user_id', user?.id)

  const predictionsMap = new Map(
    userPredictions?.map(p => [p.match_id, p]) || []
  )

  // Agrupar partidas por data
  const matchesByDate = matches?.reduce((acc, match) => {
    const date = new Date(match.match_date).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
    if (!acc[date]) acc[date] = []
    acc[date].push(match)
    return acc
  }, {} as Record<string, typeof matches>)

  const isMatchStarted = (matchDate: string) => {
    return new Date(matchDate) < new Date()
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Partidas</h1>
        <p className="text-muted-foreground">
          Veja todas as partidas da Copa 2026 e faca seus palpites.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span className="text-muted-foreground">Palpite feito</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-muted"></div>
          <span className="text-muted-foreground">Sem palpite</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3 text-destructive" />
          <span className="text-muted-foreground">Partida encerrada</span>
        </div>
      </div>

      {matchesByDate && Object.entries(matchesByDate).map(([date, dayMatches]) => (
        <div key={date}>
          <h2 className="text-lg font-semibold mb-4 capitalize">{date}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dayMatches?.map((match) => {
              const prediction = predictionsMap.get(match.id)
              const started = isMatchStarted(match.match_date)
              const hasResult = match.home_score !== null && match.away_score !== null

              return (
                <Card 
                  key={match.id} 
                  className={cn(
                    "transition-all",
                    prediction && "border-primary/50 bg-primary/5",
                    started && !hasResult && "opacity-60"
                  )}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {new Date(match.match_date).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </CardDescription>
                      {prediction && (
                        <div className="flex items-center gap-1 text-xs text-primary">
                          <Check className="h-3 w-3" />
                          Palpite
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{match.stage}</div>
                    {match.stadium && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {match.stadium}, {match.city}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-center flex-1">
                        <div className="text-2xl font-bold mb-1">{match.home_team?.code}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {match.home_team?.name}
                        </div>
                      </div>
                      
                      {hasResult ? (
                        <div className="text-center px-4">
                          <div className="text-2xl font-bold">
                            {match.home_score} - {match.away_score}
                          </div>
                          <div className="text-xs text-muted-foreground">Final</div>
                        </div>
                      ) : (
                        <div className="text-muted-foreground font-medium px-2">vs</div>
                      )}
                      
                      <div className="text-center flex-1">
                        <div className="text-2xl font-bold mb-1">{match.away_team?.code}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {match.away_team?.name}
                        </div>
                      </div>
                    </div>

                    {/* User prediction display */}
                    {prediction && (
                      <div className="mt-4 p-3 rounded-lg bg-muted/50">
                        <div className="text-xs text-muted-foreground mb-1">Seu palpite:</div>
                        <div className="flex items-center justify-center gap-4">
                          <span className="text-lg font-bold">{prediction.home_score}</span>
                          <span className="text-muted-foreground">-</span>
                          <span className="text-lg font-bold">{prediction.away_score}</span>
                          {hasResult && prediction.points > 0 && (
                            <div className="flex items-center gap-1 text-primary ml-2">
                              <Trophy className="h-4 w-4" />
                              <span className="font-bold">+{prediction.points}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {!started ? (
                      <Button asChild className="w-full mt-4" size="sm">
                        <Link href={`/dashboard/matches/${match.id}`}>
                          {prediction ? 'Editar palpite' : 'Fazer palpite'}
                        </Link>
                      </Button>
                    ) : (
                      <div className="mt-4 text-center text-sm text-muted-foreground">
                        Palpites encerrados
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ))}

      {(!matches || matches.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="mb-2">Nenhuma partida cadastrada</CardTitle>
            <CardDescription>
              As partidas da Copa 2026 serao adicionadas em breve.
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

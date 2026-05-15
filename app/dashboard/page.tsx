import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Trophy, Target, Calendar, Medal, ArrowRight } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Buscar perfil do usuário
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  // Buscar estatísticas do usuário
  const { data: predictions } = await supabase
    .from('predictions')
    .select('points')
    .eq('user_id', user?.id)

  const totalPoints = predictions?.reduce((acc, p) => acc + (p.points || 0), 0) || 0
  const totalPredictions = predictions?.length || 0
  const exactScores = predictions?.filter(p => p.points === 10).length || 0

  // Buscar posição no ranking
  const { data: leaderboard } = await supabase
    .from('leaderboard')
    .select('*')
    .order('total_points', { ascending: false })

  const userRank = leaderboard?.findIndex(l => l.id === user?.id) ?? -1
  const rankPosition = userRank >= 0 ? userRank + 1 : '-'

  // Buscar próximas partidas
  const { data: upcomingMatches } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!matches_home_team_id_fkey(name, code),
      away_team:teams!matches_away_team_id_fkey(name, code)
    `)
    .eq('status', 'scheduled')
    .order('match_date', { ascending: true })
    .limit(3)

  const displayName = profile?.name || user?.email?.split('@')[0] || 'Usuario'

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Ola, {displayName}!</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao Bolao da Copa 2026. Confira suas estatisticas e faca seus palpites.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Pontos</CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{totalPoints}</div>
            <p className="text-xs text-muted-foreground">pontos acumulados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Posicao no Ranking</CardTitle>
            <Medal className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{rankPosition}º</div>
            <p className="text-xs text-muted-foreground">
              de {leaderboard?.length || 0} participantes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Palpites Feitos</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPredictions}</div>
            <p className="text-xs text-muted-foreground">partidas palpitadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Placares Exatos</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{exactScores}</div>
            <p className="text-xs text-muted-foreground">acertos perfeitos</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Matches */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Proximas Partidas</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/matches">
              Ver todas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        {upcomingMatches && upcomingMatches.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {upcomingMatches.map((match) => (
              <Card key={match.id}>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {new Date(match.match_date).toLocaleDateString('pt-BR', {
                      weekday: 'short',
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </CardDescription>
                  <div className="text-xs text-muted-foreground">{match.stage}</div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-center flex-1">
                      <div className="text-2xl font-bold mb-1">{match.home_team?.code}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {match.home_team?.name}
                      </div>
                    </div>
                    <div className="text-muted-foreground font-medium">vs</div>
                    <div className="text-center flex-1">
                      <div className="text-2xl font-bold mb-1">{match.away_team?.code}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {match.away_team?.name}
                      </div>
                    </div>
                  </div>
                  <Button asChild className="w-full mt-4" size="sm">
                    <Link href={`/dashboard/matches/${match.id}`}>Fazer palpite</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma partida agendada no momento.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Fazer Palpites
            </CardTitle>
            <CardDescription>
              Veja todas as partidas e faca seus palpites antes que comecem.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/matches">
                Ver partidas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal className="h-5 w-5 text-accent" />
              Ver Ranking
            </CardTitle>
            <CardDescription>
              Confira sua posicao e veja quem esta liderando o bolao.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary">
              <Link href="/dashboard/ranking">
                Ver ranking
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

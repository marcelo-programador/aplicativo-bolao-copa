import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Medal, Target, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export default async function RankingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Buscar ranking
  const { data: leaderboard } = await supabase
    .from('leaderboard')
    .select('*')
    .order('total_points', { ascending: false })

  const userPosition = leaderboard?.findIndex(l => l.id === user?.id) ?? -1

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">{rank}</span>
    }
  }

  const getRankBgClass = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-500/10 border-yellow-500/30'
      case 2:
        return 'bg-gray-400/10 border-gray-400/30'
      case 3:
        return 'bg-amber-600/10 border-amber-600/30'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Ranking</h1>
        <p className="text-muted-foreground">
          Confira sua posicao e veja quem esta liderando o bolao.
        </p>
      </div>

      {/* Top 3 Podium */}
      {leaderboard && leaderboard.length >= 3 && (
        <div className="grid grid-cols-3 gap-4">
          {/* 2nd Place */}
          <Card className="mt-8 bg-gray-400/10 border-gray-400/30">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-400/20 flex items-center justify-center mx-auto mb-3">
                <Medal className="h-6 w-6 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-400">2º</div>
              <div className="font-semibold truncate mt-2">{leaderboard[1].name}</div>
              <div className="text-2xl font-bold text-primary mt-1">
                {leaderboard[1].total_points}
              </div>
              <div className="text-xs text-muted-foreground">pontos</div>
            </CardContent>
          </Card>

          {/* 1st Place */}
          <Card className="bg-yellow-500/10 border-yellow-500/30">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-3">
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold text-yellow-500">1º</div>
              <div className="font-semibold truncate mt-2">{leaderboard[0].name}</div>
              <div className="text-3xl font-bold text-primary mt-1">
                {leaderboard[0].total_points}
              </div>
              <div className="text-xs text-muted-foreground">pontos</div>
            </CardContent>
          </Card>

          {/* 3rd Place */}
          <Card className="mt-12 bg-amber-600/10 border-amber-600/30">
            <CardContent className="pt-6 text-center">
              <div className="w-10 h-10 rounded-full bg-amber-600/20 flex items-center justify-center mx-auto mb-3">
                <Medal className="h-5 w-5 text-amber-600" />
              </div>
              <div className="text-xl font-bold text-amber-600">3º</div>
              <div className="font-semibold truncate mt-2">{leaderboard[2].name}</div>
              <div className="text-xl font-bold text-primary mt-1">
                {leaderboard[2].total_points}
              </div>
              <div className="text-xs text-muted-foreground">pontos</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Your Position */}
      {userPosition >= 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sua posicao</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-primary">{userPosition + 1}º</div>
              <div className="flex-1">
                <div className="font-semibold">{leaderboard?.[userPosition]?.name}</div>
                <div className="text-sm text-muted-foreground">
                  {leaderboard?.[userPosition]?.total_points} pontos
                </div>
              </div>
              <div className="text-right text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Target className="h-3 w-3" />
                  {leaderboard?.[userPosition]?.exact_scores} exatos
                </div>
                <div className="text-muted-foreground">
                  {leaderboard?.[userPosition]?.total_predictions} palpites
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Ranking Table */}
      <Card>
        <CardHeader>
          <CardTitle>Classificacao Geral</CardTitle>
          <CardDescription>
            {leaderboard?.length || 0} participantes no bolao
          </CardDescription>
        </CardHeader>
        <CardContent>
          {leaderboard && leaderboard.length > 0 ? (
            <div className="space-y-2">
              {leaderboard.map((entry, index) => {
                const rank = index + 1
                const isCurrentUser = entry.id === user?.id

                return (
                  <div
                    key={entry.id}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-lg transition-colors',
                      getRankBgClass(rank),
                      isCurrentUser && rank > 3 && 'bg-primary/10 border border-primary/30',
                      rank > 3 && !isCurrentUser && 'hover:bg-muted/50'
                    )}
                  >
                    <div className="w-8 flex justify-center">
                      {getRankIcon(rank)}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        'font-semibold truncate',
                        isCurrentUser && 'text-primary'
                      )}>
                        {entry.name}
                        {isCurrentUser && (
                          <span className="text-xs ml-2 text-primary">(Voce)</span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {entry.total_predictions} palpites
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">{entry.total_points}</div>
                      <div className="text-xs text-muted-foreground">pontos</div>
                    </div>
                    <div className="hidden sm:block text-right min-w-[80px]">
                      <div className="text-sm">
                        <span className="text-primary font-medium">{entry.exact_scores}</span>
                        <span className="text-muted-foreground"> exatos</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {entry.correct_winners} vencedores
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhum participante no ranking ainda.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Faca seus palpites para aparecer aqui!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Legenda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-muted-foreground">Placar exato: 10 pts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent"></div>
              <span className="text-muted-foreground">Vencedor: 5 pts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
              <span className="text-muted-foreground">Empate: 3 pts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <span className="text-muted-foreground">Errou: 0 pts</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Target, Medal, Calendar } from 'lucide-react'
import { ProfileForm } from '@/components/profile-form'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Buscar perfil
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Buscar estatísticas
  const { data: predictions } = await supabase
    .from('predictions')
    .select('points')
    .eq('user_id', user.id)

  const totalPoints = predictions?.reduce((acc, p) => acc + (p.points || 0), 0) || 0
  const totalPredictions = predictions?.length || 0
  const exactScores = predictions?.filter(p => p.points === 10).length || 0
  const correctWinners = predictions?.filter(p => p.points === 5).length || 0
  const correctDraws = predictions?.filter(p => p.points === 3).length || 0

  // Buscar posição no ranking
  const { data: leaderboard } = await supabase
    .from('leaderboard')
    .select('*')
    .order('total_points', { ascending: false })

  const userRank = leaderboard?.findIndex(l => l.id === user.id) ?? -1
  const rankPosition = userRank >= 0 ? userRank + 1 : '-'

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informacoes e veja suas estatisticas.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Trophy className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">{totalPoints}</div>
            <div className="text-xs text-muted-foreground">Pontos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Medal className="h-6 w-6 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold">{rankPosition}º</div>
            <div className="text-xs text-muted-foreground">Posicao</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Target className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
            <div className="text-2xl font-bold">{totalPredictions}</div>
            <div className="text-xs text-muted-foreground">Palpites</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Calendar className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">{exactScores}</div>
            <div className="text-xs text-muted-foreground">Exatos</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Estatisticas Detalhadas</CardTitle>
          <CardDescription>Seu desempenho no bolao</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span>Placares exatos (10 pts)</span>
              </div>
              <span className="font-bold">{exactScores}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-accent"></div>
                <span>Vencedores corretos (5 pts)</span>
              </div>
              <span className="font-bold">{correctWinners}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
                <span>Empates corretos (3 pts)</span>
              </div>
              <span className="font-bold">{correctDraws}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="font-semibold">Total de pontos</span>
              <span className="font-bold text-primary text-xl">{totalPoints}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informacoes da Conta</CardTitle>
          <CardDescription>Atualize seu nome de exibicao</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm 
            userId={user.id} 
            currentName={profile?.name || ''} 
            email={user.email || ''} 
          />
        </CardContent>
      </Card>
    </div>
  )
}

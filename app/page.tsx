import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Target, Medal, Users, ArrowRight, Check } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Trophy className="h-6 w-6" />
            <span className="text-xl font-bold">Bolao 2026</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/auth/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Cadastrar</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Trophy className="h-4 w-4" />
              Copa do Mundo 2026
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
              Faca seus palpites e{' '}
              <span className="text-primary">dispute com amigos</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
              O maior bolao da Copa do Mundo 2026! Palpite os placares das partidas, 
              acumule pontos e veja quem e o craque dos palpites.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/auth/sign-up">
                  Comecar agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link href="/auth/login">Ja tenho conta</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Como funciona
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Simples, rapido e divertido. Em poucos passos voce ja esta competindo!
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-background border-border">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>1. Cadastre-se</CardTitle>
                <CardDescription>
                  Crie sua conta gratuitamente e entre para o bolao em segundos.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-background border-border">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>2. Faca palpites</CardTitle>
                <CardDescription>
                  Palpite o placar de cada partida antes do jogo comecar.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-background border-border">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Medal className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>3. Pontue e venca</CardTitle>
                <CardDescription>
                  Acumule pontos com seus acertos e suba no ranking!
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Scoring System */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Sistema de Pontuacao
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
              Quanto mais preciso seu palpite, mais pontos voce ganha!
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-primary bg-primary/5">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-2">10</div>
                    <div className="text-lg font-semibold mb-2">pontos</div>
                    <p className="text-muted-foreground">Placar exato</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Ex: Palpite 2x1, Resultado 2x1
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-accent bg-accent/5">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-accent mb-2">5</div>
                    <div className="text-lg font-semibold mb-2">pontos</div>
                    <p className="text-muted-foreground">Acertou o vencedor</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Ex: Palpite 3x1, Resultado 2x0
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-muted-foreground/50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-muted-foreground mb-2">3</div>
                    <div className="text-lg font-semibold mb-2">pontos</div>
                    <p className="text-muted-foreground">Acertou o empate</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Ex: Palpite 1x1, Resultado 0x0
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Por que participar?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                'Totalmente gratuito',
                'Ranking em tempo real',
                'Todas as 104 partidas da Copa',
                'Palpites ate o inicio do jogo',
                'Estatisticas detalhadas',
                'Interface moderna e facil',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-lg">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30">
            <CardContent className="py-12 text-center">
              <Trophy className="h-16 w-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pronto para mostrar que entende de futebol?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Junte-se a milhares de participantes e prove que seus palpites sao os melhores!
              </p>
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/auth/sign-up">
                  Participar do bolao
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-primary">
              <Trophy className="h-5 w-5" />
              <span className="font-bold">Bolao 2026</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Copa do Mundo 2026 - EUA, Mexico e Canada
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

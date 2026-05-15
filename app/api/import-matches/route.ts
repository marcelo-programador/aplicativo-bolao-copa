// app/api/import-matches/route.ts (versão completa)
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const token = process.env.WC2026_API_KEY!;

  try {
    const response = await fetch("https://api.wc2026api.com/matches", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "accept": "application/json",
      },
    });

    const matches = await response.json();
    
    console.log(`Encontradas ${matches.length} partidas`);
    
    // Mapeamento completo incluindo stage
    const matchesToInsert = matches.map((match: any) => ({
      match_id: match.id,
      match_number: match.match_number,
      round: match.round,
      stage: match.round, // Usando round como stage
      group_name: match.group_name,
      home_team_id: match.home_team_id,
      away_team_id: match.away_team_id,
      home_team: match.home_team,
      home_team_code: match.home_team_code,
      home_team_flag: match.home_team_flag,
      away_team: match.away_team,
      away_team_code: match.away_team_code,
      away_team_flag: match.away_team_flag,
      home_score: match.home_score,
      away_score: match.away_score,
      home_pen: match.home_pen,
      away_pen: match.away_pen,
      stadium: match.stadium,
      stadium_city: match.stadium_city,
      stadium_country: match.stadium_country,
      match_date: match.kickoff_utc,
      kickoff_utc: match.kickoff_utc,
      status: match.status,
    }));

    // Limpar tabela existente
    const { error: deleteError } = await supabase
      .from('matches')
      .delete()
      .neq('match_id', 0);

    if (deleteError) {
      console.log('Erro ao limpar:', deleteError);
    }

    // Inserir em lotes
    const batchSize = 50;
    let inserted = 0;
    
    for (let i = 0; i < matchesToInsert.length; i += batchSize) {
      const batch = matchesToInsert.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from('matches')
        .insert(batch);
      
      if (insertError) {
        console.error(`Erro no lote ${i/batchSize + 1}:`, insertError);
        throw insertError;
      }
      
      inserted += batch.length;
      console.log(`Lote ${i/batchSize + 1}: ${batch.length} partidas inseridas`);
    }

    return NextResponse.json({
      success: true,
      message: `${inserted} partidas importadas com sucesso!`,
      count: inserted
    });

  } catch (error: any) {
    console.error('Erro detalhado:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
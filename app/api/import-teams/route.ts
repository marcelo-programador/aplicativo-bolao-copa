/*
// app/api/import-teams/route.ts (versão upsert)
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const token = process.env.WC2026_API_KEY!;

  try {
    const response = await fetch("https://api.wc2026api.com/teams", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "accept": "application/json",
      },
    });

    const teams = await response.json();
    
    const teamsToUpsert = teams.map((team: any) => ({
      name: team.name,
      code: team.code,
      group_name: team.group_name,
      flag_url: team.flag_url,
    }));

    // upsert: se o code já existir, não faz nada (ignora)
    const { data, error } = await supabase
      .from('teams')
      .upsert(teamsToUpsert, { 
        onConflict: 'code',  // Usa a coluna code como referência
        ignoreDuplicates: true  // Ignora se já existir
      })
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `${data?.length || 0} times processados (apenas novos foram inseridos)`,
      inserted: data?.length || 0
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}*/
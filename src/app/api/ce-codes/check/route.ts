import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';

/**
 * Vérification publique d'un code CE (utilisée par /abonnement).
 * Renvoie le pourcentage pris en charge par l'employeur si le code existe
 * et est actif. Utilise la clé service_role car la table `ce_codes` est
 * publique en lecture (RLS), mais cette route centralise la logique de
 * validation (code actif, casse, etc.).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = (searchParams.get('code') ?? '').trim().toUpperCase();

  if (!code) {
    return NextResponse.json({ valid: false });
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('ce_codes')
    .select('employer_pct, actif')
    .eq('code', code)
    .maybeSingle();

  if (error || !data || !data.actif) {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({ valid: true, employerPct: data.employer_pct ?? 0 });
}

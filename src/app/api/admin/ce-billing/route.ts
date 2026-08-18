import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';

/**
 * Agrège, par code CE, le montant que chaque employeur doit actuellement
 * rembourser à la biscuiterie (somme de `employer_discount` des abonnés
 * actifs rattachés à ce code), pour que la gérante puisse facturer chaque
 * mois. Instantané "en ce moment" — pas d'historique mois par mois (aucun
 * système de facturation périodique n'existe ailleurs dans ce site).
 */
const DEFAULT_ADMIN_PASSWORD = 'louvat1954';

function isAuthorized(request: Request): boolean {
  const provided = request.headers.get('x-admin-password') ?? '';
  const expected = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
  return provided === expected;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('abonnes')
    .select('ce_code, employer_discount')
    .eq('statut', 'actif')
    .not('ce_code', 'is', null);

  if (error) {
    console.error('Erreur Supabase (facturation CE) :', error);
    return NextResponse.json({ error: 'Impossible de calculer la facturation CE.' }, { status: 500 });
  }

  const parCode: Record<string, { total: number; abonnes: number }> = {};
  for (const row of data ?? []) {
    const code = row.ce_code as string;
    if (!code) continue;
    if (!parCode[code]) parCode[code] = { total: 0, abonnes: 0 };
    parCode[code].total += typeof row.employer_discount === 'number' ? row.employer_discount : 0;
    parCode[code].abonnes += 1;
  }

  return NextResponse.json({ billing: parCode });
}

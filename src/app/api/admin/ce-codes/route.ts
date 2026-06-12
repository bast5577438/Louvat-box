import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';

/**
 * Gestion des codes CE (table `ce_codes`) depuis l'espace admin.
 * Même mécanisme de protection que /api/admin/abonnes (en-tête x-admin-password).
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
  const { data, error } = await supabase.from('ce_codes').select('*').order('id', { ascending: false });

  if (error) {
    console.error('Erreur Supabase (liste codes CE) :', error);
    return NextResponse.json({ error: 'Impossible de récupérer les codes CE.' }, { status: 500 });
  }

  return NextResponse.json({ codes: data });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const { code, societe, contact, email, employer_pct, actif } = body;
  if (!code || typeof code !== 'string') {
    return NextResponse.json({ error: 'Le code est requis.' }, { status: 400 });
  }
  if (!societe || typeof societe !== 'string' || !email || typeof email !== 'string') {
    return NextResponse.json({ error: "La société et l'email sont requis." }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('ce_codes')
    .insert({
      code: code.toUpperCase(),
      societe,
      contact: contact ?? null,
      email,
      employer_pct: typeof employer_pct === 'number' ? employer_pct : 30,
      abonnes: 0,
      actif: actif ?? true,
    })
    .select()
    .single();

  if (error) {
    console.error('Erreur Supabase (création code CE) :', error);
    return NextResponse.json({ error: 'Impossible de créer ce code CE (il existe peut-être déjà).' }, { status: 500 });
  }

  return NextResponse.json({ code: data });
}

export async function PUT(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const { id, ...updates } = body;
  if (!id) {
    return NextResponse.json({ error: 'Identifiant manquant.' }, { status: 400 });
  }
  if (typeof updates.code === 'string') {
    updates.code = updates.code.toUpperCase();
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('ce_codes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erreur Supabase (mise à jour code CE) :', error);
    return NextResponse.json({ error: 'Impossible de mettre à jour ce code CE.' }, { status: 500 });
  }

  return NextResponse.json({ code: data });
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Identifiant manquant.' }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from('ce_codes').delete().eq('id', id);

  if (error) {
    console.error('Erreur Supabase (suppression code CE) :', error);
    return NextResponse.json({ error: 'Impossible de supprimer ce code CE.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

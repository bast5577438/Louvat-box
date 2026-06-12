import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';

/**
 * Gestion des contacts entreprise (table `prospects`) depuis l'espace admin.
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
  const { data, error } = await supabase.from('prospects').select('*').order('id', { ascending: false });

  if (error) {
    console.error('Erreur Supabase (liste prospects) :', error);
    return NextResponse.json({ error: 'Impossible de récupérer les contacts.' }, { status: 500 });
  }

  return NextResponse.json({ prospects: data });
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

  const { societe, contact, email } = body;
  if (!societe || typeof societe !== 'string' || !contact || typeof contact !== 'string' || !email || typeof email !== 'string') {
    return NextResponse.json({ error: 'La société, le contact et l\'email sont requis.' }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('prospects')
    .insert({ societe, contact, email })
    .select()
    .single();

  if (error) {
    console.error('Erreur Supabase (création prospect) :', error);
    return NextResponse.json({ error: 'Impossible de créer ce contact.' }, { status: 500 });
  }

  return NextResponse.json({ prospect: data });
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

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('prospects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erreur Supabase (mise à jour prospect) :', error);
    return NextResponse.json({ error: 'Impossible de mettre à jour ce contact.' }, { status: 500 });
  }

  return NextResponse.json({ prospect: data });
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
  const { error } = await supabase.from('prospects').delete().eq('id', id);

  if (error) {
    console.error('Erreur Supabase (suppression prospect) :', error);
    return NextResponse.json({ error: 'Impossible de supprimer ce contact.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

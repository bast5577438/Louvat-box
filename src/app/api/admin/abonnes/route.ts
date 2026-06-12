import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';

/**
 * Gestion des espaces clients (table `abonnes`) depuis l'espace admin.
 *
 * Protection : l'espace admin (/admin) demande déjà un mot de passe avant
 * d'afficher quoi que ce soit. Ce mot de passe est renvoyé dans l'en-tête
 * `x-admin-password` et comparé ici à la variable d'environnement
 * ADMIN_PASSWORD (ou à la valeur par défaut "louvat1954").
 *
 * NB : ce mécanisme reste volontairement simple, en attendant un vrai
 * système de comptes administrateurs (Supabase Auth + rôle "admin").
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
    .select('*')
    .order('date_inscription', { ascending: false });

  if (error) {
    console.error('Erreur Supabase (liste abonnés) :', error);
    return NextResponse.json({ error: 'Impossible de récupérer les abonnés.' }, { status: 500 });
  }

  return NextResponse.json({ abonnes: data });
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

  const { name, prenom, email, formule, box_id, engagement, prix, ce_code, statut, selections } = body;
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: "L'email est requis." }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('abonnes')
    .insert({
      name: name ?? null,
      prenom: prenom ?? null,
      email,
      formule: formule ?? null,
      box_id: box_id ?? null,
      engagement: engagement ?? null,
      prix: prix ?? null,
      ce_code: ce_code ?? null,
      statut: statut ?? 'actif',
      selections: selections ?? [],
      date_inscription: new Date().toISOString().split('T')[0],
    })
    .select()
    .single();

  if (error) {
    console.error('Erreur Supabase (création abonné) :', error);
    return NextResponse.json({ error: "Impossible de créer cet espace client (l'email existe peut-être déjà)." }, { status: 500 });
  }

  return NextResponse.json({ abonne: data });
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
    .from('abonnes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erreur Supabase (mise à jour abonné) :', error);
    return NextResponse.json({ error: 'Impossible de mettre à jour cet espace client.' }, { status: 500 });
  }

  return NextResponse.json({ abonne: data });
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
  const { error } = await supabase.from('abonnes').delete().eq('id', id);

  if (error) {
    console.error('Erreur Supabase (suppression abonné) :', error);
    return NextResponse.json({ error: 'Impossible de supprimer cet espace client.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

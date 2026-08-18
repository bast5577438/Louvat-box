import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';

/**
 * Gestion du catalogue de biscuits (table `produits`) depuis l'espace admin.
 * Même mécanisme de protection que /api/admin/abonnes (en-tête x-admin-password).
 */
const DEFAULT_ADMIN_PASSWORD = 'louvat1954';

// Nombre maximum de produits simultanément disponibles dans la box.
const MAX_PRODUITS_DISPONIBLES = 10;
// Nombre de produits qui composent la box du mois (fixe pour tous les abonnés).
const MAX_BOX_DU_MOIS = 3;

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
  const { data, error } = await supabase.from('produits').select('*').order('id', { ascending: true });

  if (error) {
    console.error('Erreur Supabase (liste produits) :', error);
    return NextResponse.json({ error: 'Impossible de récupérer les produits.' }, { status: 500 });
  }

  return NextResponse.json({ produits: data });
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

  const { name, description, category, price, image, badge, available, allergens } = body;
  if (!name || typeof name !== 'string') {
    return NextResponse.json({ error: 'Le nom est requis.' }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();

  if (available !== false) {
    const { count, error: countError } = await supabase
      .from('produits')
      .select('id', { count: 'exact', head: true })
      .eq('available', true);

    if (countError) {
      console.error('Erreur Supabase (comptage produits disponibles) :', countError);
      return NextResponse.json({ error: 'Impossible de vérifier les produits disponibles.' }, { status: 500 });
    }
    if ((count ?? 0) >= MAX_PRODUITS_DISPONIBLES) {
      return NextResponse.json(
        { error: `Vous ne pouvez pas avoir plus de ${MAX_PRODUITS_DISPONIBLES} produits disponibles en même temps. Désactivez-en un avant d'en ajouter un nouveau.` },
        { status: 400 }
      );
    }
  }

  const { data, error } = await supabase
    .from('produits')
    .insert({
      name,
      description: description ?? null,
      category: category ?? null,
      price: typeof price === 'number' ? price : null,
      image: image ?? null,
      badge: badge ?? null,
      available: available ?? true,
      allergens: Array.isArray(allergens) ? allergens : [],
    })
    .select()
    .single();

  if (error) {
    console.error('Erreur Supabase (création produit) :', error);
    return NextResponse.json({ error: 'Impossible de créer ce produit.' }, { status: 500 });
  }

  return NextResponse.json({ produit: data });
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

  if (updates.available === true) {
    const { count, error: countError } = await supabase
      .from('produits')
      .select('id', { count: 'exact', head: true })
      .eq('available', true)
      .neq('id', id);

    if (countError) {
      console.error('Erreur Supabase (comptage produits disponibles) :', countError);
      return NextResponse.json({ error: 'Impossible de vérifier les produits disponibles.' }, { status: 500 });
    }
    if ((count ?? 0) >= MAX_PRODUITS_DISPONIBLES) {
      return NextResponse.json(
        { error: `Vous ne pouvez pas avoir plus de ${MAX_PRODUITS_DISPONIBLES} produits disponibles en même temps. Désactivez-en un avant d'en activer un nouveau.` },
        { status: 400 }
      );
    }
  }

  if (updates.mois_actif === true) {
    const { count, error: countError } = await supabase
      .from('produits')
      .select('id', { count: 'exact', head: true })
      .eq('mois_actif', true)
      .neq('id', id);

    if (countError) {
      console.error('Erreur Supabase (comptage box du mois) :', countError);
      return NextResponse.json({ error: 'Impossible de vérifier la box du mois.' }, { status: 500 });
    }
    if ((count ?? 0) >= MAX_BOX_DU_MOIS) {
      return NextResponse.json(
        { error: `La box du mois contient déjà ${MAX_BOX_DU_MOIS} produits. Retirez-en un avant d'en ajouter un nouveau.` },
        { status: 400 }
      );
    }
  }

  const { data, error } = await supabase
    .from('produits')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erreur Supabase (mise à jour produit) :', error);
    return NextResponse.json({ error: 'Impossible de mettre à jour ce produit.' }, { status: 500 });
  }

  return NextResponse.json({ produit: data });
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
  const { error } = await supabase.from('produits').delete().eq('id', id);

  if (error) {
    console.error('Erreur Supabase (suppression produit) :', error);
    return NextResponse.json({ error: 'Impossible de supprimer ce produit.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

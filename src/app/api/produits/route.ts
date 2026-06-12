import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';

/**
 * Catalogue de biscuits (table `produits`) pour les pages clientes
 * (/box, /abonnement). Lecture publique, pas d'authentification requise.
 */
export async function GET() {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from('produits').select('*').order('id', { ascending: true });

  if (error) {
    console.error('Erreur Supabase (liste produits publics) :', error);
    return NextResponse.json({ error: 'Impossible de récupérer les produits.' }, { status: 500 });
  }

  return NextResponse.json({ produits: data });
}

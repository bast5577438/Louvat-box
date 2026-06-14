import { NextResponse } from 'next/server';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { biscuits } from '@/lib/data';

/**
 * Catalogue de biscuits (table `produits`) pour les pages clientes
 * (/box, /abonnement). Lecture publique, pas d'authentification requise.
 *
 * On lit avec la clé publique (anon) car la table `produits` est en
 * lecture publique (RLS) : pas besoin de la clé secrète service_role
 * pour un simple catalogue.
 *
 * Si la base n'est pas joignable (ex : variables Supabase non configurées
 * en local, ou incident côté base), on renvoie le catalogue intégré
 * (`biscuits` de data.ts) plutôt qu'une page vide : les pages clientes
 * affichent toujours des produits. Le champ `source` indique l'origine.
 */
export async function GET() {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.from('produits').select('*').order('id', { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.error('Erreur Supabase (liste produits publics), repli sur le catalogue intégré :', error);
      return NextResponse.json({ produits: biscuits, source: 'fallback' });
    }

    return NextResponse.json({ produits: data, source: 'database' });
  } catch (err) {
    console.error('Base produits injoignable, repli sur le catalogue intégré :', err);
    return NextResponse.json({ produits: biscuits, source: 'fallback' });
  }
}

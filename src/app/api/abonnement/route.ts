import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';

/**
 * Création / mise à jour de l'espace abonné suite à une souscription
 * (étape finale du parcours /box → /abonnement, après le paiement SEPA).
 *
 * Cette route est appelée sans mot de passe admin : elle est utilisée par
 * n'importe quel visiteur qui vient de souscrire. Elle utilise la clé
 * service_role (côté serveur uniquement) pour écrire dans `abonnes`,
 * en "upsert" sur l'email :
 *  - si la personne a déjà un compte (créé via /mon-compte), sa ligne
 *    existante est mise à jour avec sa nouvelle formule ;
 *  - sinon, une nouvelle ligne est créée. Si elle crée un compte plus
 *    tard avec le même email, le trigger `handle_new_user` reliera
 *    automatiquement ce compte à cette ligne (on conflict email).
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const { prenom, nom, email, engagement, box_id, prix, ce_code, selections } = body;

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: "L'email est requis." }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('abonnes')
    .upsert(
      {
        email,
        name: typeof nom === 'string' ? nom : null,
        prenom: typeof prenom === 'string' ? prenom : null,
        formule: typeof box_id === 'string' ? box_id : null,
        box_id: typeof box_id === 'string' ? box_id : null,
        engagement: typeof engagement === 'string' ? engagement : null,
        prix: typeof prix === 'number' ? prix : null,
        ce_code: typeof ce_code === 'string' && ce_code ? ce_code : null,
        selections: Array.isArray(selections) ? selections : [],
        statut: 'actif',
        date_inscription: new Date().toISOString().split('T')[0],
      },
      { onConflict: 'email' }
    )
    .select()
    .single();

  if (error) {
    console.error('Erreur Supabase (création abonnement) :', error);
    return NextResponse.json({ error: "Impossible d'enregistrer votre abonnement." }, { status: 500 });
  }

  return NextResponse.json({ abonne: data });
}

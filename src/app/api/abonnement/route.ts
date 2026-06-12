import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { getResend, getFromEmail, resolveRecipient } from '@/lib/resend';
import { ORDER_EMAIL } from '@/lib/contact';
import { biscuits, boxSizes, engagements } from '@/lib/data';

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

  await sendOrderNotification({ prenom, nom, email, engagement, box_id, prix, ce_code, selections });

  return NextResponse.json({ abonne: data });
}

/**
 * Notifie commande@biscuiterie-louvat.com qu'un nouvel abonnement vient
 * d'être créé/mis à jour, avec le détail de la commande.
 */
async function sendOrderNotification(order: {
  prenom?: unknown;
  nom?: unknown;
  email: string;
  engagement?: unknown;
  box_id?: unknown;
  prix?: unknown;
  ce_code?: unknown;
  selections?: unknown;
}) {
  const resend = getResend();
  if (!resend) return;

  const box = boxSizes.find((b) => b.id === order.box_id);
  const eng = engagements.find((e) => e.id === order.engagement);
  const selectedBiscuits = Array.isArray(order.selections)
    ? order.selections
        .map((id) => biscuits.find((b) => b.id === id)?.name)
        .filter((name): name is string => Boolean(name))
    : [];

  const lines = [
    'Nouvelle commande / abonnement reçu sur Louvat Box :',
    '',
    `Client : ${typeof order.prenom === 'string' ? order.prenom : ''} ${typeof order.nom === 'string' ? order.nom : ''}`.trim(),
    `Email : ${order.email}`,
    `Formule : ${box ? box.label : order.box_id ?? '-'}`,
    `Engagement : ${eng ? eng.label : order.engagement ?? '-'}`,
    `Prix : ${typeof order.prix === 'number' ? `${order.prix} €` : '-'}`,
    order.ce_code ? `Code CE : ${order.ce_code}` : null,
    `Biscuits sélectionnés : ${selectedBiscuits.length ? selectedBiscuits.join(', ') : '-'}`,
  ].filter((line): line is string => Boolean(line));

  try {
    await resend.emails.send({
      from: getFromEmail(),
      to: resolveRecipient(ORDER_EMAIL),
      subject: `Nouvelle commande Louvat Box — ${order.email}`,
      text: lines.join('\n'),
    });
  } catch (err) {
    console.error('Erreur Resend (notification de commande) :', err);
  }
}

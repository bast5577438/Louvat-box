import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { getResend, getFromEmail, resolveRecipient } from '@/lib/resend';
import { ORDER_EMAIL } from '@/lib/contact';
import { BOX_PRICE, engagements, type EngagementId } from '@/lib/data';

type TypeAbonnement = 'entreprise' | 'ce-salarie';

/**
 * Création / mise à jour de l'espace abonné suite à une souscription
 * (tunnel /abonnement pour un salarié avec code CE, ou /entreprise pour
 * un achat B2B en quantité).
 *
 * Cette route est appelée sans mot de passe admin : elle est utilisée par
 * n'importe quel visiteur qui vient de souscrire. Elle utilise la clé
 * service_role (côté serveur uniquement) pour écrire dans `abonnes`,
 * en "upsert" sur l'email.
 *
 * IMPORTANT : le prix et les remises sont recalculés ici, côté serveur,
 * à partir du tarif officiel (`BOX_PRICE`) et d'une revalidation du code CE
 * en base — on ne fait jamais confiance à un prix/pourcentage envoyé par
 * le client.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const { prenom, nom, email, engagement, ce_code, telephone, adresse, ville, cp, entreprise } = body;

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: "L'email est requis." }, { status: 400 });
  }

  const type_abonnement: TypeAbonnement = body.type_abonnement === 'entreprise' ? 'entreprise' : 'ce-salarie';

  const quantiteBrute = typeof body.quantite === 'number' ? body.quantite : Number(body.quantite);
  const quantite = Number.isFinite(quantiteBrute) && quantiteBrute >= 1 ? Math.floor(quantiteBrute) : 1;

  if (typeof engagement !== 'string' || !(engagement in BOX_PRICE)) {
    return NextResponse.json({ error: 'Engagement invalide.' }, { status: 400 });
  }
  const unitPrice = BOX_PRICE[engagement as EngagementId];

  const supabase = getSupabaseAdminClient();

  let louvat_discount = 0;
  let employer_discount = 0;
  let ceCodeValide: string | null = null;

  if (type_abonnement === 'ce-salarie') {
    const codeSaisi = typeof ce_code === 'string' ? ce_code.trim().toUpperCase() : '';
    if (!codeSaisi) {
      return NextResponse.json({ error: 'Un code CE valide est requis pour cette offre.' }, { status: 400 });
    }
    const { data: ceCode, error: ceError } = await supabase
      .from('ce_codes')
      .select('code, employer_pct, actif')
      .eq('code', codeSaisi)
      .maybeSingle();

    if (ceError || !ceCode || !ceCode.actif) {
      return NextResponse.json({ error: 'Code CE invalide ou inactif.' }, { status: 400 });
    }

    ceCodeValide = ceCode.code;
    louvat_discount = Math.round(unitPrice * 0.1 * 100) / 100;
    employer_discount = Math.round(unitPrice * ((ceCode.employer_pct ?? 0) / 100) * 100) / 100;
  }

  const finalPrice =
    type_abonnement === 'entreprise'
      ? Math.round(unitPrice * quantite * 100) / 100
      : Math.max(0, Math.round((unitPrice - louvat_discount - employer_discount) * 100) / 100);

  const { data, error } = await supabase
    .from('abonnes')
    .upsert(
      {
        email,
        name: typeof nom === 'string' ? nom : null,
        prenom: typeof prenom === 'string' ? prenom : null,
        formule: 'box-du-mois',
        box_id: 'box-du-mois',
        engagement,
        type_abonnement,
        quantite: type_abonnement === 'entreprise' ? quantite : 1,
        prix: finalPrice,
        louvat_discount,
        employer_discount,
        ce_code: ceCodeValide,
        selections: [],
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

  const orderDetails = {
    prenom,
    nom,
    email,
    engagement,
    type_abonnement,
    quantite,
    prix: finalPrice,
    ce_code: ceCodeValide,
    entreprise,
    telephone,
    adresse,
    ville,
    cp,
  };

  await sendOrderNotification(orderDetails);
  await sendCustomerConfirmation(orderDetails);

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
  type_abonnement: TypeAbonnement;
  quantite: number;
  prix: number;
  ce_code: string | null;
  entreprise?: unknown;
  telephone?: unknown;
  adresse?: unknown;
  ville?: unknown;
  cp?: unknown;
}) {
  const resend = getResend();
  if (!resend) return;

  const eng = engagements.find((e) => e.id === order.engagement);
  const adresseLigne = [order.adresse, order.cp, order.ville].filter((v) => typeof v === 'string' && v).join(', ');

  const lines = [
    'Nouvelle commande / abonnement reçu sur Louvat Box :',
    '',
    `Type : ${order.type_abonnement === 'entreprise' ? 'Entreprise (B2B)' : 'Salarié CE'}`,
    order.type_abonnement === 'entreprise' && typeof order.entreprise === 'string' ? `Entreprise : ${order.entreprise}` : null,
    `Client : ${typeof order.prenom === 'string' ? order.prenom : ''} ${typeof order.nom === 'string' ? order.nom : ''}`.trim(),
    `Email : ${order.email}`,
    typeof order.telephone === 'string' && order.telephone ? `Téléphone : ${order.telephone}` : null,
    adresseLigne ? `Adresse de livraison : ${adresseLigne}` : null,
    `Formule : Box du mois${order.type_abonnement === 'entreprise' ? ` × ${order.quantite}` : ''}`,
    `Engagement : ${eng ? eng.label : order.engagement ?? '-'}`,
    `Prix : ${order.prix} €`,
    order.ce_code ? `Code CE : ${order.ce_code}` : null,
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

/**
 * Envoie au client un email de bienvenue confirmant son abonnement,
 * avec le récapitulatif de sa formule.
 */
async function sendCustomerConfirmation(order: {
  prenom?: unknown;
  nom?: unknown;
  email: string;
  engagement?: unknown;
  type_abonnement: TypeAbonnement;
  quantite: number;
  prix: number;
}) {
  const resend = getResend();
  if (!resend) return;

  const eng = engagements.find((e) => e.id === order.engagement);
  const prenom = typeof order.prenom === 'string' && order.prenom ? order.prenom : '';
  const formule = `Box du mois${order.type_abonnement === 'entreprise' ? ` × ${order.quantite}` : ''}`;

  const html = `
    <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; background: #F3E4CD; padding: 32px 24px;">
      <h1 style="color: #3E4743; font-size: 22px; margin: 0 0 16px;">Bienvenue chez Louvat Box${prenom ? `, ${prenom}` : ''} !</h1>
      <p style="color: #3E4743; font-size: 15px; line-height: 1.6;">
        Merci pour votre confiance. Votre abonnement a bien été enregistré, voici le récapitulatif :
      </p>
      <table style="width: 100%; font-size: 14px; color: #3E4743; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 6px 0; font-weight: bold;">Formule</td><td style="padding: 6px 0; text-align: right;">${formule}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Engagement</td><td style="padding: 6px 0; text-align: right;">${eng ? eng.label : order.engagement ?? '-'}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Prix</td><td style="padding: 6px 0; text-align: right;">${order.prix} € / mois</td></tr>
      </table>
      <p style="color: #3E4743; font-size: 15px; line-height: 1.6;">
        Vous recevrez un email de confirmation à chaque expédition de votre box, avec le suivi de votre colis.
      </p>
      <p style="color: #3E4743; font-size: 15px; line-height: 1.6; margin-top: 24px;">
        À très vite,<br>
        <strong>L'équipe Louvat</strong>
      </p>
    </div>
  `;

  const text = [
    `Bienvenue chez Louvat Box${prenom ? `, ${prenom}` : ''} !`,
    '',
    'Merci pour votre confiance. Votre abonnement a bien été enregistré :',
    `- Formule : ${formule}`,
    `- Engagement : ${eng ? eng.label : order.engagement ?? '-'}`,
    `- Prix : ${order.prix} € / mois`,
    '',
    'Vous recevrez un email de confirmation à chaque expédition de votre box, avec le suivi de votre colis.',
    '',
    "À très vite, l'équipe Louvat",
  ].filter((line): line is string => Boolean(line));

  try {
    await resend.emails.send({
      from: getFromEmail(),
      to: resolveRecipient(order.email),
      subject: 'Bienvenue chez Louvat Box — votre abonnement est confirmé',
      html,
      text: text.join('\n'),
    });
  } catch (err) {
    console.error('Erreur Resend (email de bienvenue client) :', err);
  }
}

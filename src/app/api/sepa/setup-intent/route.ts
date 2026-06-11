import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

/**
 * Crée un "SetupIntent" Stripe pour enregistrer un mandat de prélèvement
 * SEPA (sans débiter immédiatement le client). Le formulaire de paiement
 * (étape 3 de /abonnement) appelle cette route, puis confirme le mandat
 * directement avec Stripe via `stripe.confirmSepaDebitSetup`.
 *
 * Nécessite la variable d'environnement `STRIPE_SECRET_KEY`
 * (voir GUIDE_DEPLOIEMENT.md, Étape 7).
 */
export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Le paiement par carte/SEPA n'est pas encore configuré sur ce site (clé Stripe manquante)." },
      { status: 503 }
    );
  }

  let body: { email?: string; name?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const { email, name } = body;
  if (!email || !name) {
    return NextResponse.json({ error: 'Nom et email requis.' }, { status: 400 });
  }

  try {
    // Réutilise un client Stripe existant pour cet email, ou en crée un nouveau.
    const existing = await stripe.customers.list({ email, limit: 1 });
    const customer = existing.data[0] ?? (await stripe.customers.create({ email, name }));

    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ['sepa_debit'],
    });

    return NextResponse.json({ clientSecret: setupIntent.client_secret });
  } catch (err) {
    console.error('Erreur Stripe (création SetupIntent SEPA) :', err);
    return NextResponse.json(
      { error: 'Erreur lors de la préparation du mandat SEPA. Merci de réessayer.' },
      { status: 500 }
    );
  }
}

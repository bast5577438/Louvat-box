import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

/**
 * Renvoie un client Stripe côté serveur, ou `null` si la clé secrète
 * n'est pas (encore) configurée.
 *
 * Tant que `STRIPE_SECRET_KEY` n'est pas défini (en local dans `.env.local`,
 * et sur Vercel dans les variables d'environnement du projet), les routes
 * qui en dépendent renvoient une erreur explicite au lieu de planter —
 * voir GUIDE_DEPLOIEMENT.md, Étape 7.
 */
export function getStripe(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;

  if (!stripeInstance) {
    stripeInstance = new Stripe(secretKey);
  }
  return stripeInstance;
}

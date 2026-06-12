import { Resend } from 'resend';

let resendInstance: Resend | null = null;

/**
 * Renvoie un client Resend côté serveur, ou `null` si la clé API n'est
 * pas (encore) configurée.
 *
 * Tant que `RESEND_API_KEY` n'est pas défini (en local dans `.env.local`,
 * et sur Vercel dans les variables d'environnement du projet), les routes
 * qui en dépendent renvoient une erreur explicite au lieu de planter —
 * voir GUIDE_DEPLOIEMENT.md, Étape 6.
 */
export function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  if (!resendInstance) {
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

/**
 * Adresse d'expédition utilisée pour les emails envoyés via Resend.
 *
 * Par défaut, on utilise l'adresse de test fournie par Resend
 * (`onboarding@resend.dev`), qui fonctionne sans configuration
 * supplémentaire. Une fois le nom de domaine vérifié dans Resend
 * (GUIDE_DEPLOIEMENT.md, Étape 6), définissez `RESEND_FROM_EMAIL`
 * (ex : "Biscuiterie Louvat <site@biscuiterie-louvat.com>") pour envoyer
 * depuis votre propre domaine.
 */
export function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL || 'Louvat Box <onboarding@resend.dev>';
}

/**
 * Renvoie l'adresse de destination réelle d'une notification, ou
 * `RESEND_TEST_REDIRECT_EMAIL` si défini.
 *
 * Tant que le domaine biscuiterie-louvat.com n'est pas vérifié dans Resend,
 * l'adresse de test `onboarding@resend.dev` ne peut envoyer que vers
 * l'adresse du compte Resend. `RESEND_TEST_REDIRECT_EMAIL` permet de tout
 * recevoir sur cette adresse en attendant — à retirer de `.env.local` une
 * fois le domaine vérifié pour revenir aux vraies adresses (cib@, commande@).
 */
export function resolveRecipient(target: string): string {
  return process.env.RESEND_TEST_REDIRECT_EMAIL || target;
}

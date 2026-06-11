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

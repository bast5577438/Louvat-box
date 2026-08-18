/**
 * URL publique du site, utilisée par le sitemap, robots.txt et les
 * métadonnées Open Graph. Surchageable via NEXT_PUBLIC_SITE_URL (utile
 * le jour où le site bascule sur box.biscuiterie-louvat.com) ; par défaut
 * pointe sur le domaine temporaire du serveur auto-hébergé (voir
 * C:\Docker\sites\louvat-box\LISEZMOI-DEPLOIEMENT.md).
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://louvat-box.aubedigital.fr';

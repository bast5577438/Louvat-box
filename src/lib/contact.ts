/**
 * Adresse qui reçoit tous les messages envoyés depuis les formulaires du
 * site (page "Contact" et formulaire d'inscription du Comité d'Entreprise).
 *
 * Constante partagée entre le client (liens "mailto:" de secours) et le
 * serveur (route /api/contact, voir lib/resend.ts) : ce fichier ne doit
 * dépendre d'aucun module serveur pour rester utilisable dans les
 * composants "use client".
 */
export const CONTACT_EMAIL = 'cib@biscuiterie-louvat.com';

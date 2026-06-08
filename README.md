# 🍪 Louvat Box

Site web d'abonnement à des box de biscuits artisanaux pour la **Biscuiterie Louvat**, à Saint-Geoire-en-Valdaine (Isère).

Le site permet aux clients de découvrir la biscuiterie, de composer leur box et de souscrire à un abonnement mensuel ou trimestriel — avec une prise en charge possible via les comités d'entreprise (CE) partenaires.

## ✨ Fonctionnalités principales

- **Vitrine de la biscuiterie** : présentation de la maison, de la box et de la gamme de biscuits artisanaux
- **Tunnel d'abonnement** : choix de la formule, de la fréquence de livraison et du moyen de paiement (prélèvement SEPA)
- **Codes Comité d'Entreprise (CE)** : saisie d'un code partenaire donnant droit à une prise en charge partielle de l'abonnement par l'employeur
- **Espace client** (« Mon compte ») : suivi de l'abonnement
- **Espace d'administration** : vue d'ensemble pour la gérante (abonnés, codes CE, aperçu des e-mails envoyés aux entreprises partenaires...)
- **Pages légales conformes** : mentions légales, conditions générales de vente (CGV) et politique de confidentialité (RGPD)

## 🛠️ Stack technique

- [Next.js 16](https://nextjs.org) (App Router)
- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS 4](https://tailwindcss.com)
- [lucide-react](https://lucide.dev) pour les icônes

## 🚀 Démarrage

### Prérequis

- [Node.js](https://nodejs.org) version 18 ou plus récente
- npm (installé avec Node.js)

### Installation des dépendances

```bash
npm install
```

### Lancer le serveur de développement

```bash
npm run dev
```

Ouvre ensuite [http://localhost:3000](http://localhost:3000) dans ton navigateur : le site se recharge automatiquement à chaque modification du code.

### Scripts disponibles

| Commande        | Description                                          |
| --------------- | ---------------------------------------------------- |
| `npm run dev`   | Lance le site en mode développement (avec rechargement automatique) |
| `npm run build` | Compile le site pour la mise en production           |
| `npm run start` | Démarre le site en mode production (après `build`)   |
| `npm run lint`  | Vérifie la qualité et la cohérence du code            |

## 📂 Structure du projet

```
src/
├── app/
│   ├── page.tsx              # Page d'accueil
│   ├── box/                  # Présentation de la box de biscuits
│   ├── abonnement/           # Tunnel de souscription (avec codes CE)
│   ├── ce/                   # Page dédiée aux comités d'entreprise
│   ├── mon-compte/           # Espace client
│   ├── admin/                # Espace d'administration (gérante)
│   ├── mentions-legales/
│   ├── cgv/
│   └── confidentialite/
└── components/               # Composants réutilisables (en-tête, pied de page, etc.)
```

## 📌 État du projet

- ✅ Site complet et navigable : toutes les pages, le tunnel d'abonnement et l'espace d'administration sont fonctionnels avec des données de démonstration
- ✅ Pages légales rédigées et conformes (mentions légales, CGV, RGPD)
- 🔜 Connexion à une base de données réelle (Supabase) pour remplacer les données de démonstration par de vraies informations
- 🔜 Mise en ligne définitive (déploiement)

## 📄 À propos

Projet réalisé pour la **Biscuiterie Louvat**. Tous droits réservés.

# 🍪 Louvat Box

> Plateforme d'abonnement à des box de biscuits artisanaux pour la **Biscuiterie Louvat** — Saint-Geoire-en-Valdaine (Isère), maison de qualité depuis 1954.

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?logo=stripe&logoColor=white)

Le site permet aux clients de découvrir la biscuiterie, de composer leur box et de souscrire à un abonnement, avec une prise en charge possible via les **comités d'entreprise (CE)** partenaires. Il inclut un espace client, un espace d'administration autonome pour la gérante, et l'envoi automatique d'e-mails.

---

## ✨ Fonctionnalités

### Côté client
- **Site vitrine** : accueil, présentation de la box, « comment ça marche », catalogue des biscuits.
- **Composition de la box** : choix de la taille (Découverte 3, Gourmande 6, Prestige 10 références) et des biscuits.
- **Abonnement flexible** : sans engagement, trimestriel ou annuel, avec tarifs dégressifs.
- **Paiement par prélèvement SEPA** sécurisé via Stripe (l'IBAN ne transite jamais par nos serveurs).
- **Espace client** (« Mon compte ») : connexion, suivi de l'abonnement, mise en pause, modification de la sélection, résiliation.
- **Pages légales** conformes : mentions légales, CGV, confidentialité (RGPD).

### Côté comités d'entreprise
- Page dédiée et formulaire d'inscription d'un CE.
- **Codes CE** : remise de 10 % offerte par Louvat + un pourcentage pris en charge par l'employeur, appliqués automatiquement.

### Côté administration (gérante)
- Gestion du **catalogue** (produits), des **codes CE**, des **abonnés** et des **prospects**.
- Tableau de bord avec statistiques.

### E-mails automatiques (Resend)
- Notification de **message de contact** et de **nouvelle commande** vers la biscuiterie.
- **E-mail de bienvenue** au client après souscription.

---

## 🛠️ Stack technique

| Domaine | Technologie |
| --- | --- |
| Application | [Next.js 16](https://nextjs.org) (App Router) · [React 19](https://react.dev) · [TypeScript](https://www.typescriptlang.org) |
| Styles | [Tailwind CSS 4](https://tailwindcss.com) · [lucide-react](https://lucide.dev) (icônes) |
| Base de données & comptes | [Supabase](https://supabase.com) (PostgreSQL + Auth) |
| Paiements | [Stripe](https://stripe.com) (mandats SEPA) |
| E-mails | [Resend](https://resend.com) |
| Hébergement | [Vercel](https://vercel.com) |

---

## 📂 Structure du projet

```
src/
├── app/
│   ├── page.tsx                 # Page d'accueil
│   ├── box/                     # Composition de la box
│   ├── abonnement/              # Tunnel de souscription (+ code CE, SEPA)
│   ├── ce/                      # Page comités d'entreprise
│   ├── mon-compte/              # Espace client (Supabase Auth)
│   ├── admin/                   # Espace d'administration
│   ├── mentions-legales/ · cgv/ · confidentialite/
│   └── api/
│       ├── produits/            # Catalogue public (lecture)
│       ├── ce-codes/check/      # Validation publique d'un code CE
│       ├── contact/             # Envoi des messages de contact
│       ├── abonnement/          # Création d'abonnement + e-mails
│       ├── sepa/setup-intent/   # Mandat de prélèvement Stripe
│       └── admin/               # CRUD protégés : produits, ce-codes, abonnes, prospects
├── components/                  # Navbar, Footer, SepaPaymentSection
└── lib/                         # supabase, stripe, resend, contact, data (helpers)
```

Schéma et données de la base : `supabase-setup-complet.sql`, `supabase-seed-produits.sql`, `supabase-prospects.sql`.

---

## 🚀 Démarrage

### Prérequis
- [Node.js](https://nodejs.org) 18 ou plus récent · npm

### Installation

```bash
npm install
```

### Configuration

Copiez le modèle de variables d'environnement, puis renseignez vos clés :

```bash
cp .env.local.example .env.local
```

| Variable | Rôle | Requis |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase | Oui |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique (navigateur) | Oui |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé **secrète** (routes `/api/admin/*`) | Oui (admin) |
| `STRIPE_SECRET_KEY` · `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Paiements SEPA | Oui (paiement) |
| `RESEND_API_KEY` | Envoi des e-mails | Oui (e-mails) |
| `RESEND_FROM_EMAIL` | Expéditeur personnalisé (domaine vérifié) | Optionnel |
| `RESEND_TEST_REDIRECT_EMAIL` | Redirige tous les e-mails vers une adresse de test | Optionnel |

> **Dégradation contrôlée** : sans certaines clés, le site reste fonctionnel en mode démonstration (le catalogue s'affiche depuis un jeu de données intégré, les formulaires invitent à écrire par e-mail, le paiement reste fictif). Le fichier `.env.local` est ignoré par Git : aucune clé n'est jamais publiée.

### Lancer en développement

```bash
npm run dev
```

Le site est disponible sur [http://localhost:3000](http://localhost:3000) avec rechargement automatique.

### Scripts

| Commande | Description |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Démarre le build de production |
| `npm run lint` | Analyse statique du code |

---

## ☁️ Déploiement

Le site se déploie sur **Vercel** (build automatique à chaque `push` sur `main`). Les variables d'environnement ci-dessus doivent être renseignées dans les réglages du projet Vercel.

Procédure complète (Supabase, Stripe, Resend, domaine, QR codes CE) : voir **`GUIDE_DEPLOIEMENT.pdf`**.

---

## 📚 Documentation

| Document | Destinataire |
| --- | --- |
| `SYNTHESE_PROJET.pdf` | Présentation générale du projet |
| `GUIDE_DEPLOIEMENT.pdf` | Mise en ligne (développeur / installateur) |
| `GUIDE_GERANTE.pdf` | Utilisation de l'espace admin (gérante) |
| `GUIDE_EMAILS.pdf` | Les e-mails automatiques expliqués |

---

## 📌 État du projet

- ✅ **Fonctionnalités terminées** : site vitrine, tunnel d'abonnement, espace client, espace d'administration, codes CE, e-mails automatiques, pages légales.
- ✅ **Intégrations branchées** : Supabase (base + comptes), Stripe (SEPA), Resend (e-mails).
- 🔜 **Réglages de mise en ligne** (jour du déploiement) : vérification du domaine d'envoi Resend, variables d'environnement sur Vercel, bascule des clés Stripe en production.

---

## 📄 À propos

Projet réalisé pour la **Biscuiterie Louvat**. Tous droits réservés.

export type Biscuit = {
  id: number;
  name: string;
  description: string;
  category: string;
  allergens: string[];
  price: number;
  image?: string;
  badge?: string;
  available?: boolean;
  mois_actif?: boolean;
};

export type EngagementId = "sans-engagement" | "trimestriel" | "annuel";

export type Engagement = {
  id: EngagementId;
  label: string;
  shortLabel: string;
  description: string;
  popular?: boolean;
};

export const biscuits: Biscuit[] = [
  { id: 1,  name: "Palets pur beurre",             description: "La recette originale depuis 1954, pur beurre de qualité",              category: "Classiques",      allergens: ["gluten", "lait", "œufs"],           price: 4.50, available: true, mois_actif: true,
    image: "https://biscuiterie-louvat.com/cdn/shop/files/DSC_2875_300x.jpg" },
  { id: 2,  name: "Sablés pur beurre",             description: "Fondants en bouche, fabriqués avec du beurre sélectionné",             category: "Classiques",      allergens: ["gluten", "lait"],                   price: 5.00, available: true, mois_actif: true,
    image: "https://biscuiterie-louvat.com/cdn/shop/files/f76bd299-4ee6-436a-a635-f39cb194b200_a4b4a641-39b4-4117-a326-5ab4f51a95a8_300x.jpg" },
  { id: 3,  name: "Lunettes pur beurre",           description: "Sablés en forme de lunettes, garnis de confiture",                    category: "Classiques",      allergens: ["gluten", "lait", "œufs"],           price: 5.90, available: true,  badge: "Favori", mois_actif: true,
    image: "https://biscuiterie-louvat.com/cdn/shop/files/DSC_9253_1f858edf-e60d-41e1-910d-da5450fdfebe_300x.jpg" },
  { id: 4,  name: "Financiers pur beurre",         description: "Moelleux aux amandes, beurre noisette, recette du Champion du Monde", category: "Moelleux",        allergens: ["gluten", "lait", "fruits à coque"], price: 5.50, available: true,
    image: "https://biscuiterie-louvat.com/cdn/shop/files/DSC_7454_86c665c3-860d-45f4-938b-689b762f38da_300x.jpg" },
  { id: 5,  name: "Tuiles aux amandes",            description: "Fines et croquantes, amandes effilées dorées au four",                category: "Croquants",       allergens: ["gluten", "lait", "fruits à coque"], price: 5.00, available: true,
    image: "https://biscuiterie-louvat.com/cdn/shop/files/Tuileamande_300x.jpg" },
  { id: 6,  name: "Rochers Noix de Coco",          description: "Cœur fondant, noix de coco, blanc d'œuf",                            category: "Meringues",       allergens: ["gluten", "œufs"],                   price: 3.90, available: true,
    image: "https://biscuiterie-louvat.com/cdn/shop/files/DSC_7145_19aebf24-cbef-4db7-8818-6e206c7bb82c_300x.jpg" },
  { id: 7,  name: "Meringues striées",             description: "Légères et croustillantes, fondantes au cœur",                        category: "Meringues",       allergens: ["œufs"],                             price: 3.80, available: true,
    image: "https://biscuiterie-louvat.com/cdn/shop/files/DSC_7215_e48ce015-a2c1-41cc-82e9-d89ac10f02d0_300x.jpg" },
  { id: 8,  name: "Meringues gouttes",             description: "Petites meringues en forme de goutte, à grignoter sans fin",          category: "Meringues",       allergens: ["œufs"],                             price: 4.00, available: true,
    image: "https://biscuiterie-louvat.com/cdn/shop/files/DSC_7092_fa9d4193-2745-4d35-b6b5-4cbe9f54b81a_300x.jpg" },
  { id: 9,  name: "Macarons tendres aux amandes",  description: "Recette 1954, cœur moelleux à l'amande, enrobage croquant",           category: "Macarons",        allergens: ["gluten", "fruits à coque", "œufs"], price: 5.90, available: true,
    image: "https://biscuiterie-louvat.com/cdn/shop/products/Macarontendreamande_300x.jpg" },
  { id: 10, name: "Macarons meringués coco 1954",  description: "La recette coco de la maison, inchangée depuis 1954",                 category: "Macarons",        allergens: ["œufs"],                             price: 3.90, available: true,
    image: "https://biscuiterie-louvat.com/cdn/shop/products/Macaronsmeringuescoco_300x.jpg" },
  { id: 11, name: "Palets pur beurre aux raisins", description: "Les palets classiques agrémentés de raisins dorés",                  category: "Classiques",      allergens: ["gluten", "lait", "œufs"],           price: 5.00, available: false,
    image: "https://biscuiterie-louvat.com/cdn/shop/files/DSC_7114_cb2a3a1a-e64a-4836-8690-ce579cbb1805_300x.jpg" },
  { id: 12, name: "L'Indécent — anti-gaspi",       description: "Biscuit anti-gaspi : irrégulier, délicieux, engagé",                 category: "Éco-responsable", allergens: ["gluten", "lait"],                   price: 6.00, available: true,  badge: "Bestseller",
    image: "/biscuits/indecent.webp" },
];

export const engagements: Engagement[] = [
  {
    id: "sans-engagement",
    label: "Sans engagement",
    shortLabel: "Sans engagement",
    description: "Annulation à tout moment, sans frais.",
  },
  {
    id: "trimestriel",
    label: "Engagement trimestriel",
    shortLabel: "3 mois",
    description: "Engagement de 3 mois, reconductible tacitement.",
  },
  {
    id: "annuel",
    label: "Engagement annuel",
    shortLabel: "12 mois",
    description: "Le tarif le plus avantageux, sur 12 mois.",
    popular: true,
  },
];

// La box unique mensuelle : 3 produits x 500g, curatés chaque mois par la
// gérante (voir `produits.mois_actif` côté admin). Plus de choix de taille
// ni de biscuits pour le client — même tarif que l'ancienne Box Découverte
// (identique en poids/nombre de produits, rien à recalculer).
export const BOX_PRICE: Record<EngagementId, number> = {
  annuel: 30,
  trimestriel: 35,
  "sans-engagement": 40,
};

export const BOX_POIDS_GRAMMES = 1500; // 3 produits x 500g
export const PORTION_GRAMMES_PAR_PERSONNE = 120; // portion partagée en salle de pause — ajustable

/** Estimation du nombre de personnes pour lesquelles `quantite` box conviennent (arrondi à l'inférieur, prudent). */
export function estimerPersonnes(quantite: number): number {
  return Math.floor((quantite * BOX_POIDS_GRAMMES) / PORTION_GRAMMES_PAR_PERSONNE);
}

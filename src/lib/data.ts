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
  { id: 1,  name: "Palets pur beurre",             description: "La recette originale depuis 1954, pur beurre de qualité",              category: "Classiques",      allergens: ["gluten", "lait", "œufs"],           price: 4.50, available: true,
    image: "https://biscuiterie-louvat.com/cdn/shop/files/DSC_9253_300x.jpg?v=1748338111" },
  { id: 2,  name: "Sablés pur beurre",             description: "Fondants en bouche, fabriqués avec du beurre sélectionné",             category: "Classiques",      allergens: ["gluten", "lait"],                   price: 5.00, available: true,
    image: "https://biscuiterie-louvat.com/cdn/shop/files/DSC_9253_300x.jpg?v=1748338111" },
  { id: 3,  name: "Lunettes pur beurre",           description: "Sablés en forme de lunettes, garnis de confiture",                    category: "Classiques",      allergens: ["gluten", "lait", "œufs"],           price: 5.90, available: true,  badge: "Favori",
    image: "https://biscuiterie-louvat.com/cdn/shop/files/DSC_9253_300x.jpg?v=1748338111" },
  { id: 4,  name: "Financiers pur beurre",         description: "Moelleux aux amandes, beurre noisette, recette du Champion du Monde", category: "Moelleux",        allergens: ["gluten", "lait", "fruits à coque"], price: 5.50, available: true,
    image: "https://biscuiterie-louvat.com/cdn/shop/files/DSC_1060-2_300x.jpg?v=1747385392" },
  { id: 5,  name: "Tuiles aux amandes",            description: "Fines et croquantes, amandes effilées dorées au four",                category: "Croquants",       allergens: ["gluten", "lait", "fruits à coque"], price: 5.00, available: true },
  { id: 6,  name: "Rochers Noix de Coco",          description: "Cœur fondant, noix de coco, blanc d'œuf",                            category: "Meringues",       allergens: ["gluten", "œufs"],                   price: 3.90, available: true,
    image: "https://biscuiterie-louvat.com/cdn/shop/files/Rocher_noix_de_coco_300x.jpg?v=1747385576" },
  { id: 7,  name: "Meringues striées",             description: "Légères et croustillantes, fondantes au cœur",                        category: "Meringues",       allergens: ["œufs"],                             price: 3.80, available: true },
  { id: 8,  name: "Meringues gouttes",             description: "Petites meringues en forme de goutte, à grignoter sans fin",          category: "Meringues",       allergens: ["œufs"],                             price: 4.00, available: true },
  { id: 9,  name: "Macarons tendres aux amandes",  description: "Recette 1954, cœur moelleux à l'amande, enrobage croquant",           category: "Macarons",        allergens: ["gluten", "fruits à coque", "œufs"], price: 5.90, available: true },
  { id: 10, name: "Macarons meringués coco 1954",  description: "La recette coco de la maison, inchangée depuis 1954",                 category: "Macarons",        allergens: ["œufs"],                             price: 3.90, available: true },
  { id: 11, name: "Palets pur beurre aux raisins", description: "Les palets classiques agrémentés de raisins dorés",                  category: "Classiques",      allergens: ["gluten", "lait", "œufs"],           price: 5.00, available: false },
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

export type BoxSize = {
  id: string;
  label: string;
  items: number;
  weight: string;
  description: string;
  prices: Record<EngagementId, number>;
  popular?: boolean;
};

export const boxSizes: BoxSize[] = [
  {
    id: "decouverte",
    label: "Box Découverte",
    items: 3,
    weight: "1,5 kg",
    description: "3 références au choix",
    prices: { annuel: 30, trimestriel: 35, "sans-engagement": 40 },
  },
  {
    id: "gourmande",
    label: "Box Gourmande",
    items: 6,
    weight: "3 kg",
    description: "6 références au choix",
    prices: { annuel: 65, trimestriel: 70, "sans-engagement": 75 },
    popular: true,
  },
  {
    id: "prestige",
    label: "Box Prestige",
    items: 10,
    weight: "5 kg",
    description: "10 références au choix",
    prices: { annuel: 100, trimestriel: 105, "sans-engagement": 110 },
  },
];

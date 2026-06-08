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

export type Formula = {
  id: string;
  label: string;
  price: number;
  pricePerMonth: number;
  description: string;
  popular?: boolean;
};

export const biscuits: Biscuit[] = [
  { id: 1,  name: "Palets pur beurre",             description: "La recette originale depuis 1954, pur beurre de qualité",              category: "Classiques",      allergens: ["gluten", "lait", "œufs"],           price: 4.50, available: true,  badge: "Bestseller",
    image: "https://biscuiterie-louvat.com/cdn/shop/files/DSC_9253_300x.jpg?v=1748338111" },
  { id: 2,  name: "Sablés pur beurre",             description: "Fondants en bouche, fabriqués avec du beurre sélectionné",             category: "Classiques",      allergens: ["gluten", "lait"],                   price: 5.00, available: true,
    image: "https://biscuiterie-louvat.com/cdn/shop/files/DSC_9253_300x.jpg?v=1748338111" },
  { id: 3,  name: "Lunettes pur beurre",           description: "Sablés en forme de lunettes, garnis de confiture",                    category: "Classiques",      allergens: ["gluten", "lait", "œufs"],           price: 5.90, available: true,  badge: "Favori",
    image: "https://biscuiterie-louvat.com/cdn/shop/files/DSC_9253_300x.jpg?v=1748338111" },
  { id: 4,  name: "Financiers pur beurre",         description: "Moelleux aux amandes, beurre noisette, recette du Champion du Monde", category: "Moelleux",        allergens: ["gluten", "lait", "fruits à coque"], price: 5.50, available: true,
    image: "https://biscuiterie-louvat.com/cdn/shop/files/DSC_1060-2_300x.jpg?v=1747385392" },
  { id: 5,  name: "Tuiles aux amandes",            description: "Fines et croquantes, amandes effilées dorées au four",                category: "Croquants",       allergens: ["gluten", "lait", "fruits à coque"], price: 5.00, available: true },
  { id: 6,  name: "Rochers Noix de Coco",          description: "Cœur fondant, noix de coco, blanc d'œuf — sans gluten",              category: "Sans gluten",     allergens: ["œufs"],                             price: 3.90, available: true,
    image: "https://biscuiterie-louvat.com/cdn/shop/files/Rocher_noix_de_coco_300x.jpg?v=1747385576" },
  { id: 7,  name: "Meringues striées",             description: "Légères et croustillantes, fondantes au cœur",                        category: "Meringues",       allergens: ["œufs"],                             price: 3.80, available: true },
  { id: 8,  name: "Meringues gouttes",             description: "Petites meringues en forme de goutte, à grignoter sans fin",          category: "Meringues",       allergens: ["œufs"],                             price: 4.00, available: true },
  { id: 9,  name: "Macarons tendres aux amandes",  description: "Recette 1954, cœur moelleux à l'amande, enrobage croquant",           category: "Macarons",        allergens: ["gluten", "fruits à coque", "œufs"], price: 5.90, available: true },
  { id: 10, name: "Macarons meringués coco 1954",  description: "La recette coco de la maison, inchangée depuis 1954",                 category: "Macarons",        allergens: ["œufs"],                             price: 3.90, available: true },
  { id: 11, name: "Palets pur beurre aux raisins", description: "Les palets classiques agrémentés de raisins dorés",                  category: "Classiques",      allergens: ["gluten", "lait", "œufs"],           price: 5.00, available: false },
  { id: 12, name: "L'Indécent — anti-gaspi",       description: "Biscuit anti-gaspi : irrégulier, délicieux, engagé",                 category: "Éco-responsable", allergens: ["gluten", "lait"],                   price: 6.00, available: true,  badge: "Nouveau",
    image: "https://biscuiterie-louvat.com/cdn/shop/products/DSC_2888_300x.jpg?v=1759738828" },
];

export const formulas: Formula[] = [
  {
    id: "mensuel",
    label: "Mensuel",
    price: 25,
    pricePerMonth: 25,
    description: "Une box livrée chaque mois. Résiliable à tout moment.",
  },
  {
    id: "trimestriel",
    label: "Trimestriel",
    price: 65,
    pricePerMonth: 21.67,
    description: "Une box tous les 3 mois. Économisez 10% vs mensuel.",
    popular: true,
  },
];

export type BoxSize = {
  id: string;
  label: string;
  items: number;
  description: string;
  priceAdd: number;
};

export const boxSizes: BoxSize[] = [
  { id: "decouverte", label: "Box Découverte", items: 4, description: "4 références au choix",  priceAdd: 0  },
  { id: "gourmande",  label: "Box Gourmande",  items: 7, description: "7 références au choix",  priceAdd: 8  },
  { id: "prestige",   label: "Box Prestige",   items: 10, description: "10 références au choix", priceAdd: 18 },
];

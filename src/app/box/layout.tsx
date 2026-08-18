import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'La box du mois — Louvat Box',
  description: "Découvrez les 3 produits (500g chacun) sélectionnés ce mois-ci par la Biscuiterie Louvat, pour les entreprises et les salarié·es via un code CE.",
};

export default function BoxLayout({ children }: { children: React.ReactNode }) {
  return children;
}

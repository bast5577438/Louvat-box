import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Louvat Box pour les entreprises',
  description: "Commandez la box du mois pour votre salle de pause : quantité libre, estimation du nombre de personnes servies, prélèvement SEPA.",
};

export default function EntrepriseLayout({ children }: { children: React.ReactNode }) {
  return children;
}

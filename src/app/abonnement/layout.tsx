import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mon abonnement — code CE — Louvat Box',
  description: "Abonnez-vous à la box du mois avec votre code Comité d'Entreprise : 10% offerts par Louvat, le reste pris en charge par votre employeur.",
};

export default function AbonnementLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Comité d'Entreprise — Louvat Box",
  description: "Offrez à vos salarié·es la box de biscuits Louvat avec un financement partagé : 10% offerts par Louvat, le reste réparti entre l'employeur et le salarié.",
};

export default function CeLayout({ children }: { children: React.ReactNode }) {
  return children;
}

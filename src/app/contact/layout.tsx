import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — Louvat Box',
  description: 'Une question sur la box du mois, votre entreprise ou votre code CE ? Contactez la Biscuiterie Louvat.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

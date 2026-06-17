import Link from 'next/link';
import Image from 'next/image';
import { Mail } from 'lucide-react';

const iconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#3E4743] text-[#F3E4CD] mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="mb-3">
            <Image
              src="/logo-louvat.png"
              alt="Biscuiterie Louvat"
              width={140}
              height={63}
              className="brightness-0 invert"
            />
          </div>
          <p className="text-sm text-[#E3D4BD] leading-relaxed">
            Maison de qualité depuis 1954. Biscuits pur beurre artisanaux, fabriqués au pied des Alpes.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="https://www.instagram.com/biscuiterie_louvat_1954/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-[#F48F98] transition-colors"><InstagramIcon className="w-5 h-5" /></a>
            <a href="https://www.facebook.com/biscuiterielouvat1954" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-[#F48F98] transition-colors"><FacebookIcon className="w-5 h-5" /></a>
            <Link href="/contact" aria-label="Contact" className="hover:text-[#F48F98] transition-colors"><Mail className="w-5 h-5" /></Link>
          </div>
        </div>

        {/* La Box */}
        <div>
          <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">La Box</h4>
          <ul className="space-y-2 text-sm text-[#E3D4BD]">
            <li><Link href="/box" className="hover:text-[#F48F98] transition-colors">Nos biscuits</Link></li>
            <li><Link href="/abonnement" className="hover:text-[#F48F98] transition-colors">Formules & tarifs</Link></li>
            <li><Link href="/abonnement" className="hover:text-[#F48F98] transition-colors">Comment ça marche</Link></li>
          </ul>
        </div>

        {/* Entreprises */}
        <div>
          <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Entreprises</h4>
          <ul className="space-y-2 text-sm text-[#E3D4BD]">
            <li><Link href="/ce" className="hover:text-[#F48F98] transition-colors">Comité d&apos;Entreprise</Link></li>
            <li><Link href="/ce#comment" className="hover:text-[#F48F98] transition-colors">Le système de financement</Link></li>
            <li><Link href="/ce#inscription" className="hover:text-[#F48F98] transition-colors">Inscrire mon CE</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Contact</h4>
          <ul className="space-y-2 text-sm text-[#E3D4BD]">
            <li><Link href="/mon-compte" className="hover:text-[#F48F98] transition-colors">Mon espace abonné</Link></li>
            <li><Link href="/contact" className="hover:text-[#F48F98] transition-colors">Nous contacter</Link></li>
            <li className="pt-1">
              <span className="block font-medium text-white/90">Biscuiterie &amp; magasin usine</span>
              452 Route de Chartreuse, 38620 Saint-Geoire-en-Valdaine
            </li>
            <li>
              <span className="block font-medium text-white/90">Boutique</span>
              8 avenue Raymond Tezier, 38500 Voiron
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#5C3D2E] py-4 text-center text-xs text-[#8A8E89]">
        © {new Date().getFullYear()} Louvat Biscuiterie. Tous droits réservés.
        &nbsp;·&nbsp;
        <Link href="/mentions-legales" className="hover:text-[#F48F98]">Mentions légales</Link>
        &nbsp;·&nbsp;
        <Link href="/cgv" className="hover:text-[#F48F98]">CGV</Link>
        &nbsp;·&nbsp;
        <Link href="/confidentialite" className="hover:text-[#F48F98]">Confidentialité</Link>
      </div>
    </footer>
  );
}

import Link from 'next/link';
import { Cookie, Share2, Heart, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#3D2B1F] text-[#F5E6D3] mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <Cookie className="w-5 h-5 text-[#F4A460]" />
            <span className="font-bold text-lg text-white" style={{ fontFamily: 'Georgia, serif' }}>Louvat</span>
          </div>
          <p className="text-sm text-[#D2B48C] leading-relaxed">
            Maison de qualité depuis 1954. Biscuits pur beurre artisanaux, fabriqués à Saint-Geoire-en-Valdaine (38620).
          </p>
          <div className="flex gap-3 mt-4">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-[#F4A460] transition-colors"><Heart className="w-5 h-5" /></a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-[#F4A460] transition-colors"><Share2 className="w-5 h-5" /></a>
            <Link href="/contact" aria-label="Contact" className="hover:text-[#F4A460] transition-colors"><Mail className="w-5 h-5" /></Link>
          </div>
        </div>

        {/* La Box */}
        <div>
          <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">La Box</h4>
          <ul className="space-y-2 text-sm text-[#D2B48C]">
            <li><Link href="/box" className="hover:text-[#F4A460] transition-colors">Nos biscuits</Link></li>
            <li><Link href="/abonnement" className="hover:text-[#F4A460] transition-colors">Formules & tarifs</Link></li>
            <li><Link href="/abonnement" className="hover:text-[#F4A460] transition-colors">Comment ça marche</Link></li>
          </ul>
        </div>

        {/* Entreprises */}
        <div>
          <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Entreprises</h4>
          <ul className="space-y-2 text-sm text-[#D2B48C]">
            <li><Link href="/ce" className="hover:text-[#F4A460] transition-colors">Comité d&apos;Entreprise</Link></li>
            <li><Link href="/ce#comment" className="hover:text-[#F4A460] transition-colors">Le système de financement</Link></li>
            <li><Link href="/ce#inscription" className="hover:text-[#F4A460] transition-colors">Inscrire mon CE</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Contact</h4>
          <ul className="space-y-2 text-sm text-[#D2B48C]">
            <li><Link href="/mon-compte" className="hover:text-[#F4A460] transition-colors">Mon espace abonné</Link></li>
            <li><Link href="/contact" className="hover:text-[#F4A460] transition-colors">Nous contacter</Link></li>
            <li className="text-[#D2B48C]">Saint-Geoire-en-Valdaine, 38620</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#5C3D2E] py-4 text-center text-xs text-[#A0856B]">
        © {new Date().getFullYear()} Louvat Biscuiterie. Tous droits réservés.
        &nbsp;·&nbsp;
        <Link href="/mentions-legales" className="hover:text-[#F4A460]">Mentions légales</Link>
        &nbsp;·&nbsp;
        <Link href="/cgv" className="hover:text-[#F4A460]">CGV</Link>
        &nbsp;·&nbsp;
        <Link href="/confidentialite" className="hover:text-[#F4A460]">Confidentialité</Link>
      </div>
    </footer>
  );
}

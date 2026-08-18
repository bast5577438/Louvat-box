'use client';

import Link from 'next/link';
import Image from 'next/image';
import { User } from 'lucide-react';

export default function Navbar() {
  return (
    <div className="sticky top-0 z-50">
      {/* Bandeau annonce, gris charbon comme le site principal */}
      <div className="bg-[#3A3A3A] text-[#F3E4CD] text-center text-xs sm:text-sm py-2 px-4">
        La box du mois : 3 produits artisanaux, chaque mois — pour les entreprises et via votre comité d&apos;entreprise
      </div>

      {/* Nav — logo seul, centré, comme sur le site principal */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center">
          <div className="flex-1" />
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-louvat.png"
              alt="Biscuiterie Louvat"
              width={150}
              height={68}
              priority
            />
          </Link>
          <div className="flex-1 flex justify-end">
            <Link
              href="/mon-compte"
              className="text-xs sm:text-sm text-[#3A3A3A] hover:text-[#C1793F] transition-colors flex items-center gap-1.5 font-medium uppercase tracking-wide"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Mon espace</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

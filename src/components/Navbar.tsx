'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { Menu, X, ShoppingBag } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/box', label: 'La Box' },
    { href: '/abonnement', label: "S'abonner" },
    { href: '/ce', label: "Comité d'Entreprise" },
    { href: '/mon-compte', label: 'Mon Compte' },
  ];

  return (
    <nav className="bg-[#3D2B1F] text-[#FFF8F0] sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo réel Louvat */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="https://biscuiterie-louvat.com/cdn/shop/files/logo_Louvat_gris_446C_800x.png?v=1614330419"
            alt="Biscuiterie Louvat"
            width={110}
            height={40}
            className="brightness-0 invert"
            unoptimized
          />
          <span className="text-[#F4A460] text-xs font-medium hidden sm:block">· La Box</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.slice(0, 3).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm hover:text-[#F4A460] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTA + account */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/mon-compte" className="text-sm hover:text-[#F4A460] transition-colors flex items-center gap-1">
            <ShoppingBag className="w-4 h-4" />
            Mon compte
          </Link>
          <Link
            href="/abonnement"
            className="bg-[#F4A460] text-[#3D2B1F] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#D2691E] hover:text-white transition-all"
          >
            Je m&apos;abonne
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#2C1F14] px-4 pb-4 flex flex-col gap-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="py-2 text-sm hover:text-[#F4A460] transition-colors border-b border-[#3D2B1F]"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/abonnement"
            className="mt-2 bg-[#F4A460] text-[#3D2B1F] px-4 py-3 rounded-full text-sm font-semibold text-center"
            onClick={() => setOpen(false)}
          >
            Je m&apos;abonne
          </Link>
        </div>
      )}
    </nav>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, Gift, Info, Megaphone, Users } from 'lucide-react';
import { type Biscuit } from '@/lib/data';
import Reveal from '@/components/Reveal';

export default function BoxPage() {
  const [biscuits, setBiscuits] = useState<Biscuit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/produits')
      .then((res) => res.json())
      .then((data) => {
        const produits: Biscuit[] = (data.produits ?? []).filter((p: Biscuit) => p.mois_actif);
        setBiscuits(produits);
      })
      .catch(() => setBiscuits([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#FBF4E9] min-h-screen">
      {/* Header */}
      <div className="bg-[#3E4743] text-white py-12 text-center">
        <h1 className="text-4xl font-bold mb-2">
          La box du mois
        </h1>
        <p className="text-[#E3D4BD]">
          Chaque mois, notre gérante sélectionne avec soin 3 produits (500g chacun), identiques pour tous.
        </p>
      </div>

      {/* Le 1er mois, en plus des produits */}
      <div className="bg-[#F6EBDB] border-b border-[#F48F98]/30">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-center text-sm text-[#5C6B65]">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#E0727C] flex-shrink-0" />
            <span>Le <strong>1er mois</strong>, vous recevez aussi une boîte et un mini plateau vintage Louvat</span>
          </div>
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#E0727C] flex-shrink-0" />
            <span>+ un support de communication Louvat</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {loading && <p className="text-[#8A8E89] text-sm mb-4 text-center">Chargement de la box du mois…</p>}

        {!loading && biscuits.length === 0 && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-8">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>La sélection du mois n&apos;a pas encore été publiée. Revenez bientôt !</span>
          </div>
        )}

        {biscuits.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {biscuits.map((b, i) => (
              <Reveal key={b.id} delay={i as 0 | 1 | 2} className="block h-full">
              <div className="group bg-white rounded-2xl p-5 border-2 border-[#F3E4CD] shadow-sm text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full">
                {b.badge && (
                  <span className="inline-block bg-[#F48F98] text-[#3E4743] text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                    {b.badge}
                  </span>
                )}
                {b.image ? (
                  <div className="overflow-hidden rounded-xl mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={b.image} alt={b.name} className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                ) : (
                  <div className="text-4xl mb-3">🍪</div>
                )}
                <h3 className="font-bold text-[#3E4743] mb-1">{b.name}</h3>
                <p className="text-[#8A8E89] text-sm mb-1">{b.description}</p>
                <p className="text-[#B8AE9C] text-xs">500g</p>
              </div>
              </Reveal>
            ))}
          </div>
        )}

        {/* Allergènes note */}
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-10">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>Certains produits contiennent des allergènes (gluten, lait, fruits à coque, œufs). Consultez les fiches produits pour plus d&apos;informations.</span>
        </div>

        {/* Deux tunnels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border-2 border-[#F3E4CD] p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <Building2 className="w-8 h-8 text-[#5C6B65] mb-3" />
            <h3 className="font-bold text-[#3E4743] text-lg mb-2">Je suis une entreprise</h3>
            <p className="text-[#5C6B65] text-sm mb-4 flex-1">
              Commandez plusieurs box du mois pour votre salle de pause. Quantité libre, estimation du nombre de
              personnes servies.
            </p>
            <Link href="/entreprise" className="inline-flex items-center justify-center gap-2 bg-[#3E4743] text-white py-3 rounded-full font-semibold hover:bg-[#5C6B65] transition-all">
              Voir l&apos;offre entreprises <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="bg-white rounded-2xl border-2 border-[#F3E4CD] p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <Users className="w-8 h-8 text-[#5C6B65] mb-3" />
            <h3 className="font-bold text-[#3E4743] text-lg mb-2">Je suis salarié·e avec un code CE</h3>
            <p className="text-[#5C6B65] text-sm mb-4 flex-1">
              Votre entreprise partenaire vous fait bénéficier d&apos;une remise sur la box du mois : 10% offerts
              par Louvat, le reste pris en charge par votre employeur.
            </p>
            <Link href="/abonnement" className="inline-flex items-center justify-center gap-2 bg-[#5C6B65] text-white py-3 rounded-full font-semibold hover:bg-[#3E4743] transition-all">
              M&apos;abonner avec mon code CE <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

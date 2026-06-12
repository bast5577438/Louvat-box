'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Plus, Minus, ArrowRight, Info, Gift, Megaphone } from 'lucide-react';
import { boxSizes, type Biscuit } from '@/lib/data';

export default function BoxPage() {
  const [biscuits, setBiscuits] = useState<Biscuit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [activeSize, setActiveSize] = useState(boxSizes[0]);

  useEffect(() => {
    fetch('/api/produits')
      .then((res) => res.json())
      .then((data) => {
        const produits: Biscuit[] = (data.produits ?? []).filter((p: Biscuit) => p.available !== false);
        setBiscuits(produits);
      })
      .catch(() => setBiscuits([]))
      .finally(() => setLoading(false));
  }, []);

  const CATEGORIES = ['Tous', ...Array.from(new Set(biscuits.map((b) => b.category)))];

  const totalSelected = Object.values(selected).reduce((a, b) => a + b, 0);
  const maxItems = activeSize.items;

  const filtered = activeCategory === 'Tous' ? biscuits : biscuits.filter((b) => b.category === activeCategory);

  function add(b: Biscuit) {
    if (totalSelected >= maxItems) return;
    setSelected((prev) => ({ ...prev, [b.id]: (prev[b.id] ?? 0) + 1 }));
  }

  function remove(b: Biscuit) {
    setSelected((prev) => {
      const val = (prev[b.id] ?? 0) - 1;
      if (val <= 0) {
        const next = { ...prev };
        delete next[b.id];
        return next;
      }
      return { ...prev, [b.id]: val };
    });
  }

  function clearAll() {
    setSelected({});
  }

  const selectionParam = Object.entries(selected)
    .map(([id, qty]) => `${id}x${qty}`)
    .join(',');

  return (
    <div className="bg-[#FBF4E9] min-h-screen">
      {/* Header */}
      <div className="bg-[#3E4743] text-white py-12 text-center">
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>
          Composez votre box
        </h1>
        <p className="text-[#E3D4BD]">Sélectionnez vos biscuits préférés parmi notre gamme artisanale</p>
      </div>

      {/* Le 1er mois, en plus de vos biscuits */}
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Taille de box */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-[#3E4743] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            1. Choisissez la taille de votre box
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {boxSizes.map((size) => (
              <button
                key={size.id}
                onClick={() => { setActiveSize(size); clearAll(); }}
                className={`p-5 rounded-2xl border-2 text-left transition-all ${activeSize.id === size.id ? 'border-[#5C6B65] bg-[#F3E4CD]' : 'border-[#F3E4CD] bg-white hover:border-[#E0727C]'}`}
              >
                <div className="font-bold text-[#3E4743] mb-1" style={{ fontFamily: 'Georgia, serif' }}>{size.label}</div>
                <div className="text-[#5C6B65] text-sm">{size.description} · {size.weight}</div>
                <div className="text-xs text-[#8A8E89] mt-1">à partir de {size.prices.annuel}€ HT/mois</div>
              </button>
            ))}
          </div>
        </div>

        {/* Filtres catégories */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#3E4743] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            2. Choisissez vos {maxItems} biscuits
          </h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-[#5C6B65] text-white' : 'bg-white text-[#5C6B65] border border-[#E3D4BD] hover:bg-[#F3E4CD]'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Grille biscuits */}
          <div className="flex-1">
            {loading && (
              <p className="text-[#8A8E89] text-sm mb-4">Chargement du catalogue…</p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filtered.map((b) => {
                const qty = selected[b.id] ?? 0;
                const full = totalSelected >= maxItems && qty === 0;

                return (
                  <div
                    key={b.id}
                    className={`bg-white rounded-2xl p-4 border-2 transition-all ${qty > 0 ? 'border-[#5C6B65] shadow-md' : full ? 'border-[#F3E4CD] opacity-50' : 'border-[#F3E4CD] hover:border-[#E3D4BD]'}`}
                  >
                    {b.badge && (
                      <span className="inline-block bg-[#F48F98] text-[#3E4743] text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                        {b.badge}
                      </span>
                    )}
                    {b.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={b.image} alt={b.name} className="w-full h-20 object-cover rounded-xl mb-2" />
                    ) : (
                      <div className="text-3xl mb-2">🍪</div>
                    )}
                    <h4 className="font-bold text-[#3E4743] text-sm mb-1" style={{ fontFamily: 'Georgia, serif' }}>{b.name}</h4>
                    <p className="text-[#8A8E89] text-xs mb-1">{b.description}</p>
                    <p className="text-[#B8AE9C] text-xs mb-3 capitalize">{b.category}</p>

                    {qty === 0 ? (
                      <button
                        onClick={() => add(b)}
                        disabled={full}
                        className={`w-full py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1 ${full ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#F3E4CD] text-[#5C6B65] hover:bg-[#5C6B65] hover:text-white'}`}
                      >
                        <Plus className="w-4 h-4" /> Ajouter
                      </button>
                    ) : (
                      <div className="flex items-center justify-between">
                        <button onClick={() => remove(b)} className="w-8 h-8 rounded-full bg-[#F3E4CD] text-[#5C6B65] flex items-center justify-center hover:bg-[#5C6B65] hover:text-white transition-all">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-[#3E4743] text-lg">{qty}</span>
                        <button
                          onClick={() => add(b)}
                          disabled={totalSelected >= maxItems}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${totalSelected >= maxItems ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#5C6B65] text-white hover:bg-[#3E4743]'}`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Allergènes note */}
            <div className="mt-6 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Certains biscuits contiennent des allergènes (gluten, lait, fruits à coque, œufs). Consultez les fiches produits pour plus d&apos;informations.</span>
            </div>
          </div>

          {/* Récapitulatif sticky */}
          <div className="lg:w-72">
            <div className="sticky top-20 bg-white rounded-2xl border-2 border-[#F3E4CD] p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="w-5 h-5 text-[#5C6B65]" />
                <h3 className="font-bold text-[#3E4743]" style={{ fontFamily: 'Georgia, serif' }}>Ma sélection</h3>
              </div>

              {/* Progression */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#5C6B65]">{totalSelected} / {maxItems} biscuits</span>
                  {totalSelected === maxItems && <span className="text-green-600 font-semibold">Complet ✓</span>}
                </div>
                <div className="w-full bg-[#F3E4CD] rounded-full h-3">
                  <div
                    className="bg-[#5C6B65] h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(totalSelected / maxItems) * 100}%` }}
                  />
                </div>
              </div>

              {/* Liste */}
              {Object.keys(selected).length === 0 ? (
                <p className="text-[#8A8E89] text-sm text-center py-4">Ajoutez des biscuits depuis le catalogue</p>
              ) : (
                <ul className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  {Object.entries(selected).map(([id, qty]) => {
                    const b = biscuits.find((b) => b.id === Number(id))!;
                    return (
                      <li key={id} className="flex items-center justify-between text-sm">
                        <span className="text-[#3E4743] font-medium truncate flex-1 mr-2">{b.name}</span>
                        <span className="text-[#5C6B65] font-bold bg-[#F3E4CD] px-2 py-0.5 rounded-full text-xs">×{qty}</span>
                      </li>
                    );
                  })}
                </ul>
              )}

              {Object.keys(selected).length > 0 && (
                <button onClick={clearAll} className="w-full text-xs text-[#8A8E89] hover:text-red-500 mb-3 transition-colors">
                  Vider la sélection
                </button>
              )}

              <Link
                href={totalSelected > 0 ? `/abonnement?selection=${selectionParam}&taille=${activeSize.id}` : '#'}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-full font-semibold text-sm transition-all ${totalSelected > 0 ? 'bg-[#3E4743] text-white hover:bg-[#5C6B65]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                onClick={(e) => totalSelected === 0 && e.preventDefault()}
              >
                Continuer <ArrowRight className="w-4 h-4" />
              </Link>

              {totalSelected > 0 && totalSelected < maxItems && (
                <p className="text-xs text-center text-[#8A8E89] mt-2">
                  Encore {maxItems - totalSelected} biscuit{maxItems - totalSelected > 1 ? 's' : ''} à choisir
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

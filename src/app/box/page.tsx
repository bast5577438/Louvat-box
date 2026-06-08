'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Plus, Minus, ArrowRight, Info } from 'lucide-react';
import { biscuits, boxSizes, type Biscuit } from '@/lib/data';

const CATEGORIES = ['Tous', ...Array.from(new Set(biscuits.map((b) => b.category)))];

export default function BoxPage() {
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [activeSize, setActiveSize] = useState(boxSizes[0]);

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
    <div className="bg-[#FFF8F0] min-h-screen">
      {/* Header */}
      <div className="bg-[#3D2B1F] text-white py-12 text-center">
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>
          Composez votre box
        </h1>
        <p className="text-[#D2B48C]">Sélectionnez vos biscuits préférés parmi notre gamme artisanale</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Taille de box */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-[#3D2B1F] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            1. Choisissez la taille de votre box
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {boxSizes.map((size) => (
              <button
                key={size.id}
                onClick={() => { setActiveSize(size); clearAll(); }}
                className={`p-5 rounded-2xl border-2 text-left transition-all ${activeSize.id === size.id ? 'border-[#8B4513] bg-[#F5E6D3]' : 'border-[#F5E6D3] bg-white hover:border-[#D2691E]'}`}
              >
                <div className="font-bold text-[#3D2B1F] mb-1" style={{ fontFamily: 'Georgia, serif' }}>{size.label}</div>
                <div className="text-[#8B4513] text-sm">{size.description}</div>
                {size.priceAdd > 0 && (
                  <div className="text-xs text-[#A0856B] mt-1">+{size.priceAdd}€/mois</div>
                )}
                {size.priceAdd === 0 && (
                  <div className="text-xs text-green-700 mt-1 font-semibold">Inclus</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Filtres catégories */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#3D2B1F] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            2. Choisissez vos {maxItems} biscuits
          </h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-[#8B4513] text-white' : 'bg-white text-[#8B4513] border border-[#D2B48C] hover:bg-[#F5E6D3]'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Grille biscuits */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filtered.map((b) => {
                const qty = selected[b.id] ?? 0;
                const full = totalSelected >= maxItems && qty === 0;

                return (
                  <div
                    key={b.id}
                    className={`bg-white rounded-2xl p-4 border-2 transition-all ${qty > 0 ? 'border-[#8B4513] shadow-md' : full ? 'border-[#F5E6D3] opacity-50' : 'border-[#F5E6D3] hover:border-[#D2B48C]'}`}
                  >
                    {b.badge && (
                      <span className="inline-block bg-[#F4A460] text-[#3D2B1F] text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                        {b.badge}
                      </span>
                    )}
                    <div className="text-3xl mb-2">🍪</div>
                    <h4 className="font-bold text-[#3D2B1F] text-sm mb-1" style={{ fontFamily: 'Georgia, serif' }}>{b.name}</h4>
                    <p className="text-[#A0856B] text-xs mb-1">{b.description}</p>
                    <p className="text-[#C8A882] text-xs mb-3 capitalize">{b.category}</p>

                    {qty === 0 ? (
                      <button
                        onClick={() => add(b)}
                        disabled={full}
                        className={`w-full py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1 ${full ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#F5E6D3] text-[#8B4513] hover:bg-[#8B4513] hover:text-white'}`}
                      >
                        <Plus className="w-4 h-4" /> Ajouter
                      </button>
                    ) : (
                      <div className="flex items-center justify-between">
                        <button onClick={() => remove(b)} className="w-8 h-8 rounded-full bg-[#F5E6D3] text-[#8B4513] flex items-center justify-center hover:bg-[#8B4513] hover:text-white transition-all">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-[#3D2B1F] text-lg">{qty}</span>
                        <button
                          onClick={() => add(b)}
                          disabled={totalSelected >= maxItems}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${totalSelected >= maxItems ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#8B4513] text-white hover:bg-[#3D2B1F]'}`}
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
            <div className="sticky top-20 bg-white rounded-2xl border-2 border-[#F5E6D3] p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="w-5 h-5 text-[#8B4513]" />
                <h3 className="font-bold text-[#3D2B1F]" style={{ fontFamily: 'Georgia, serif' }}>Ma sélection</h3>
              </div>

              {/* Progression */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#8B4513]">{totalSelected} / {maxItems} biscuits</span>
                  {totalSelected === maxItems && <span className="text-green-600 font-semibold">Complet ✓</span>}
                </div>
                <div className="w-full bg-[#F5E6D3] rounded-full h-3">
                  <div
                    className="bg-[#8B4513] h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(totalSelected / maxItems) * 100}%` }}
                  />
                </div>
              </div>

              {/* Liste */}
              {Object.keys(selected).length === 0 ? (
                <p className="text-[#A0856B] text-sm text-center py-4">Ajoutez des biscuits depuis le catalogue</p>
              ) : (
                <ul className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  {Object.entries(selected).map(([id, qty]) => {
                    const b = biscuits.find((b) => b.id === Number(id))!;
                    return (
                      <li key={id} className="flex items-center justify-between text-sm">
                        <span className="text-[#3D2B1F] font-medium truncate flex-1 mr-2">{b.name}</span>
                        <span className="text-[#8B4513] font-bold bg-[#F5E6D3] px-2 py-0.5 rounded-full text-xs">×{qty}</span>
                      </li>
                    );
                  })}
                </ul>
              )}

              {Object.keys(selected).length > 0 && (
                <button onClick={clearAll} className="w-full text-xs text-[#A0856B] hover:text-red-500 mb-3 transition-colors">
                  Vider la sélection
                </button>
              )}

              <Link
                href={totalSelected > 0 ? `/abonnement?selection=${selectionParam}&taille=${activeSize.id}` : '#'}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-full font-semibold text-sm transition-all ${totalSelected > 0 ? 'bg-[#3D2B1F] text-white hover:bg-[#8B4513]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                onClick={(e) => totalSelected === 0 && e.preventDefault()}
              >
                Continuer <ArrowRight className="w-4 h-4" />
              </Link>

              {totalSelected > 0 && totalSelected < maxItems && (
                <p className="text-xs text-center text-[#A0856B] mt-2">
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

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, Pencil, Pause, X, ChevronRight, Truck, CheckCircle, Calendar } from 'lucide-react';
import { biscuits } from '@/lib/data';

const MOCK_SUBSCRIPTION = {
  formule: 'Trimestriel',
  boxLabel: 'Box Gourmande',
  prix: 19.50,
  prochainPrelevement: '2026-06-15',
  prochaineLivraison: '2026-06-18',
  statut: 'actif' as 'actif' | 'pause' | 'resilie',
  selections: [1, 2, 4, 7, 9, 3, 8, 5],
  historique: [
    { date: '2026-03-18', statut: 'livré', prix: 19.50 },
    { date: '2025-12-18', statut: 'livré', prix: 19.50 },
    { date: '2025-09-18', statut: 'livré', prix: 19.50 },
  ],
};

export default function MonComptePage() {
  const [tab, setTab] = useState<'abonnement' | 'selection' | 'historique'>('abonnement');
  const [statut, setStatut] = useState(MOCK_SUBSCRIPTION.statut);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const myBiscuits = MOCK_SUBSCRIPTION.selections.map((id) => biscuits.find((b) => b.id === id)!);

  const tabs = [
    { id: 'abonnement', label: 'Mon abonnement' },
    { id: 'selection', label: 'Mes biscuits' },
    { id: 'historique', label: 'Historique' },
  ] as const;

  if (cancelled) {
    return (
      <div className="bg-[#FFF8F0] min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="text-5xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-[#3D2B1F] mb-3" style={{ fontFamily: 'Georgia, serif' }}>Abonnement résilié</h2>
          <p className="text-[#8B4513] mb-6">Votre abonnement a bien été résilié. Vous pouvez vous réabonner à tout moment.</p>
          <Link href="/abonnement" className="bg-[#8B4513] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#3D2B1F] transition-all">
            Me réabonner
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF8F0] min-h-screen">
      {/* Header */}
      <div className="bg-[#3D2B1F] text-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#8B4513] rounded-full flex items-center justify-center text-2xl">
              🍪
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Bonjour, Marie !</h1>
              <p className="text-[#D2B48C] text-sm">marie@exemple.fr · Abonnée depuis mars 2025</p>
            </div>
            <div className="ml-auto">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${statut === 'actif' ? 'bg-green-700 text-green-100' : statut === 'pause' ? 'bg-yellow-700 text-yellow-100' : 'bg-red-800 text-red-100'}`}>
                {statut === 'actif' ? '● Actif' : statut === 'pause' ? '⏸ En pause' : '✕ Résilié'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-[#F5E6D3]">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all ${tab === t.id ? 'border-[#8B4513] text-[#8B4513]' : 'border-transparent text-[#A0856B] hover:text-[#8B4513]'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Onglet Abonnement */}
        {tab === 'abonnement' && (
          <div className="space-y-6">
            {/* Statut */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: <Package className="w-5 h-5" />, label: 'Formule', val: MOCK_SUBSCRIPTION.formule },
                { icon: <Truck className="w-5 h-5" />, label: 'Prochaine livraison', val: new Date(MOCK_SUBSCRIPTION.prochaineLivraison).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) },
                { icon: <Calendar className="w-5 h-5" />, label: 'Prochain prélèvement', val: `${MOCK_SUBSCRIPTION.prix.toFixed(2)}€ le ${new Date(MOCK_SUBSCRIPTION.prochainPrelevement).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}` },
              ].map((card) => (
                <div key={card.label} className="bg-white rounded-2xl p-5 border border-[#F5E6D3] shadow-sm">
                  <div className="flex items-center gap-2 text-[#8B4513] mb-2">{card.icon}<span className="text-xs uppercase tracking-wider font-semibold">{card.label}</span></div>
                  <div className="font-bold text-[#3D2B1F]">{card.val}</div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl border border-[#F5E6D3] p-6 shadow-sm">
              <h3 className="font-bold text-[#3D2B1F] mb-4" style={{ fontFamily: 'Georgia, serif' }}>Gérer mon abonnement</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setTab('selection')}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-[#F5E6D3] hover:bg-[#EDD5B8] transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <Pencil className="w-4 h-4 text-[#8B4513]" />
                    <div>
                      <div className="font-semibold text-[#3D2B1F] text-sm">Modifier ma sélection</div>
                      <div className="text-xs text-[#A0856B]">Changer les biscuits de ma prochaine box</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8B4513]" />
                </button>

                {statut === 'actif' ? (
                  <button
                    onClick={() => setStatut('pause')}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Pause className="w-4 h-4 text-yellow-700" />
                      <div>
                        <div className="font-semibold text-yellow-800 text-sm">Mettre en pause</div>
                        <div className="text-xs text-yellow-600">Suspendre temporairement les livraisons</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-yellow-700" />
                  </button>
                ) : statut === 'pause' ? (
                  <button
                    onClick={() => setStatut('actif')}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-green-50 border border-green-200 hover:bg-green-100 transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-700" />
                      <div>
                        <div className="font-semibold text-green-800 text-sm">Reprendre l&apos;abonnement</div>
                        <div className="text-xs text-green-600">Réactiver mes livraisons</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-green-700" />
                  </button>
                ) : null}

                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-100 hover:bg-red-100 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <X className="w-4 h-4 text-red-600" />
                    <div>
                      <div className="font-semibold text-red-700 text-sm">Résilier l&apos;abonnement</div>
                      <div className="text-xs text-red-400">Sans frais, effectif immédiatement</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>

            {/* Confirm résiliation */}
            {showCancelConfirm && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                <h4 className="font-bold text-red-800 mb-2">Confirmer la résiliation ?</h4>
                <p className="text-red-600 text-sm mb-4">Votre abonnement sera résilié immédiatement. Vous ne recevrez plus de box Louvat. Vous pouvez vous réabonner à tout moment.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowCancelConfirm(false)} className="flex-1 border border-[#D2B48C] text-[#8B4513] py-2 rounded-full text-sm font-semibold hover:bg-[#F5E6D3] transition-all">
                    Annuler
                  </button>
                  <button onClick={() => setCancelled(true)} className="flex-1 bg-red-600 text-white py-2 rounded-full text-sm font-bold hover:bg-red-700 transition-all">
                    Confirmer la résiliation
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Onglet Sélection */}
        {tab === 'selection' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-[#3D2B1F] text-lg" style={{ fontFamily: 'Georgia, serif' }}>
                Ma sélection actuelle ({myBiscuits.length} biscuits)
              </h3>
              <Link href="/box" className="bg-[#8B4513] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#3D2B1F] transition-all">
                Modifier →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {myBiscuits.map((b, i) => (
                <div key={`${b.id}-${i}`} className="bg-white rounded-2xl p-4 border border-[#F5E6D3] text-center shadow-sm">
                  <div className="text-2xl mb-2">🍪</div>
                  <div className="font-semibold text-[#3D2B1F] text-xs" style={{ fontFamily: 'Georgia, serif' }}>{b.name}</div>
                  <div className="text-[#A0856B] text-xs mt-1">{b.category}</div>
                </div>
              ))}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              Les modifications s&apos;appliquent à votre prochaine box. Date limite de modification : 7 jours avant la livraison.
            </div>
          </div>
        )}

        {/* Onglet Historique */}
        {tab === 'historique' && (
          <div>
            <h3 className="font-bold text-[#3D2B1F] text-lg mb-6" style={{ fontFamily: 'Georgia, serif' }}>Historique des livraisons</h3>
            <div className="space-y-3">
              {MOCK_SUBSCRIPTION.historique.map((h) => (
                <div key={h.date} className="bg-white rounded-2xl p-5 border border-[#F5E6D3] flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#3D2B1F] text-sm">
                        Box livrée le {new Date(h.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                      <div className="text-xs text-[#A0856B]">{MOCK_SUBSCRIPTION.boxLabel}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#3D2B1F]">{h.prix.toFixed(2)}€</div>
                    <div className="text-xs text-green-600">Prélevé</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

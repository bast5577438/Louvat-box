'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ChevronRight, CreditCard, Package, User } from 'lucide-react';
import { engagements, biscuits, boxSizes } from '@/lib/data';
import SepaPaymentSection from '@/components/SepaPaymentSection';

type Step = 1 | 2 | 3 | 4;

function AbonnementContent() {
  const params = useSearchParams();
  const [step, setStep] = useState<Step>(1);
  const [selectedEngagement, setSelectedEngagement] = useState(engagements[1]);
  const [ceCode, setCeCode] = useState('');
  const [ceValid, setCeValid] = useState<null | { employerPct: number; valid: boolean }>(null);
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', tel: '', adresse: '', ville: '', cp: '' });
  const [submitted, setSubmitted] = useState(false);

  const selectedTaille = params.get('taille') ?? 'decouverte';
  const boxSize = boxSizes.find((s) => s.id === selectedTaille) ?? boxSizes[0];

  const selectionParam = params.get('selection') ?? '';
  const selectedBiscuits = selectionParam
    ? selectionParam.split(',').flatMap((s) => {
        const [id, qty] = s.split('x');
        const b = biscuits.find((b) => b.id === Number(id));
        return b ? Array.from({ length: Number(qty) }, () => b) : [];
      })
    : [];

  const basePrice = boxSize.prices[selectedEngagement.id];
  const louvat_discount = basePrice * 0.1;
  const employer_discount = ceValid?.valid ? basePrice * (ceValid.employerPct / 100) : 0;
  const finalPrice = Math.max(0, basePrice - louvat_discount - employer_discount);

  // Codes CE de démonstration (remplacés par Supabase après déploiement)
  const MOCK_CE_CODES: Record<string, number> = {
    'CE2024': 30,
  };

  function checkCeCode() {
    const upper = ceCode.toUpperCase();
    if (ceCode.length === 0) return;
    if (MOCK_CE_CODES[upper] !== undefined) {
      setCeValid({ employerPct: MOCK_CE_CODES[upper], valid: true });
    } else {
      setCeValid({ employerPct: 0, valid: false });
    }
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  const steps = [
    { n: 1, label: 'Engagement' },
    { n: 2, label: 'Mes infos' },
    { n: 3, label: 'Paiement SEPA' },
    { n: 4, label: 'Confirmation' },
  ];

  if (submitted) {
    return (
      <div className="bg-[#FFF8F0] min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#3D2B1F] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            Abonnement confirmé !
          </h1>
          <p className="text-[#8B4513] mb-6">
            Bienvenue chez Louvat, {form.prenom} ! Votre première box sera livrée dans les prochains jours.
            Un email de confirmation a été envoyé à <strong>{form.email}</strong>.
          </p>
          <div className="bg-white rounded-2xl p-6 border border-[#F5E6D3] mb-6 text-left">
            <div className="font-bold text-[#3D2B1F] mb-3" style={{ fontFamily: 'Georgia, serif' }}>Récapitulatif</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#8B4513]">Engagement</span><span className="font-semibold">{selectedEngagement.label}</span></div>
              <div className="flex justify-between"><span className="text-[#8B4513]">Box</span><span className="font-semibold">{boxSize.label}</span></div>
              <div className="flex justify-between"><span className="text-[#8B4513]">Remise Louvat</span><span className="text-green-600 font-semibold">-10%</span></div>
              {ceValid?.valid && <div className="flex justify-between"><span className="text-[#8B4513]">Remise employeur</span><span className="text-green-600 font-semibold">-{ceValid.employerPct}%</span></div>}
              <div className="border-t border-[#F5E6D3] pt-2 flex justify-between font-bold text-[#3D2B1F]">
                <span>Total /mois</span>
                <span>{finalPrice.toFixed(2)}€ HT</span>
              </div>
            </div>
          </div>
          <Link href="/mon-compte" className="block bg-[#3D2B1F] text-white py-3 rounded-full font-semibold hover:bg-[#8B4513] transition-all">
            Gérer mon abonnement →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF8F0] min-h-screen">
      <div className="bg-[#3D2B1F] text-white py-10 text-center">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>Mon abonnement Louvat</h1>
        <p className="text-[#D2B48C] text-sm">Prélèvement SEPA · Sans engagement, trimestriel ou annuel</p>
      </div>

      {/* Stepper */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s.n ? 'bg-[#8B4513] text-white' : 'bg-[#F5E6D3] text-[#A0856B]'}`}>
                  {step > s.n ? <CheckCircle className="w-4 h-4" /> : s.n}
                </div>
                <span className="text-xs mt-1 text-[#8B4513] hidden sm:block">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded-full ${step > s.n ? 'bg-[#8B4513]' : 'bg-[#F5E6D3]'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Étape 1 : Formule */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-[#3D2B1F] mb-6 flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
              <Package className="w-5 h-5 text-[#8B4513]" /> Choisissez votre engagement
            </h2>

            {/* Récap sélection biscuits */}
            {selectedBiscuits.length > 0 && (
              <div className="bg-[#F5E6D3] rounded-xl p-4 mb-6">
                <div className="font-semibold text-[#3D2B1F] text-sm mb-2">Votre sélection ({selectedBiscuits.length} biscuits — {boxSize.label}, {boxSize.weight})</div>
                <div className="flex flex-wrap gap-1">
                  {Array.from(new Set(selectedBiscuits.map((b) => b.name))).map((name) => (
                    <span key={name} className="bg-white text-[#8B4513] text-xs px-2 py-1 rounded-full border border-[#D2B48C]">
                      {name}
                    </span>
                  ))}
                </div>
                <Link href="/box" className="text-xs text-[#A0856B] hover:text-[#8B4513] mt-2 inline-block">Modifier ma sélection</Link>
              </div>
            )}

            {selectedBiscuits.length === 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
                Vous n&apos;avez pas encore sélectionné vos biscuits pour la {boxSize.label} ({boxSize.weight}, {boxSize.description}). <Link href="/box" className="font-semibold underline">Composer ma box →</Link>
              </div>
            )}

            {/* Engagement */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {engagements.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setSelectedEngagement(e)}
                  className={`p-6 rounded-2xl border-2 text-left transition-all ${selectedEngagement.id === e.id ? 'border-[#8B4513] bg-[#F5E6D3]' : 'border-[#F5E6D3] bg-white hover:border-[#D2B48C]'}`}
                >
                  {e.popular && <span className="text-xs font-bold text-[#F4A460] block mb-1">⭐ MEILLEUR PRIX</span>}
                  <div className="font-bold text-[#3D2B1F] text-lg mb-1" style={{ fontFamily: 'Georgia, serif' }}>{e.label}</div>
                  <div className="text-2xl font-bold text-[#8B4513]">{boxSize.prices[e.id]}€ <span className="text-sm font-normal text-[#A0856B]">HT</span></div>
                  <div className="text-xs text-[#A0856B]">/ mois</div>
                  <div className="text-xs text-[#8B4513] mt-2">{e.description}</div>
                </button>
              ))}
            </div>

            {/* Code CE */}
            <div className="bg-white rounded-2xl border border-[#F5E6D3] p-5 mb-6">
              <div className="font-semibold text-[#3D2B1F] mb-2 text-sm">Vous avez un code CE ?</div>
              <div className="flex gap-2">
                <input
                  value={ceCode}
                  onChange={(e) => { setCeCode(e.target.value.toUpperCase()); setCeValid(null); }}
                  placeholder="Ex: CE2024"
                  className="flex-1 border border-[#D2B48C] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513]"
                />
                <button
                  onClick={checkCeCode}
                  className="bg-[#8B4513] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#3D2B1F] transition-all"
                >
                  Appliquer
                </button>
              </div>
              {ceValid?.valid && (
                <div className="mt-2 text-sm text-green-700 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Code valide ! Votre employeur prend en charge {ceValid.employerPct}%.
                </div>
              )}
              {ceValid !== null && !ceValid.valid && (
                <div className="mt-2 text-sm text-red-600">Code invalide. Vérifiez avec votre CE.</div>
              )}
            </div>

            {/* Récap prix */}
            <div className="bg-[#3D2B1F] text-white rounded-2xl p-5 mb-6">
              <div className="font-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>Récapitulatif tarifaire</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#D2B48C]">Prix de base</span><span>{basePrice.toFixed(2)}€ HT</span></div>
                <div className="flex justify-between text-green-400"><span>Remise Louvat (10%)</span><span>-{louvat_discount.toFixed(2)}€</span></div>
                {ceValid?.valid && (
                  <div className="flex justify-between text-green-400"><span>Remise employeur ({ceValid.employerPct}%)</span><span>-{employer_discount.toFixed(2)}€</span></div>
                )}
                <div className="border-t border-[#5C3D2E] pt-2 flex justify-between font-bold text-lg">
                  <span>Vous payez</span>
                  <span className="text-[#F4A460]">{finalPrice.toFixed(2)}€ HT</span>
                </div>
                <div className="text-xs text-[#A0856B]">Prélevé par SEPA · Facturation mensuelle · {selectedEngagement.label}</div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-[#8B4513] text-white py-4 rounded-full font-bold hover:bg-[#3D2B1F] transition-all flex items-center justify-center gap-2"
            >
              Continuer <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Étape 2 : Informations */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-[#3D2B1F] mb-6 flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
              <User className="w-5 h-5 text-[#8B4513]" /> Vos informations
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#3D2B1F] mb-1">Prénom *</label>
                  <input value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} className="w-full border border-[#D2B48C] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513]" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3D2B1F] mb-1">Nom *</label>
                  <input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} className="w-full border border-[#D2B48C] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513]" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3D2B1F] mb-1">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-[#D2B48C] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513]" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3D2B1F] mb-1">Téléphone</label>
                <input type="tel" value={form.tel} onChange={(e) => setForm({ ...form, tel: e.target.value })} className="w-full border border-[#D2B48C] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3D2B1F] mb-1">Adresse de livraison *</label>
                <input value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} className="w-full border border-[#D2B48C] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513]" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#3D2B1F] mb-1">Code postal *</label>
                  <input value={form.cp} onChange={(e) => setForm({ ...form, cp: e.target.value })} className="w-full border border-[#D2B48C] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513]" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3D2B1F] mb-1">Ville *</label>
                  <input value={form.ville} onChange={(e) => setForm({ ...form, ville: e.target.value })} className="w-full border border-[#D2B48C] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513]" required />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="flex-1 border-2 border-[#D2B48C] text-[#8B4513] py-3 rounded-full font-semibold hover:bg-[#F5E6D3] transition-all">
                Retour
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!form.prenom || !form.nom || !form.email || !form.adresse || !form.cp || !form.ville}
                className="flex-1 bg-[#8B4513] text-white py-3 rounded-full font-bold hover:bg-[#3D2B1F] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continuer <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Étape 3 : SEPA */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-[#3D2B1F] mb-2 flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
              <CreditCard className="w-5 h-5 text-[#8B4513]" /> Prélèvement SEPA
            </h2>
            <p className="text-sm text-[#8B4513] mb-6">Votre IBAN est sécurisé et chiffré. Aucune carte bancaire requise.</p>

            <SepaPaymentSection
              billingDetails={{
                name: `${form.prenom} ${form.nom}`.trim(),
                email: form.email,
                address: {
                  line1: form.adresse,
                  city: form.ville,
                  postal_code: form.cp,
                  country: 'FR',
                },
              }}
              recap={{
                engagementLabel: selectedEngagement.label,
                boxLabel: boxSize.label,
                finalPrice,
                periodLabel: 'Chaque mois',
                startDateLabel: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
              }}
              onBack={() => setStep(2)}
              onSuccess={handleSubmit}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function AbonnementPage() {
  return (
    <Suspense>
      <AbonnementContent />
    </Suspense>
  );
}

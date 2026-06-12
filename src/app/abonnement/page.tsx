'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ChevronRight, CreditCard, Package, User } from 'lucide-react';
import { engagements, boxSizes, type Biscuit } from '@/lib/data';
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
  const [saveError, setSaveError] = useState('');
  const [produits, setProduits] = useState<Biscuit[]>([]);

  useEffect(() => {
    fetch('/api/produits')
      .then((res) => res.json())
      .then((data) => setProduits(data.produits ?? []))
      .catch(() => setProduits([]));
  }, []);

  const selectedTaille = params.get('taille') ?? 'decouverte';
  const boxSize = boxSizes.find((s) => s.id === selectedTaille) ?? boxSizes[0];

  const selectionParam = params.get('selection') ?? '';
  const selectedBiscuits = selectionParam
    ? selectionParam.split(',').flatMap((s) => {
        const [id, qty] = s.split('x');
        const b = produits.find((b) => b.id === Number(id));
        return b ? Array.from({ length: Number(qty) }, () => b) : [];
      })
    : [];

  const basePrice = boxSize.prices[selectedEngagement.id];
  // La remise Louvat (10%) ne s'applique qu'aux abonnements via un code CE
  // valide : les clients "box classique" paient le tarif plein.
  const louvat_discount = ceValid?.valid ? basePrice * 0.1 : 0;
  const employer_discount = ceValid?.valid ? basePrice * (ceValid.employerPct / 100) : 0;
  const finalPrice = Math.max(0, basePrice - louvat_discount - employer_discount);

  const [checkingCe, setCheckingCe] = useState(false);

  async function checkCeCode() {
    if (ceCode.length === 0) return;
    setCheckingCe(true);
    try {
      const res = await fetch(`/api/ce-codes/check?code=${encodeURIComponent(ceCode)}`);
      const data = await res.json();
      if (data.valid) {
        setCeValid({ employerPct: data.employerPct ?? 0, valid: true });
      } else {
        setCeValid({ employerPct: 0, valid: false });
      }
    } catch {
      setCeValid({ employerPct: 0, valid: false });
    } finally {
      setCheckingCe(false);
    }
  }

  async function handleSubmit() {
    setSubmitted(true);

    // Crée (ou met à jour) l'espace abonné côté Supabase, pour que le
    // client retrouve sa formule et sa sélection dans /mon-compte et que
    // la gérante le voie dans l'admin > Clients.
    try {
      const res = await fetch('/api/abonnement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prenom: form.prenom,
          nom: form.nom,
          email: form.email,
          engagement: selectedEngagement.id,
          box_id: boxSize.id,
          prix: finalPrice,
          ce_code: ceValid?.valid ? ceCode : null,
          selections: selectedBiscuits.map((b) => b.id),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSaveError(data.error ?? "Votre paiement est confirmé, mais l'enregistrement de votre espace abonné a échoué. Contactez-nous pour le mettre à jour.");
      }
    } catch {
      setSaveError("Votre paiement est confirmé, mais l'enregistrement de votre espace abonné a échoué. Contactez-nous pour le mettre à jour.");
    }
  }

  const steps = [
    { n: 1, label: 'Engagement' },
    { n: 2, label: 'Mes infos' },
    { n: 3, label: 'Paiement SEPA' },
    { n: 4, label: 'Confirmation' },
  ];

  if (submitted) {
    return (
      <div className="bg-[#FBF4E9] min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#3E4743] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            Abonnement confirmé !
          </h1>
          <p className="text-[#5C6B65] mb-6">
            Bienvenue chez Louvat, {form.prenom} ! Votre première box sera livrée dans les prochains jours.
            Un email de confirmation a été envoyé à <strong>{form.email}</strong>.
          </p>

          {saveError && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800 text-left">
              {saveError}
            </div>
          )}

          <p className="text-[#8A8E89] text-sm mb-6">
            Créez votre espace abonné avec l&apos;adresse <strong>{form.email}</strong> pour suivre votre
            abonnement, mettre en pause ou modifier votre sélection à tout moment.
          </p>
          <div className="bg-white rounded-2xl p-6 border border-[#F3E4CD] mb-6 text-left">
            <div className="font-bold text-[#3E4743] mb-3" style={{ fontFamily: 'Georgia, serif' }}>Récapitulatif</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#5C6B65]">Engagement</span><span className="font-semibold">{selectedEngagement.label}</span></div>
              <div className="flex justify-between"><span className="text-[#5C6B65]">Box</span><span className="font-semibold">{boxSize.label}</span></div>
              {ceValid?.valid && <div className="flex justify-between"><span className="text-[#5C6B65]">Remise Louvat</span><span className="text-green-600 font-semibold">-10%</span></div>}
              {ceValid?.valid && <div className="flex justify-between"><span className="text-[#5C6B65]">Remise employeur</span><span className="text-green-600 font-semibold">-{ceValid.employerPct}%</span></div>}
              <div className="border-t border-[#F3E4CD] pt-2 flex justify-between font-bold text-[#3E4743]">
                <span>Total /mois</span>
                <span>{finalPrice.toFixed(2)}€ HT</span>
              </div>
            </div>
          </div>
          <Link href="/mon-compte" className="block bg-[#3E4743] text-white py-3 rounded-full font-semibold hover:bg-[#5C6B65] transition-all">
            Gérer mon abonnement →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FBF4E9] min-h-screen">
      <div className="bg-[#3E4743] text-white py-10 text-center">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>Mon abonnement Louvat</h1>
        <p className="text-[#E3D4BD] text-sm">Prélèvement SEPA · Sans engagement, trimestriel ou annuel</p>
      </div>

      {/* Stepper */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s.n ? 'bg-[#5C6B65] text-white' : 'bg-[#F3E4CD] text-[#8A8E89]'}`}>
                  {step > s.n ? <CheckCircle className="w-4 h-4" /> : s.n}
                </div>
                <span className="text-xs mt-1 text-[#5C6B65] hidden sm:block">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded-full ${step > s.n ? 'bg-[#5C6B65]' : 'bg-[#F3E4CD]'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Étape 1 : Formule */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-[#3E4743] mb-6 flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
              <Package className="w-5 h-5 text-[#5C6B65]" /> Choisissez votre engagement
            </h2>

            {/* Récap sélection biscuits */}
            {selectedBiscuits.length > 0 && (
              <div className="bg-[#F3E4CD] rounded-xl p-4 mb-6">
                <div className="font-semibold text-[#3E4743] text-sm mb-2">Votre sélection ({selectedBiscuits.length} biscuits — {boxSize.label}, {boxSize.weight})</div>
                <div className="flex flex-wrap gap-1">
                  {Array.from(new Set(selectedBiscuits.map((b) => b.name))).map((name) => (
                    <span key={name} className="bg-white text-[#5C6B65] text-xs px-2 py-1 rounded-full border border-[#E3D4BD]">
                      {name}
                    </span>
                  ))}
                </div>
                <Link href="/box" className="text-xs text-[#8A8E89] hover:text-[#5C6B65] mt-2 inline-block">Modifier ma sélection</Link>
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
                  className={`p-6 rounded-2xl border-2 text-left transition-all ${selectedEngagement.id === e.id ? 'border-[#5C6B65] bg-[#F3E4CD]' : 'border-[#F3E4CD] bg-white hover:border-[#E3D4BD]'}`}
                >
                  {e.popular && <span className="text-xs font-bold text-[#F48F98] block mb-1">⭐ MEILLEUR PRIX</span>}
                  <div className="font-bold text-[#3E4743] text-lg mb-1" style={{ fontFamily: 'Georgia, serif' }}>{e.label}</div>
                  <div className="text-2xl font-bold text-[#5C6B65]">{boxSize.prices[e.id]}€ <span className="text-sm font-normal text-[#8A8E89]">HT</span></div>
                  <div className="text-xs text-[#8A8E89]">/ mois</div>
                  <div className="text-xs text-[#5C6B65] mt-2">{e.description}</div>
                </button>
              ))}
            </div>

            {/* Code CE */}
            <div className="bg-white rounded-2xl border border-[#F3E4CD] p-5 mb-6">
              <div className="font-semibold text-[#3E4743] mb-2 text-sm">Vous avez un code CE ?</div>
              <div className="flex gap-2">
                <input
                  value={ceCode}
                  onChange={(e) => { setCeCode(e.target.value.toUpperCase()); setCeValid(null); }}
                  placeholder="Ex: CE2024"
                  className="flex-1 border border-[#E3D4BD] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#5C6B65]"
                />
                <button
                  onClick={checkCeCode}
                  disabled={checkingCe || ceCode.length === 0}
                  className="bg-[#5C6B65] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#3E4743] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checkingCe ? 'Vérification…' : 'Appliquer'}
                </button>
              </div>
              {ceValid?.valid && (
                <div className="mt-2 text-sm text-green-700 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Code valide ! Louvat offre 10% et votre employeur prend en charge {ceValid.employerPct}%.
                </div>
              )}
              {ceValid !== null && !ceValid.valid && (
                <div className="mt-2 text-sm text-red-600">Code invalide. Vérifiez avec votre CE.</div>
              )}
              {!ceValid && (
                <p className="mt-2 text-xs text-[#8A8E89]">Sans code CE, le tarif affiché ci-dessous est le tarif plein (box classique).</p>
              )}
            </div>

            {/* Récap prix */}
            <div className="bg-[#3E4743] text-white rounded-2xl p-5 mb-6">
              <div className="font-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>Récapitulatif tarifaire</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#E3D4BD]">Prix de base</span><span>{basePrice.toFixed(2)}€ HT</span></div>
                {ceValid?.valid && (
                  <div className="flex justify-between text-green-400"><span>Remise Louvat (10%)</span><span>-{louvat_discount.toFixed(2)}€</span></div>
                )}
                {ceValid?.valid && (
                  <div className="flex justify-between text-green-400"><span>Remise employeur ({ceValid.employerPct}%)</span><span>-{employer_discount.toFixed(2)}€</span></div>
                )}
                <div className="border-t border-[#5C3D2E] pt-2 flex justify-between font-bold text-lg">
                  <span>Vous payez</span>
                  <span className="text-[#F48F98]">{finalPrice.toFixed(2)}€ HT</span>
                </div>
                <div className="text-xs text-[#8A8E89]">Prélevé par SEPA · Facturation mensuelle · {selectedEngagement.label}</div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-[#5C6B65] text-white py-4 rounded-full font-bold hover:bg-[#3E4743] transition-all flex items-center justify-center gap-2"
            >
              Continuer <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Étape 2 : Informations */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-[#3E4743] mb-6 flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
              <User className="w-5 h-5 text-[#5C6B65]" /> Vos informations
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#3E4743] mb-1">Prénom *</label>
                  <input value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} className="w-full border border-[#E3D4BD] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#5C6B65]" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3E4743] mb-1">Nom *</label>
                  <input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} className="w-full border border-[#E3D4BD] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#5C6B65]" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3E4743] mb-1">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-[#E3D4BD] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#5C6B65]" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3E4743] mb-1">Téléphone</label>
                <input type="tel" value={form.tel} onChange={(e) => setForm({ ...form, tel: e.target.value })} className="w-full border border-[#E3D4BD] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#5C6B65]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3E4743] mb-1">Adresse de livraison *</label>
                <input value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} className="w-full border border-[#E3D4BD] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#5C6B65]" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#3E4743] mb-1">Code postal *</label>
                  <input value={form.cp} onChange={(e) => setForm({ ...form, cp: e.target.value })} className="w-full border border-[#E3D4BD] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#5C6B65]" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3E4743] mb-1">Ville *</label>
                  <input value={form.ville} onChange={(e) => setForm({ ...form, ville: e.target.value })} className="w-full border border-[#E3D4BD] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#5C6B65]" required />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="flex-1 border-2 border-[#E3D4BD] text-[#5C6B65] py-3 rounded-full font-semibold hover:bg-[#F3E4CD] transition-all">
                Retour
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!form.prenom || !form.nom || !form.email || !form.adresse || !form.cp || !form.ville}
                className="flex-1 bg-[#5C6B65] text-white py-3 rounded-full font-bold hover:bg-[#3E4743] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continuer <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Étape 3 : SEPA */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-[#3E4743] mb-2 flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
              <CreditCard className="w-5 h-5 text-[#5C6B65]" /> Prélèvement SEPA
            </h2>
            <p className="text-sm text-[#5C6B65] mb-6">Votre IBAN est sécurisé et chiffré. Aucune carte bancaire requise.</p>

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

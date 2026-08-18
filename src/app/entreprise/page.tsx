'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle, ChevronRight, Building2, CreditCard, Minus, Plus, Users } from 'lucide-react';
import { engagements, BOX_PRICE, estimerPersonnes, PORTION_GRAMMES_PAR_PERSONNE } from '@/lib/data';
import SepaPaymentSection from '@/components/SepaPaymentSection';

type Step = 1 | 2 | 3 | 4;

function EntrepriseContent() {
  const [step, setStep] = useState<Step>(1);
  const [quantite, setQuantite] = useState(1);
  const [selectedEngagement, setSelectedEngagement] = useState(engagements[1]);
  const [form, setForm] = useState({ entreprise: '', prenom: '', nom: '', email: '', tel: '', adresse: '', ville: '', cp: '' });
  const [submitted, setSubmitted] = useState(false);
  const [saveError, setSaveError] = useState('');

  const unitPrice = BOX_PRICE[selectedEngagement.id];
  const totalPrice = unitPrice * quantite;
  const personnesEstimees = estimerPersonnes(quantite);

  async function handleSubmit() {
    setSubmitted(true);

    try {
      const res = await fetch('/api/abonnement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type_abonnement: 'entreprise',
          quantite,
          entreprise: form.entreprise,
          prenom: form.prenom,
          nom: form.nom,
          email: form.email,
          telephone: form.tel,
          adresse: form.adresse,
          ville: form.ville,
          cp: form.cp,
          engagement: selectedEngagement.id,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSaveError(data.error ?? "Votre paiement est confirmé, mais l'enregistrement de votre commande a échoué. Contactez-nous pour le mettre à jour.");
      }
    } catch {
      setSaveError("Votre paiement est confirmé, mais l'enregistrement de votre commande a échoué. Contactez-nous pour le mettre à jour.");
    }
  }

  const steps = [
    { n: 1, label: 'Quantité & engagement' },
    { n: 2, label: 'Mon entreprise' },
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
          <h1 className="text-3xl font-bold text-[#3E4743] mb-3">
            Commande confirmée !
          </h1>
          <p className="text-[#5C6B65] mb-6">
            Merci {form.prenom}, la commande pour <strong>{form.entreprise}</strong> a bien été enregistrée.
            Un email de confirmation a été envoyé à <strong>{form.email}</strong>.
          </p>

          {saveError && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800 text-left">
              {saveError}
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 border border-[#F3E4CD] mb-6 text-left">
            <div className="font-bold text-[#3E4743] mb-3">Récapitulatif</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#5C6B65]">Engagement</span><span className="font-semibold">{selectedEngagement.label}</span></div>
              <div className="flex justify-between"><span className="text-[#5C6B65]">Quantité</span><span className="font-semibold">{quantite} box du mois</span></div>
              <div className="flex justify-between"><span className="text-[#5C6B65]">Personnes estimées</span><span className="font-semibold">~{personnesEstimees}</span></div>
              <div className="border-t border-[#F3E4CD] pt-2 flex justify-between font-bold text-[#3E4743]">
                <span>Total /mois</span>
                <span>{totalPrice.toFixed(2)}€ HT</span>
              </div>
            </div>
          </div>
          <Link href="/" className="block bg-[#3E4743] text-white py-3 rounded-full font-semibold hover:bg-[#5C6B65] transition-all">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FBF4E9] min-h-screen">
      <div className="bg-[#3E4743] text-white py-10 text-center">
        <h1 className="text-3xl font-bold mb-2">Louvat Box pour les entreprises</h1>
        <p className="text-[#E3D4BD] text-sm">La box du mois pour votre salle de pause · Prélèvement SEPA</p>
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

        {/* Étape 1 : Quantité & engagement */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-[#3E4743] mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#5C6B65]" /> Combien de box ce mois-ci ?
            </h2>

            <div className="bg-white rounded-2xl border border-[#F3E4CD] p-5 mb-6">
              <div className="font-semibold text-[#3E4743] mb-3 text-sm">Quantité de box du mois</div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantite((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-full border-2 border-[#E3D4BD] text-[#5C6B65] flex items-center justify-center hover:bg-[#F3E4CD] transition-all"
                  aria-label="Diminuer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min={1}
                  value={quantite}
                  onChange={(e) => setQuantite(Math.max(1, Math.floor(Number(e.target.value) || 1)))}
                  className="w-20 text-center text-2xl font-bold text-[#3E4743] border border-[#E3D4BD] rounded-xl py-2 focus:outline-none focus:border-[#5C6B65]"
                />
                <button
                  onClick={() => setQuantite((q) => q + 1)}
                  className="w-10 h-10 rounded-full border-2 border-[#E3D4BD] text-[#5C6B65] flex items-center justify-center hover:bg-[#F3E4CD] transition-all"
                  aria-label="Augmenter"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 bg-[#F3E4CD] rounded-xl p-4 flex items-start gap-3">
                <Users className="w-5 h-5 text-[#5C6B65] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-[#3E4743]">Convient à environ {personnesEstimees} personnes</div>
                  <p className="text-xs text-[#8A8E89] mt-1">
                    Estimation à titre indicatif : chaque box contient 3 produits de 500g, soit 1,5 kg,
                    à raison d&apos;environ {PORTION_GRAMMES_PAR_PERSONNE}g par personne en partage (salle de pause).
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {engagements.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setSelectedEngagement(e)}
                  className={`p-6 rounded-2xl border-2 text-left transition-all ${selectedEngagement.id === e.id ? 'border-[#5C6B65] bg-[#F3E4CD]' : 'border-[#F3E4CD] bg-white hover:border-[#E3D4BD]'}`}
                >
                  {e.popular && <span className="text-xs font-bold text-[#F48F98] block mb-1">⭐ MEILLEUR PRIX</span>}
                  <div className="font-bold text-[#3E4743] text-lg mb-1">{e.label}</div>
                  <div className="text-2xl font-bold text-[#5C6B65]">{BOX_PRICE[e.id]}€ <span className="text-sm font-normal text-[#8A8E89]">HT / box</span></div>
                  <div className="text-xs text-[#8A8E89]">/ mois</div>
                  <div className="text-xs text-[#5C6B65] mt-2">{e.description}</div>
                </button>
              ))}
            </div>

            <div className="bg-[#3E4743] text-white rounded-2xl p-5 mb-6">
              <div className="font-bold mb-3">Récapitulatif tarifaire</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#E3D4BD]">Prix unitaire</span><span>{unitPrice.toFixed(2)}€ HT</span></div>
                <div className="flex justify-between"><span className="text-[#E3D4BD]">Quantité</span><span>× {quantite}</span></div>
                <div className="border-t border-[#5C3D2E] pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-[#F48F98]">{totalPrice.toFixed(2)}€ HT</span>
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

        {/* Étape 2 : Informations entreprise */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-[#3E4743] mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#5C6B65]" /> Votre entreprise
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#3E4743] mb-1">Raison sociale *</label>
                <input value={form.entreprise} onChange={(e) => setForm({ ...form, entreprise: e.target.value })} className="w-full border border-[#E3D4BD] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#5C6B65]" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#3E4743] mb-1">Prénom du contact *</label>
                  <input value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} className="w-full border border-[#E3D4BD] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#5C6B65]" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3E4743] mb-1">Nom du contact *</label>
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
                disabled={!form.entreprise || !form.prenom || !form.nom || !form.email || !form.adresse || !form.cp || !form.ville}
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
            <h2 className="text-xl font-bold text-[#3E4743] mb-2 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#5C6B65]" /> Prélèvement SEPA
            </h2>
            <p className="text-sm text-[#5C6B65] mb-6">L&apos;IBAN de l&apos;entreprise est sécurisé et chiffré. Aucune carte bancaire requise.</p>

            <SepaPaymentSection
              billingDetails={{
                name: form.entreprise || `${form.prenom} ${form.nom}`.trim(),
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
                boxLabel: `Box du mois × ${quantite}`,
                finalPrice: totalPrice,
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

export default function EntreprisePage() {
  return (
    <Suspense>
      <EntrepriseContent />
    </Suspense>
  );
}

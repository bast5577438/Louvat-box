'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, IbanElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Lock, AlertCircle, ShieldCheck } from 'lucide-react';

/* Chargé une seule fois si la clé publique Stripe est configurée.
   Tant que NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY n'est pas définie
   (voir GUIDE_DEPLOIEMENT.md, Étape 7), `stripePromise` vaut `null`
   et le formulaire bascule en mode démonstration. */
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

type BillingDetails = {
  name: string;
  email: string;
  address: {
    line1: string;
    city: string;
    postal_code: string;
    country: string;
  };
};

type RecapInfo = {
  engagementLabel: string;
  boxLabel: string;
  finalPrice: number;
  periodLabel: string;
  startDateLabel: string;
};

type Props = {
  billingDetails: BillingDetails;
  recap: RecapInfo;
  onBack: () => void;
  onSuccess: () => void;
};

/* ── Récapitulatif (commun aux deux modes) ── */
function RecapBlock({ recap }: { recap: RecapInfo }) {
  return (
    <div className="bg-[#F5E6D3] rounded-2xl p-5 my-6">
      <div className="font-bold text-[#3D2B1F] mb-3" style={{ fontFamily: 'Georgia, serif' }}>Récapitulatif de votre abonnement</div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between"><span className="text-[#8B4513]">Engagement</span><span className="font-medium text-[#3D2B1F]">{recap.engagementLabel}</span></div>
        <div className="flex justify-between"><span className="text-[#8B4513]">Box</span><span className="font-medium text-[#3D2B1F]">{recap.boxLabel}</span></div>
        <div className="flex justify-between"><span className="text-[#8B4513]">Livraison</span><span className="font-medium text-green-700">Gratuite</span></div>
        <div className="border-t border-[#D2B48C] pt-2 mt-2 flex justify-between font-bold text-[#3D2B1F]">
          <span>Montant prélevé</span>
          <span className="text-[#8B4513] text-lg">{recap.finalPrice.toFixed(2)}€ HT</span>
        </div>
        <div className="text-xs text-[#A0856B]">{recap.periodLabel}, à partir du {recap.startDateLabel}</div>
      </div>
    </div>
  );
}

function CgvNote() {
  return (
    <p className="text-xs text-center text-[#A0856B] mt-3">
      En confirmant, vous acceptez nos <a href="/cgv" className="underline hover:text-[#8B4513]">CGV</a> et autorisez le prélèvement SEPA.
    </p>
  );
}

const ibanElementOptions = {
  supportedCountries: ['SEPA'],
  placeholderCountry: 'FR',
  style: {
    base: {
      fontSize: '14px',
      color: '#3D2B1F',
      '::placeholder': { color: '#A0856B' },
    },
  },
};

/* ── Mode réel : mandat SEPA via Stripe Elements ── */
function StripeSepaForm({ billingDetails, recap, onBack, onSuccess }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleConfirm() {
    if (!stripe || !elements) return;
    const ibanElement = elements.getElement(IbanElement);
    if (!ibanElement) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/sepa/setup-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: billingDetails.email, name: billingDetails.name }),
      });
      const data = await res.json();
      if (!res.ok || !data.clientSecret) {
        throw new Error(data.error || "Impossible de préparer le mandat SEPA pour le moment.");
      }

      const result = await stripe.confirmSepaDebitSetup(data.clientSecret, {
        payment_method: {
          sepa_debit: ibanElement,
          billing_details: billingDetails,
        },
      });

      if (result.error) {
        throw new Error(result.error.message || 'Le mandat SEPA a été refusé. Vérifiez votre IBAN.');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue. Merci de réessayer.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-2 text-sm text-blue-800">
        <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>En confirmant votre IBAN, vous autorisez Louvat Biscuiterie à prélever les montants convenus selon le mandat SEPA. Vous pouvez résilier à tout moment depuis votre espace client.</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#3D2B1F] mb-1">IBAN *</label>
          <div className="border border-[#D2B48C] rounded-xl px-3 py-3 bg-white focus-within:border-[#8B4513]">
            <IbanElement options={ibanElementOptions} />
          </div>
          <p className="text-xs text-[#A0856B] mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Saisie sécurisée par Stripe — votre IBAN ne transite jamais par nos serveurs.
          </p>
        </div>
      </div>

      <RecapBlock recap={recap} />

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-xl p-3 mb-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} disabled={loading} className="flex-1 border-2 border-[#D2B48C] text-[#8B4513] py-3 rounded-full font-semibold hover:bg-[#F5E6D3] transition-all disabled:opacity-50">
          Retour
        </button>
        <button
          onClick={handleConfirm}
          disabled={!stripe || loading}
          className="flex-1 bg-[#3D2B1F] text-white py-3 rounded-full font-bold hover:bg-[#8B4513] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Lock className="w-4 h-4" /> {loading ? 'Vérification...' : "Confirmer l'abonnement"}
        </button>
      </div>

      <CgvNote />
    </div>
  );
}

/* ── Mode démonstration : formulaire simulé (Stripe non configuré) ── */
function DemoSepaForm({ recap, onBack, onSuccess }: Props) {
  const [sepa, setSepa] = useState({ iban: '', titulaire: '' });

  return (
    <div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-2 text-sm text-blue-800">
        <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>En fournissant votre IBAN, vous autorisez Louvat Biscuiterie à prélever les montants convenus selon le mandat SEPA. Vous pouvez résilier à tout moment depuis votre espace client.</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#3D2B1F] mb-1">Titulaire du compte *</label>
          <input
            value={sepa.titulaire}
            onChange={(e) => setSepa({ ...sepa, titulaire: e.target.value })}
            placeholder="Prénom Nom"
            className="w-full border border-[#D2B48C] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#3D2B1F] mb-1">IBAN *</label>
          <input
            value={sepa.iban}
            onChange={(e) => setSepa({ ...sepa, iban: e.target.value.replace(/\s/g, '').toUpperCase() })}
            placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
            className="w-full border border-[#D2B48C] rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#8B4513]"
          />
          <p className="text-xs text-[#A0856B] mt-1">Format : FR + 25 chiffres (ex: FR7630001007941234567890185)</p>
        </div>
      </div>

      <RecapBlock recap={recap} />

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 border-2 border-[#D2B48C] text-[#8B4513] py-3 rounded-full font-semibold hover:bg-[#F5E6D3] transition-all">
          Retour
        </button>
        <button
          onClick={onSuccess}
          disabled={!sepa.iban || !sepa.titulaire}
          className="flex-1 bg-[#3D2B1F] text-white py-3 rounded-full font-bold hover:bg-[#8B4513] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Lock className="w-4 h-4" /> Confirmer l&apos;abonnement
        </button>
      </div>

      <CgvNote />
    </div>
  );
}

export default function SepaPaymentSection(props: Props) {
  if (!stripePromise) {
    return (
      <div>
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl p-3 mb-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>Mode démonstration : le paiement Stripe n&apos;est pas encore configuré sur ce site (voir GUIDE_DEPLOIEMENT.md, Étape 7). Ce formulaire ne traite aucun paiement réel.</span>
        </div>
        <DemoSepaForm {...props} />
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ locale: 'fr' }}>
      <StripeSepaForm {...props} />
    </Elements>
  );
}

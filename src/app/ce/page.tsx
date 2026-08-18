'use client';

import { useState } from 'react';
import { Building2, Users, Percent, CheckCircle, ChevronDown, ChevronUp, ArrowRight, Mail, AlertTriangle } from 'lucide-react';
import { CONTACT_EMAIL } from '@/lib/contact';
import { BOX_PRICE } from '@/lib/data';

const FAQ = [
  { q: 'Comment fonctionne le financement tripartite ?', a: "Le prix de la box est partagé entre trois parties : Louvat offre systématiquement 10%, l'employeur choisit un pourcentage à sa convenance (ex: 30%), et le salarié paie le solde — prélevé directement par SEPA." },
  { q: 'Comment les salariés accèdent-ils à leur box ?', a: "Une fois votre CE inscrit, vous recevez un code unique (ex: ACME2024). Les salariés entrent ce code lors de leur abonnement. Le prix réduit s'applique automatiquement." },
  { q: 'Comment est facturé l\'employeur ?', a: "Louvat envoie une facture groupée à la fin de chaque mois au CE ou à l'employeur, correspondant à la somme des parts employeurs de tous les abonnés." },
  { q: 'Peut-on changer le pourcentage employeur ?', a: "Oui, depuis l'espace admin CE vous pouvez modifier le pourcentage à tout moment. Le changement s'applique à la prochaine période de facturation." },
  { q: "Y a-t-il un minimum d'abonnés ?", a: "Non, il n'y a pas de minimum. Même un seul salarié abonné via CE est pris en charge." },
];

export default function CEPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [employerPct, setEmployerPct] = useState(30);
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [ceForm, setCeForm] = useState({ societe: '', contact: '', email: '', tel: '', effectif: '' });

  const basePrice = BOX_PRICE.annuel;
  const louvat = basePrice * 0.1;
  const employer = basePrice * (employerPct / 100);
  const employee = Math.max(0, basePrice - louvat - employer);

  async function handleSubmitCE(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setSendError(false);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: ceForm.contact,
          email: ceForm.email,
          phone: ceForm.tel,
          subject: `Inscription Comité d'Entreprise — ${ceForm.societe}`,
          message: [
            `Nouvelle demande d'inscription Comité d'Entreprise.`,
            '',
            `Société : ${ceForm.societe}`,
            `Responsable CE : ${ceForm.contact}`,
            `Email : ${ceForm.email}`,
            `Téléphone : ${ceForm.tel}`,
            `Effectif : ${ceForm.effectif || 'non précisé'}`,
            `Part employeur souhaitée : ${employerPct}%`,
          ].join('\n'),
        }),
      });
      if (!res.ok) setSendError(true);
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
      setFormSubmitted(true);
    }
  }

  if (formSubmitted) {
    return (
      <div className="bg-[#FBF4E9] min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-[#3E4743] mb-3">
            Demande envoyée !
          </h2>
          <p className="text-[#5C6B65] mb-6">
            Merci {ceForm.contact} ! Notre équipe va traiter votre demande pour <strong>{ceForm.societe}</strong> dans les 48h et vous envoyer votre code CE par email à <strong>{ceForm.email}</strong>.
          </p>
          {sendError && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex gap-3 text-left mb-6">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                Votre demande a bien été enregistrée, mais l&apos;envoi automatique de l&apos;email n&apos;a pas pu être confirmé.
                Pour être sûr·e que nous la recevions, vous pouvez aussi nous écrire directement à{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline">{CONTACT_EMAIL}</a>.
              </div>
            </div>
          )}
          <div className="bg-[#F3E4CD] rounded-2xl p-4 text-sm text-[#5C6B65]">
            <strong>Ce qui vous attend :</strong>
            <ul className="mt-2 space-y-1 text-left">
              <li>✓ Code CE unique pour votre entreprise</li>
              <li>✓ Accès à l&apos;espace admin CE</li>
              <li>✓ Prospectus trimestriel à diffuser</li>
              <li>✓ Facturation mensuelle simplifiée</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FBF4E9]">
      {/* Hero CE */}
      <section className="bg-[#3E4743] text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <Building2 className="w-14 h-14 text-[#F48F98] mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Louvat Box pour<br />votre Comité d&apos;Entreprise
          </h1>
          <p className="text-[#E3D4BD] text-lg max-w-2xl mx-auto mb-8">
            Offrez à vos salariés une box de biscuits artisanaux Louvat avec un système de financement partagé.
            Simple, sans gestion lourde, apprécié de tous.
          </p>
          <button
            onClick={() => { setShowForm(true); document.getElementById('inscription')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="bg-[#F48F98] text-[#3E4743] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#E0727C] hover:text-white transition-all inline-flex items-center gap-2"
          >
            Inscrire mon CE <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Avantages */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-[#3E4743] mb-10">
          Pourquoi choisir Louvat CE ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Percent className="w-8 h-8" />, title: '10% offerts par Louvat', desc: 'Sur chaque abonnement salarié. Systématique, sans condition.' },
            { icon: <Users className="w-8 h-8" />, title: 'Vous choisissez votre part', desc: "Décidez librement du % que l'entreprise prend en charge. Modifiable à tout moment." },
            { icon: <Building2 className="w-8 h-8" />, title: 'Facturation simplifiée', desc: 'Une seule facture mensuelle pour tous les abonnés de votre entreprise.' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-6 border border-[#F3E4CD] shadow-sm text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#F3E4CD] rounded-2xl text-[#5C6B65] mb-4">
                {item.icon}
              </div>
              <h3 className="font-bold text-[#3E4743] mb-2">{item.title}</h3>
              <p className="text-[#5C6B65] text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Simulateur */}
      <section id="comment" className="bg-[#F3E4CD] py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#3E4743] mb-3">
            Simulateur de prix
          </h2>
          <p className="text-center text-[#5C6B65] mb-8">Ajustez le pourcentage employeur pour voir ce que paye le salarié.</p>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E3D4BD]">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="font-semibold text-[#3E4743]">Part employeur</label>
                <span className="text-2xl font-bold text-[#5C6B65]">{employerPct}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={60}
                value={employerPct}
                onChange={(e) => setEmployerPct(Number(e.target.value))}
                className="w-full accent-amber-800 h-2 rounded-full"
              />
              <div className="flex justify-between text-xs text-[#8A8E89] mt-1">
                <span>0%</span>
                <span>60%</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-[#FBF4E9] rounded-xl p-4">
                <div className="text-xs text-[#8A8E89] uppercase tracking-wider mb-1">Prix de base (Box du mois, engagement annuel)</div>
                <div className="flex justify-between items-center">
                  <span className="text-[#3E4743] font-medium">Prix catalogue</span>
                  <span className="font-bold text-[#3E4743]">{basePrice.toFixed(2)}€ HT</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl border border-green-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm text-green-800 font-medium">Louvat offre (10%)</span>
                  </div>
                  <span className="font-bold text-green-700">-{louvat.toFixed(2)}€</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-sm text-blue-800 font-medium">Employeur ({employerPct}%)</span>
                  </div>
                  <span className="font-bold text-blue-700">-{employer.toFixed(2)}€</span>
                </div>
              </div>

              <div className="bg-[#3E4743] text-white rounded-xl p-4 flex justify-between items-center">
                <div>
                  <div className="font-bold text-lg">Le salarié paie</div>
                  <div className="text-[#E3D4BD] text-xs">Prélevé par SEPA</div>
                </div>
                <div className="text-3xl font-bold text-[#F48F98]">{employee.toFixed(2)}€ HT</div>
              </div>

              <div className="text-center text-xs text-[#8A8E89]">
                Remise totale : {((louvat + employer) / basePrice * 100).toFixed(0)}% — soit {(louvat + employer).toFixed(2)}€ d&apos;économie par mois
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-[#3E4743] mb-10">
          Comment ça marche ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          {[
            { n: '1', title: 'Inscription CE', desc: 'Vous remplissez le formulaire. Nous créons votre espace CE et vous envoyons votre code unique.' },
            { n: '2', title: 'Configuration', desc: 'Depuis votre espace, vous choisissez le % que l\'entreprise prend en charge.' },
            { n: '3', title: 'Communication', desc: 'Vous diffusez le code CE à vos salariés (prospectus trimestriel fourni par Louvat).' },
            { n: '4', title: 'Facturation', desc: 'En fin de mois, vous recevez une facture unique pour la part employeur.' },
          ].map((item) => (
            <div key={item.n}>
              <div className="w-12 h-12 bg-[#5C6B65] text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                {item.n}
              </div>
              <h4 className="font-bold text-[#3E4743] mb-2">{item.title}</h4>
              <p className="text-[#5C6B65] text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#F3E4CD] py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#3E4743] mb-10">
            Questions fréquentes
          </h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#F3E4CD] shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#FBF4E9] transition-colors"
                >
                  <span className="font-semibold text-[#3E4743] text-sm">{item.q}</span>
                  {openFaq === i ? <ChevronUp className="w-4 h-4 text-[#5C6B65] flex-shrink-0 ml-4" /> : <ChevronDown className="w-4 h-4 text-[#5C6B65] flex-shrink-0 ml-4" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-[#6B4226] border-t border-[#F3E4CD] pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire inscription */}
      <section id="inscription" className="max-w-2xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-[#3E4743] mb-3">
          Inscrire mon CE
        </h2>
        <p className="text-center text-[#5C6B65] mb-8">
          Remplissez ce formulaire. Notre équipe vous contacte sous 48h pour finaliser la mise en place.
        </p>

        <form onSubmit={handleSubmitCE} className="bg-white rounded-2xl border border-[#F3E4CD] p-8 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#3E4743] mb-1">Nom de la société *</label>
            <input
              value={ceForm.societe}
              onChange={(e) => setCeForm({ ...ceForm, societe: e.target.value })}
              required
              className="w-full border border-[#E3D4BD] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#5C6B65]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3E4743] mb-1">Nom du responsable CE *</label>
            <input
              value={ceForm.contact}
              onChange={(e) => setCeForm({ ...ceForm, contact: e.target.value })}
              required
              className="w-full border border-[#E3D4BD] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#5C6B65]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#3E4743] mb-1">Email professionnel *</label>
              <input
                type="email"
                value={ceForm.email}
                onChange={(e) => setCeForm({ ...ceForm, email: e.target.value })}
                required
                className="w-full border border-[#E3D4BD] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#5C6B65]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3E4743] mb-1">Téléphone *</label>
              <input
                type="tel"
                value={ceForm.tel}
                onChange={(e) => setCeForm({ ...ceForm, tel: e.target.value })}
                required
                className="w-full border border-[#E3D4BD] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#5C6B65]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3E4743] mb-1">Effectif de l&apos;entreprise</label>
            <select
              value={ceForm.effectif}
              onChange={(e) => setCeForm({ ...ceForm, effectif: e.target.value })}
              className="w-full border border-[#E3D4BD] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#5C6B65] bg-white"
            >
              <option value="">Sélectionner...</option>
              <option>1-10 salariés</option>
              <option>11-50 salariés</option>
              <option>51-200 salariés</option>
              <option>201-500 salariés</option>
              <option>500+ salariés</option>
            </select>
          </div>

          <div className="bg-[#F3E4CD] rounded-xl p-4 text-sm text-[#5C6B65]">
            <strong>Part employeur souhaitée :</strong>
            <div className="flex items-center gap-4 mt-2">
              <input
                type="range"
                min={0}
                max={60}
                value={employerPct}
                onChange={(e) => setEmployerPct(Number(e.target.value))}
                className="flex-1 accent-amber-800"
              />
              <span className="font-bold text-[#3E4743] text-lg w-12">{employerPct}%</span>
            </div>
            <div className="text-xs text-[#8A8E89] mt-1">Modifiable à tout moment depuis votre espace CE</div>
          </div>

          <button
            type="submit"
            disabled={sending || !ceForm.societe || !ceForm.contact || !ceForm.email || !ceForm.tel}
            className="w-full bg-[#3E4743] text-white py-4 rounded-full font-bold hover:bg-[#5C6B65] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mail className="w-5 h-5" />
            {sending ? 'Envoi en cours...' : 'Envoyer ma demande'}
          </button>
          <p className="text-xs text-center text-[#8A8E89]">Réponse sous 48h ouvrées · Sans engagement</p>
        </form>
      </section>
    </div>
  );
}

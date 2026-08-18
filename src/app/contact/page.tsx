'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { CONTACT_EMAIL } from '@/lib/contact';

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'unavailable';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('sent');
      } else if (res.status === 503) {
        setStatus('unavailable');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="bg-[#FBF4E9] min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-[#3E4743] mb-3">
            Message envoyé !
          </h2>
          <p className="text-[#5C6B65]">
            Merci {form.name || ''}, votre message a bien été transmis à notre équipe.
            Nous vous répondrons dans les plus brefs délais{form.email ? <> à <strong>{form.email}</strong></> : ''}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FBF4E9] min-h-screen">
      {/* En-tête */}
      <section className="bg-[#3E4743] text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Mail className="w-14 h-14 text-[#F48F98] mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contactez-nous
          </h1>
          <p className="text-[#E3D4BD] text-lg max-w-2xl mx-auto">
            Une question sur votre abonnement, une box ou votre Comité d&apos;Entreprise ?
            Écrivez-nous, notre équipe vous répond rapidement.
          </p>
        </div>
      </section>

      {/* Formulaire */}
      <section className="max-w-2xl mx-auto px-4 py-16">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#F3E4CD] p-8 shadow-sm space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#3E4743] mb-1">Nom *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full border border-[#E3D4BD] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#5C6B65]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3E4743] mb-1">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full border border-[#E3D4BD] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#5C6B65]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3E4743] mb-1">Téléphone (optionnel)</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-[#E3D4BD] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#5C6B65]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3E4743] mb-1">Message *</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              rows={5}
              className="w-full border border-[#E3D4BD] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#5C6B65] resize-none"
            />
          </div>

          {(status === 'error' || status === 'unavailable') && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                {status === 'unavailable'
                  ? "L'envoi automatique n'est pas encore activé sur ce site."
                  : "Une erreur est survenue lors de l'envoi."}{' '}
                En attendant, écrivez-nous directement à{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline">
                  {CONTACT_EMAIL}
                </a>.
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'sending' || !form.name || !form.email || !form.message}
            className="w-full bg-[#3E4743] text-white py-4 rounded-full font-bold hover:bg-[#5C6B65] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
            {status === 'sending' ? 'Envoi en cours...' : 'Envoyer le message'}
          </button>
          <p className="text-xs text-center text-[#8A8E89]">Réponse sous 48h ouvrées</p>
        </form>
      </section>
    </div>
  );
}

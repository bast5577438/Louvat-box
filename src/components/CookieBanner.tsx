'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie } from 'lucide-react';

const CONSENT_KEY = 'louvat_cookie_consent';

/**
 * Bandeau d'information cookies. Le site n'a aujourd'hui aucun script de
 * suivi (analytics, pixels...) : ce bandeau sert de notice + base pour
 * plus tard, pas de logique de blocage conditionnel de script nécessaire
 * pour l'instant.
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!window.localStorage.getItem(CONSENT_KEY)) setVisible(true);
  }, []);

  function choose(value: 'accepted' | 'rejected') {
    window.localStorage.setItem(CONSENT_KEY, value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-[#3E4743] text-white border-t border-[#5C6B65] shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center gap-4">
        <Cookie className="w-6 h-6 text-[#F48F98] flex-shrink-0 hidden sm:block" />
        <p className="text-sm text-[#E3D4BD] flex-1">
          Ce site utilise des cookies nécessaires à son fonctionnement. Consultez notre{' '}
          <Link href="/confidentialite" className="link-louvat text-[#F48F98]">politique de confidentialité</Link> pour en savoir plus.
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={() => choose('rejected')}
            className="border-2 border-[#E3D4BD] text-[#E3D4BD] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#5C6B65] transition-all"
          >
            Refuser
          </button>
          <button
            onClick={() => choose('accepted')}
            className="bg-[#F48F98] text-[#3E4743] px-4 py-2 rounded-full text-sm font-bold hover:bg-[#E0727C] hover:text-white transition-all"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}

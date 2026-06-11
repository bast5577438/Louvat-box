import Link from 'next/link';
import { Cookie, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Mentions légales — Louvat Box',
};

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* En-tête */}
      <div className="bg-[#3D2B1F] text-white py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-[#F4A460] text-sm mb-3">
            <Link href="/" className="hover:underline">Accueil</Link>
            <ChevronRight className="w-3 h-3" />
            <span>Mentions légales</span>
          </div>
          <div className="flex items-center gap-3">
            <Cookie className="w-6 h-6 text-[#F4A460]" />
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Mentions légales</h1>
          </div>
          <p className="text-[#D2B48C] text-sm mt-2">Dernière mise à jour : mai 2026</p>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 text-[#374151]">

        {/* Éditeur */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#3D2B1F] mb-4 pb-2 border-b border-[#F5E6D3]">1. Éditeur du site</h2>
          <div className="space-y-2 text-sm leading-relaxed">
            <p><strong>Raison sociale :</strong> Biscuiterie Louvat</p>
            <p><strong>Forme juridique :</strong> SARL</p>
            <p><strong>SIRET :</strong> 323 374 918 00015</p>
            <p><strong>N° TVA intracommunautaire :</strong> FR24 323 374 918</p>
            <p><strong>Siège social :</strong> 452 Route de Chartreuse, 38620 Saint-Geoire-en-Valdaine, Isère</p>
            <p><strong>Téléphone :</strong> <a href="tel:+33476075116" className="text-[#8B4513] hover:underline">04 76 07 51 16</a></p>
            <p><strong>Email :</strong>{' '}
              <a href="mailto:cib@biscuiterie-louvat.com" className="text-[#8B4513] hover:underline">
                cib@biscuiterie-louvat.com
              </a>
            </p>
            <p><strong>Gérante :</strong> Christelle Ivangine Bogey</p>
          </div>
        </section>

        {/* Hébergement */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#3D2B1F] mb-4 pb-2 border-b border-[#F5E6D3]">2. Hébergement</h2>
          <div className="space-y-2 text-sm leading-relaxed">
            <p><strong>Hébergeur :</strong> Vercel Inc.</p>
            <p><strong>Adresse :</strong> 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</p>
            <p><strong>Site :</strong>{' '}
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-[#8B4513] hover:underline">
                https://vercel.com
              </a>
            </p>
            <p><strong>Base de données :</strong> Supabase (infrastructure PostgreSQL hébergée en Europe)</p>
          </div>
        </section>

        {/* Propriété intellectuelle */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#3D2B1F] mb-4 pb-2 border-b border-[#F5E6D3]">3. Propriété intellectuelle</h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              L'ensemble des contenus de ce site (textes, images, photographies, logos, recettes) est la propriété exclusive de la Biscuiterie Louvat et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.
            </p>
            <p>
              Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation préalable et écrite de la Biscuiterie Louvat.
            </p>
          </div>
        </section>

        {/* Données personnelles */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#3D2B1F] mb-4 pb-2 border-b border-[#F5E6D3]">4. Données personnelles (RGPD)</h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD) n°2016/679 du 27 avril 2016, vous disposez d'un droit d'accès, de rectification, de portabilité et d'effacement de vos données.
            </p>
            <p>
              Pour en savoir plus sur la façon dont nous traitons vos données, consultez notre{' '}
              <Link href="/confidentialite" className="text-[#8B4513] hover:underline font-medium">
                Politique de confidentialité
              </Link>.
            </p>
          </div>
        </section>

        {/* Cookies */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#3D2B1F] mb-4 pb-2 border-b border-[#F5E6D3]">5. Cookies</h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              Ce site utilise uniquement des cookies techniques strictement nécessaires au fonctionnement du service (session de connexion espace admin). Aucun cookie publicitaire ou de traçage tiers n'est utilisé.
            </p>
          </div>
        </section>

        {/* Liens */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#3D2B1F] mb-4 pb-2 border-b border-[#F5E6D3]">6. Liens hypertextes</h2>
          <p className="text-sm leading-relaxed">
            La Biscuiterie Louvat décline toute responsabilité quant au contenu des sites vers lesquels des liens hypertextes pourraient pointer depuis ce site. La mise en place de liens vers des pages de ce site est soumise à l'accord préalable de l'éditeur.
          </p>
        </section>

        {/* Droit applicable */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#3D2B1F] mb-4 pb-2 border-b border-[#F5E6D3]">7. Droit applicable</h2>
          <p className="text-sm leading-relaxed">
            Le présent site et ses mentions légales sont soumis au droit français. En cas de litige, les tribunaux français seront seuls compétents.
          </p>
        </section>

        {/* Contact */}
        <div className="bg-[#F5E6D3] rounded-2xl p-5 text-sm text-[#3D2B1F]">
          <strong>Des questions ?</strong>{' '}
          Contactez-nous à{' '}
          <a href="mailto:cib@biscuiterie-louvat.com" className="text-[#8B4513] hover:underline font-medium">
            cib@biscuiterie-louvat.com
          </a>
        </div>
      </div>
    </main>
  );
}

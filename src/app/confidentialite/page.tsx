import Link from 'next/link';
import { Cookie, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Politique de confidentialité — Louvat Box',
};

export default function ConfidentialitePage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* En-tête */}
      <div className="bg-[#3D2B1F] text-white py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-[#F4A460] text-sm mb-3">
            <Link href="/" className="hover:underline">Accueil</Link>
            <ChevronRight className="w-3 h-3" />
            <span>Confidentialité</span>
          </div>
          <div className="flex items-center gap-3">
            <Cookie className="w-6 h-6 text-[#F4A460]" />
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Politique de confidentialité</h1>
          </div>
          <p className="text-[#D2B48C] text-sm mt-2">Dernière mise à jour : mai 2026 — Conforme au RGPD</p>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 text-[#374151]">

        {/* Introduction */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#3D2B1F] mb-4 pb-2 border-b border-[#F5E6D3]">1. Introduction</h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              La Biscuiterie Louvat (ci-après « Louvat ») attache une grande importance à la protection de vos données personnelles. La présente politique de confidentialité vous informe sur la façon dont nous collectons, utilisons et protégeons vos données conformément au <strong>Règlement Général sur la Protection des Données (RGPD)</strong> n°2016/679 et à la loi Informatique et Libertés.
            </p>
            <p>
              <strong>Responsable du traitement :</strong> Biscuiterie Louvat — contact@louvat-biscuits.fr — Saint-Geoire-en-Valdaine, 38620 Isère
            </p>
          </div>
        </section>

        {/* Données collectées */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#3D2B1F] mb-4 pb-2 border-b border-[#F5E6D3]">2. Données collectées</h2>
          <div className="space-y-4 text-sm leading-relaxed">
            <p>Lors de votre abonnement, nous collectons les données suivantes :</p>

            <div className="overflow-hidden rounded-xl border border-gray-100">
              <table className="w-full text-sm">
                <thead className="bg-[#F5E6D3]">
                  <tr>
                    <th className="text-left px-4 py-2 text-[#3D2B1F] font-semibold">Donnée</th>
                    <th className="text-left px-4 py-2 text-[#3D2B1F] font-semibold">Finalité</th>
                    <th className="text-left px-4 py-2 text-[#3D2B1F] font-semibold">Base légale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr>
                    <td className="px-4 py-2 font-medium">Nom, prénom</td>
                    <td className="px-4 py-2">Gestion de l'abonnement, livraison</td>
                    <td className="px-4 py-2 text-[#8B4513]">Contrat</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 font-medium">Adresse email</td>
                    <td className="px-4 py-2">Confirmation, notifications, prospectus</td>
                    <td className="px-4 py-2 text-[#8B4513]">Contrat / Intérêt légitime</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium">Adresse postale</td>
                    <td className="px-4 py-2">Livraison de la box</td>
                    <td className="px-4 py-2 text-[#8B4513]">Contrat</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 font-medium">IBAN / RIB</td>
                    <td className="px-4 py-2">Prélèvement SEPA mensuel ou trimestriel</td>
                    <td className="px-4 py-2 text-[#8B4513]">Contrat</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium">Code CE</td>
                    <td className="px-4 py-2">Application de la remise employeur</td>
                    <td className="px-4 py-2 text-[#8B4513]">Contrat</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 font-medium">Préférences box</td>
                    <td className="px-4 py-2">Personnalisation de la sélection</td>
                    <td className="px-4 py-2 text-[#8B4513]">Contrat</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-gray-400 italic">
              Nous ne collectons pas de données dites « sensibles » (santé, opinions politiques, religion, etc.).
            </p>
          </div>
        </section>

        {/* Destinataires */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#3D2B1F] mb-4 pb-2 border-b border-[#F5E6D3]">3. Destinataires des données</h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>Vos données sont traitées uniquement par :</p>
            <ul className="list-disc ml-5 space-y-2">
              <li>La Biscuiterie Louvat (gestion des abonnements, préparation des boxes)</li>
              <li><strong>Supabase</strong> — base de données hébergée en Europe (UE)</li>
              <li><strong>Vercel</strong> — hébergeur du site (serveurs internationaux)</li>
              <li>Le transporteur (Colissimo / La Poste) — pour la livraison uniquement</li>
              <li>Votre <strong>Comité d'Entreprise</strong> — uniquement la confirmation de l'abonnement et le code utilisé</li>
            </ul>
            <p>
              <strong>Nous ne vendons, ni ne louons vos données à des tiers.</strong>
            </p>
          </div>
        </section>

        {/* Durée de conservation */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#3D2B1F] mb-4 pb-2 border-b border-[#F5E6D3]">4. Durée de conservation</h2>
          <div className="space-y-2 text-sm leading-relaxed">
            <ul className="list-disc ml-5 space-y-2">
              <li><strong>Données de compte :</strong> conservées pendant toute la durée de l'abonnement, puis 3 ans après résiliation (délai de prescription commerciale)</li>
              <li><strong>Données de paiement (IBAN) :</strong> conservées 13 mois après le dernier prélèvement (réglementation bancaire)</li>
              <li><strong>Données de prospection :</strong> 3 ans après le dernier contact</li>
            </ul>
          </div>
        </section>

        {/* Vos droits */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#3D2B1F] mb-4 pb-2 border-b border-[#F5E6D3]">5. Vos droits</h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { droit: 'Accès', desc: 'Obtenir une copie de vos données' },
                { droit: 'Rectification', desc: 'Corriger des données inexactes' },
                { droit: 'Effacement', desc: 'Demander la suppression de vos données' },
                { droit: 'Portabilité', desc: 'Recevoir vos données dans un format structuré' },
                { droit: 'Opposition', desc: "S'opposer à certains traitements" },
                { droit: 'Limitation', desc: 'Restreindre temporairement l\'utilisation' },
              ].map(({ droit, desc }) => (
                <div key={droit} className="bg-[#FAF0E6] rounded-lg p-3">
                  <div className="font-semibold text-[#8B4513] text-xs">{droit}</div>
                  <div className="text-gray-600 text-xs mt-0.5">{desc}</div>
                </div>
              ))}
            </div>
            <p className="mt-3">
              Pour exercer vos droits, contactez-nous à{' '}
              <a href="mailto:contact@louvat-biscuits.fr" className="text-[#8B4513] hover:underline">
                contact@louvat-biscuits.fr
              </a>{' '}
              avec une pièce d'identité. Nous répondrons dans un délai de <strong>30 jours</strong>.
            </p>
            <p>
              Vous avez également le droit de déposer une réclamation auprès de la{' '}
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-[#8B4513] hover:underline">
                CNIL
              </a>{' '}
              (Commission Nationale de l'Informatique et des Libertés).
            </p>
          </div>
        </section>

        {/* Sécurité */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#3D2B1F] mb-4 pb-2 border-b border-[#F5E6D3]">6. Sécurité des données</h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              Louvat met en œuvre les mesures techniques et organisationnelles appropriées pour protéger vos données contre toute perte, accès non autorisé ou divulgation :
            </p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Communication chiffrée via HTTPS (TLS 1.3)</li>
              <li>Base de données sécurisée avec contrôle d'accès strict (Supabase Row Level Security)</li>
              <li>Accès administrateur protégé par mot de passe</li>
              <li>Aucun stockage de numéros de carte bancaire (paiement SEPA uniquement)</li>
            </ul>
          </div>
        </section>

        {/* Cookies */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#3D2B1F] mb-4 pb-2 border-b border-[#F5E6D3]">7. Cookies</h2>
          <div className="space-y-2 text-sm leading-relaxed">
            <p>
              Ce site utilise uniquement des <strong>cookies techniques strictement nécessaires</strong> au fonctionnement du service (maintien de la session admin). Aucun cookie publicitaire, analytics ou tiers n'est déposé sans votre consentement.
            </p>
          </div>
        </section>

        {/* Modifications */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#3D2B1F] mb-4 pb-2 border-b border-[#F5E6D3]">8. Modifications</h2>
          <p className="text-sm leading-relaxed">
            Cette politique peut être mise à jour. Toute modification substantielle vous sera notifiée par email ou via une bannière sur le site. La date de dernière mise à jour est indiquée en haut de cette page.
          </p>
        </section>

        {/* Contact */}
        <div className="bg-[#F5E6D3] rounded-2xl p-5 text-sm text-[#3D2B1F]">
          <strong>Une question sur vos données ?</strong>{' '}
          Contactez notre responsable protection des données à{' '}
          <a href="mailto:contact@louvat-biscuits.fr" className="text-[#8B4513] hover:underline font-medium">
            contact@louvat-biscuits.fr
          </a>
          {' '}— Réponse garantie sous 30 jours.
        </div>
      </div>
    </main>
  );
}

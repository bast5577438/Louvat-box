import Link from 'next/link';
import { Cookie, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Conditions Générales de Vente — Louvat Box',
};

export default function CGVPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* En-tête */}
      <div className="bg-[#3E4743] text-white py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-[#F48F98] text-sm mb-3">
            <Link href="/" className="hover:underline">Accueil</Link>
            <ChevronRight className="w-3 h-3" />
            <span>CGV</span>
          </div>
          <div className="flex items-center gap-3">
            <Cookie className="w-6 h-6 text-[#F48F98]" />
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Conditions Générales de Vente</h1>
          </div>
          <p className="text-[#E3D4BD] text-sm mt-2">Dernière mise à jour : juin 2026</p>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 text-[#374151]">

        {/* Objet */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#3E4743] mb-4 pb-2 border-b border-[#F3E4CD]">1. Objet</h2>
          <p className="text-sm leading-relaxed">
            Les présentes Conditions Générales de Vente (CGV) régissent les abonnements aux boxes de biscuits artisanaux proposés par la Biscuiterie Louvat via le site <strong>box.louvat-biscuits.fr</strong>. Tout abonnement implique l'acceptation pleine et entière des présentes CGV.
          </p>
        </section>

        {/* Offres */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#3E4743] mb-4 pb-2 border-b border-[#F3E4CD]">2. Description des offres</h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>Louvat Box propose plusieurs box d&apos;abonnement :</p>
            <div className="bg-[#F6EBDB] rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center py-1 border-b border-[#F3E4CD]">
                <span><strong>Box Découverte</strong> — 3 références, 1,5 kg de biscuits</span>
                <span className="font-semibold text-[#5C6B65]">dès 30 € HT/mois</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#F3E4CD]">
                <span><strong>Box Gourmande</strong> — 6 références, 3 kg de biscuits</span>
                <span className="font-semibold text-[#5C6B65]">dès 65 € HT/mois</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span><strong>Box Prestige</strong> — 10 références, 5 kg de biscuits</span>
                <span className="font-semibold text-[#5C6B65]">dès 100 € HT/mois</span>
              </div>
            </div>
            <p>
              Les prix affichés sont en euros HT (hors taxes) et varient selon le niveau d&apos;engagement choisi : <strong>sans engagement</strong>, <strong>engagement trimestriel</strong> ou <strong>engagement annuel</strong>. Plus l&apos;engagement est long, plus le tarif mensuel est avantageux. Pour les abonnements souscrits via un <strong>code Comité d&apos;Entreprise (CE)</strong>, Louvat applique en plus une réduction systématique de <strong>10 %</strong> sur le prix de base, en complément de la prise en charge par l&apos;employeur.
            </p>
          </div>
        </section>

        {/* Abonnement */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#3E4743] mb-4 pb-2 border-b border-[#F3E4CD]">3. Souscription de l'abonnement</h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>L'abonnement est souscrit directement en ligne sur le site, après avoir :</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Choisi une box (Découverte, Gourmande ou Prestige) et un niveau d&apos;engagement (sans engagement, trimestriel ou annuel)</li>
              <li>Renseigné les informations personnelles (nom, prénom, adresse, email)</li>
              <li>Saisi un code CE si applicable</li>
              <li>Accepté les présentes CGV et le mandat de prélèvement SEPA</li>
            </ul>
            <p>La confirmation de l'abonnement est envoyée par email à l'adresse renseignée.</p>
          </div>
        </section>

        {/* Paiement */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#3E4743] mb-4 pb-2 border-b border-[#F3E4CD]">4. Paiement — Mandat SEPA</h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              Le paiement s'effectue par <strong>prélèvement bancaire SEPA</strong>. En souscrivant, vous signez un mandat de prélèvement SEPA autorisant la Biscuiterie Louvat à débiter votre compte bancaire selon la fréquence choisie.
            </p>
            <p>
              En cas de code CE avec participation employeur, la part employeur est déduite du montant prélevé. Seule la part salarié vous est facturée.
            </p>
            <p>
              Le prélèvement est effectué mensuellement, le 1er ou le 5 de chaque mois selon votre date d&apos;inscription.
            </p>
          </div>
        </section>

        {/* Livraison */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#3E4743] mb-4 pb-2 border-b border-[#F3E4CD]">5. Livraison</h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>Les boxes sont expédiées en France métropolitaine uniquement. La livraison est assurée par un transporteur partenaire.</p>
            <p>Les délais de livraison sont de <strong>3 à 5 jours ouvrés</strong> à compter de l'expédition. Un email de suivi vous est transmis lors de l'expédition.</p>
            <p>En cas d'abonnement via CE, les boxes peuvent être livrées en une ou plusieurs livraisons selon les modalités définies avec l'entreprise partenaire.</p>
          </div>
        </section>

        {/* Rétractation */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#3E4743] mb-4 pb-2 border-b border-[#F3E4CD]">6. Droit de rétractation</h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              Conformément à l'article L221-18 du Code de la consommation, vous disposez d'un délai de <strong>14 jours</strong> à compter de la confirmation de votre abonnement pour exercer votre droit de rétractation, sans motif à fournir.
            </p>
            <p>
              Pour exercer ce droit, adressez un email à{' '}
              <a href="mailto:cib@biscuiterie-louvat.com" className="text-[#5C6B65] hover:underline">cib@biscuiterie-louvat.com</a>{' '}
              avec la mention « Rétractation » et vos coordonnées. Le remboursement sera effectué sous 14 jours.
            </p>
            <p className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-amber-800">
              <strong>Attention :</strong> Le droit de rétractation ne s'applique pas aux boxes déjà expédiées ou aux produits alimentaires ouverts.
            </p>
          </div>
        </section>

        {/* Résiliation */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#3E4743] mb-4 pb-2 border-b border-[#F3E4CD]">7. Résiliation</h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              Vous pouvez résilier votre abonnement à tout moment depuis votre espace personnel ou en contactant{' '}
              <a href="mailto:cib@biscuiterie-louvat.com" className="text-[#5C6B65] hover:underline">cib@biscuiterie-louvat.com</a>.
            </p>
            <p>
              Pour un abonnement <strong>sans engagement</strong>, la résiliation prend effet à la fin du mois en cours, sans frais ni justification. Pour un abonnement avec <strong>engagement trimestriel ou annuel</strong>, celui-ci ne peut être résilié avant le terme de la période d&apos;engagement souscrite ; passé ce terme, il devient résiliable à tout moment dans les mêmes conditions. Aucun remboursement partiel n&apos;est effectué pour la période déjà débutée.
            </p>
          </div>
        </section>

        {/* Réclamations */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#3E4743] mb-4 pb-2 border-b border-[#F3E4CD]">8. Réclamations & Service client</h2>
          <div className="space-y-2 text-sm leading-relaxed">
            <p>
              Pour toute réclamation relative à votre abonnement ou à la qualité d'un produit, contactez-nous à{' '}
              <a href="mailto:cib@biscuiterie-louvat.com" className="text-[#5C6B65] hover:underline">cib@biscuiterie-louvat.com</a>{' '}
              dans un délai de 8 jours après réception.
            </p>
            <p>
              En cas de litige non résolu, vous pouvez recourir à la médiation de la consommation conformément aux articles L612-1 et suivants du Code de la consommation.
            </p>
          </div>
        </section>

        {/* Droit applicable */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#3E4743] mb-4 pb-2 border-b border-[#F3E4CD]">9. Droit applicable</h2>
          <p className="text-sm leading-relaxed">
            Les présentes CGV sont soumises au droit français. En cas de litige, les tribunaux du ressort du siège social de la Biscuiterie Louvat seront compétents.
          </p>
        </section>

        {/* Contact */}
        <div className="bg-[#F3E4CD] rounded-2xl p-5 text-sm text-[#3E4743]">
          <strong>Des questions sur votre abonnement ?</strong>{' '}
          Écrivez-nous à{' '}
          <a href="mailto:cib@biscuiterie-louvat.com" className="text-[#5C6B65] hover:underline font-medium">
            cib@biscuiterie-louvat.com
          </a>
        </div>
      </div>
    </main>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Package, Star, Building2, ArrowRight, Truck, Users } from 'lucide-react';
import { biscuits, BOX_PRICE, estimerPersonnes, PORTION_GRAMMES_PAR_PERSONNE } from '@/lib/data';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'Louvat Box — La box de biscuits artisanaux, pour les entreprises et les CE',
  description:
    "Chaque mois, la Biscuiterie Louvat sélectionne 3 produits artisanaux (500g). Pour les entreprises (salle de pause) et via les comités d'entreprise, par prélèvement SEPA.",
};

export default function HomePage() {
  const featured = biscuits.slice(0, 4);
  const exempleQuantite = 5;

  return (
    <div className="bg-[#FBF4E9]">

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#3E4743] text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/biscuits/indecent.webp"
          alt="L'Indécent — anti-gaspi, biscuit Bestseller Louvat"
          className="absolute inset-0 w-full h-full object-cover slowzoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#3E4743]/95 via-[#3E4743]/90 to-[#3E4743]" />
        <div className="relative max-w-4xl mx-auto px-4 pt-20 pb-10 text-center">
          <Reveal>
            <span className="eyebrow inline-block bg-[#F48F98] text-[#3E4743] px-3 py-1 rounded-full mb-4">
              Biscuits artisanaux
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              La box de <span className="text-[#F48F98]">biscuits Louvat</span>,<br />
              chaque mois
            </h1>
            <p className="text-lg text-[#E3D4BD] mb-2 max-w-xl mx-auto">
              Chaque mois, la biscuiterie sélectionne avec soin 3 produits (500g chacun), identiques pour tous.
            </p>
            <p className="text-[#F48F98] font-semibold mb-3">Vous êtes une entreprise, ou salarié·e avec un code CE ?</p>
            <p className="text-xs text-[#8A8E89] mb-10">Livraison de septembre à juin · 1er mois : box + mini plateau vintage Louvat offerts</p>
          </Reveal>
        </div>

        {/* Fork : le parcours démarre ici */}
        <div className="relative max-w-4xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Reveal delay={1}>
              <Link
                href="/entreprise"
                className="group block h-full bg-white/5 border-2 border-white/15 hover:border-[#F48F98] rounded-3xl p-7 text-left transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                <Building2 className="w-9 h-9 text-[#F48F98] mb-4" />
                <h2 className="text-xl font-bold mb-1">Je suis une entreprise</h2>
                <p className="text-sm text-[#E3D4BD] mb-4">
                  Commandez la box du mois pour votre salle de pause. Quantité libre, estimation du nombre de personnes servies.
                </p>
                <span className="inline-flex items-center gap-2 text-[#F48F98] font-semibold text-sm group-hover:gap-3 transition-all">
                  Commander pour l&apos;entreprise <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </Reveal>
            <Reveal delay={2}>
              <Link
                href="/abonnement"
                className="group block h-full bg-white/5 border-2 border-white/15 hover:border-[#F48F98] rounded-3xl p-7 text-left transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                <Users className="w-9 h-9 text-[#F48F98] mb-4" />
                <h2 className="text-xl font-bold mb-1">Je suis salarié·e, avec un code CE</h2>
                <p className="text-sm text-[#E3D4BD] mb-4">
                  10% offerts par Louvat, le reste pris en charge par votre employeur. Prélèvement SEPA mensuel.
                </p>
                <span className="inline-flex items-center gap-2 text-[#F48F98] font-semibold text-sm group-hover:gap-3 transition-all">
                  M&apos;abonner avec mon code CE <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </Reveal>
          </div>
          <div className="text-center mt-6">
            <Link href="/box" className="link-louvat text-[#E3D4BD] text-sm">Voir la box du mois avant de choisir</Link>
          </div>
        </div>

        <div className="relative px-4 pb-8 md:pb-12">
          <div className="max-w-4xl mx-auto bg-[#2A302D]/75 backdrop-blur-md rounded-3xl px-6 py-6 flex flex-wrap justify-center gap-6 text-center shadow-xl">
            {[
              { val: '3', label: 'Produits, 500g chacun' },
              { val: '400+', label: 'Abonnés satisfaits' },
              { val: '1954', label: 'Maison de qualité depuis' },
              { val: '100%', label: 'Pur beurre & Artisanal' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-[#F48F98] font-bold text-xl">{s.val}</div>
                <div className="text-[#8A8E89] text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LES 3 VALEURS LOUVAT */}
      <Reveal className="block">
        <section className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <p className="text-[#E0727C] italic font-medium mb-2">
              Lovée au pied des Alpes, notre Biscuiterie est avant tout une histoire de passionnés !
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#3E4743]">
              Maison de qualité depuis 1954
            </h2>
            <p className="text-[#5C6B65] mt-3">Saint-Geoire-en-Valdaine · Recettes de Patrick Casula, Champion du Monde de Pâtisserie</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Star className="w-8 h-8" />, title: 'Tradition', desc: 'Plus de 60 ans de recettes inchangées. Chaque biscuit est fabriqué selon les méthodes artisanales transmises depuis 1954.' },
              { icon: <Package className="w-8 h-8" />, title: 'Qualité', desc: '100% pur beurre, arômes naturels, fournisseurs locaux. Des ingrédients sélectionnés avec soin pour un goût incomparable.' },
              { icon: <Truck className="w-8 h-8" />, title: 'Plaisir', desc: 'Recettes développées avec Patrick Casula, Champion du Monde de Pâtisserie. Chaque bouchée est une expérience gourmande.' },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F3E4CD] rounded-2xl text-[#5C6B65] mb-4 shadow-sm">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-[#3E4743] mb-3">{item.title}</h3>
                <p className="text-[#6B4226] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* COMMENT ÇA MARCHE */}
      <Reveal className="block">
        <section className="bg-[#3E4743] text-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">
              Comment ça marche ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '1', icon: <Star className="w-8 h-8" />, title: 'La box du mois', desc: '3 produits (500g chacun) sélectionnés avec soin par la biscuiterie, identiques pour tous les abonnés.' },
                { step: '2', icon: <Package className="w-8 h-8" />, title: 'Entreprise ou code CE', desc: "Une entreprise commande la quantité voulue pour sa salle de pause, ou un salarié s'abonne avec le code CE de son entreprise partenaire." },
                { step: '3', icon: <Truck className="w-8 h-8" />, title: 'Recevez votre box', desc: 'Livrée à domicile ou en entreprise, emballée avec soin depuis Saint-Geoire-en-Valdaine. Prélèvement SEPA automatique.' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-[#2A302D] rounded-2xl text-[#F48F98] mb-4">
                    {item.icon}
                  </div>
                  <div className="eyebrow text-[#F48F98] mb-2">Étape {item.step}</div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-[#E3D4BD] text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* APERÇU BISCUITS */}
      <Reveal className="block">
        <section className="bg-[#F3E4CD] py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#3E4743]">
                  Nos biscuits artisanaux
                </h2>
                <p className="text-[#5C6B65] mt-2">Fabriqués à Saint-Geoire-en-Valdaine depuis 1954. Recettes de Patrick Casula, Champion du Monde de Pâtisserie.</p>
              </div>
              <Link href="/box" className="link-louvat flex items-center gap-2 font-semibold whitespace-nowrap">
                Voir la box du mois <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featured.map((b, i) => (
                <Reveal key={b.id} delay={(i % 3) as 0 | 1 | 2} className="block h-full">
                <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#F48F98]/20 h-full">
                  <div className="relative overflow-hidden">
                    {b.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={b.image} alt={b.name} className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-32 flex items-center justify-center text-3xl bg-[#F3E4CD]">🍪</div>
                    )}
                    {b.badge && (
                      <span className="absolute top-2 left-2 inline-block bg-[#F48F98] text-[#3E4743] text-xs font-bold px-2 py-0.5 rounded-full">
                        {b.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-[#3E4743] text-sm mb-1">{b.name}</h4>
                    <p className="text-[#8A8E89] text-xs">{b.description}</p>
                  </div>
                </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* NOS OFFRES */}
      <Reveal className="block">
        <section className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3E4743]">
              Nos offres
            </h2>
            <p className="text-[#5C6B65] mt-3">Box du mois · Prélèvement SEPA · Sans engagement, trimestriel ou annuel</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Entreprises */}
            <div className="rounded-2xl p-8 border-2 border-[#F3E4CD] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <Building2 className="w-10 h-10 text-[#5C6B65] mb-4" />
              <h3 className="text-xl font-bold mb-1 text-[#3E4743]">Entreprises</h3>
              <p className="text-sm mb-3 text-[#5C6B65]">Plusieurs box du mois pour votre salle de pause, quantité libre.</p>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-sm text-[#8A8E89]">à partir de</span>
                <span className="text-4xl font-bold text-[#3E4743]">{BOX_PRICE.annuel}€</span>
                <span className="text-sm text-[#8A8E89]">HT/box/mois</span>
              </div>
              <div className="flex items-start gap-2 bg-[#F3E4CD] rounded-xl p-3 mb-6 text-xs text-[#5C6B65]">
                <Users className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Exemple : {exempleQuantite} box conviennent à environ {estimerPersonnes(exempleQuantite)} personnes (~{PORTION_GRAMMES_PAR_PERSONNE}g/personne en partage).</span>
              </div>
              <ul className="space-y-2 mb-6">
                {['Quantité selon vos effectifs', 'Sans engagement, trimestriel ou annuel', 'Livraison incluse', 'Prélèvement SEPA sécurisé'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-[#3E4743]">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 text-green-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/entreprise" className="block text-center py-3 rounded-full font-semibold transition-all bg-[#3E4743] text-white hover:bg-[#5C6B65]">
                Commander pour mon entreprise
              </Link>
            </div>

            {/* CE salarié */}
            <div className="rounded-2xl p-8 border-2 border-[#F48F98] bg-[#3E4743] text-white shadow-xl relative transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F48F98] text-[#3E4743] text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                ⭐ Financement partagé
              </span>
              <Users className="w-10 h-10 text-[#F48F98] mb-4" />
              <h3 className="text-xl font-bold mb-1">Comité d&apos;Entreprise</h3>
              <p className="text-sm mb-3 text-[#E3D4BD]">Réservé aux salarié·es d&apos;une entreprise partenaire, avec un code CE.</p>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-sm text-[#E3D4BD]">à partir de</span>
                <span className="text-4xl font-bold">{BOX_PRICE.annuel}€</span>
                <span className="text-sm text-[#E3D4BD]">HT/mois, avant remise</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-center text-xs mb-6 pb-4 border-b border-[#5C3D2E] text-[#E3D4BD]">
                <div>
                  <div className="font-bold text-sm text-white">10%</div>
                  <div>Offert par Louvat</div>
                </div>
                <div>
                  <div className="font-bold text-sm text-white">X%</div>
                  <div>Pris par l&apos;employeur</div>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                {['Box du mois, un unique format', 'Sans engagement, trimestriel ou annuel', 'Livraison incluse', 'Prélèvement SEPA sécurisé'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-[#F3E4CD]">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 text-[#F48F98]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/abonnement" className="block text-center py-3 rounded-full font-semibold transition-all bg-[#F48F98] text-[#3E4743] hover:bg-[#E0727C] hover:text-white">
                M&apos;abonner avec mon code CE
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      {/* CE — argumentaire */}
      <Reveal className="block">
        <section className="bg-[#3E4743] text-white py-16">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="flex-1">
              <Building2 className="w-12 h-12 text-[#F48F98] mx-auto md:mx-0 mb-4" />
              <h2 className="text-3xl font-bold mb-3">
                Et si vos pauses café avaient plus d&apos;impact que prévu ?
              </h2>
              <p className="text-[#E3D4BD] max-w-lg mb-3">
                Chaque box que vous recevez, ce n&apos;est pas juste des biscuits à partager en équipe : c&apos;est une contribution directe à des producteurs et artisans locaux, sélectionnés avec exigence.
              </p>
              <p className="text-[#F48F98] font-semibold max-w-lg mb-3">
                La Box LOUVAT, c&apos;est la pause qui a du sens !
              </p>
              <p className="text-[#E3D4BD] max-w-lg">
                Avec un financement partagé : l&apos;employeur prend en charge une partie, Louvat offre 10% — le salarié ne paie que le reste.
              </p>
            </div>
            <div className="flex-shrink-0 flex flex-col items-center gap-4">
              <div className="flex gap-4 text-center">
                <div className="bg-[#2A302D] rounded-xl p-4">
                  <div className="text-2xl font-bold text-[#F48F98]">10%</div>
                  <div className="text-xs text-[#8A8E89]">offerts par Louvat</div>
                </div>
                <div className="bg-[#2A302D] rounded-xl p-4">
                  <div className="text-2xl font-bold text-[#F48F98]">X%</div>
                  <div className="text-xs text-[#8A8E89]">pris par l&apos;employeur</div>
                </div>
              </div>
              <Link
                href="/ce"
                className="bg-[#F48F98] text-[#3E4743] px-6 py-3 rounded-full font-bold hover:bg-[#E0727C] hover:text-white transition-all w-full text-center"
              >
                En savoir plus →
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      {/* TÉMOIGNAGES */}
      <Reveal className="block">
        <section className="max-w-6xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center text-[#3E4743] mb-12">
            Ce que disent nos abonnés
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Marie L.', text: "Les sablés bretons sont à tomber. Je reçois ma box depuis 6 mois et je ne me lasse pas !", stars: 5 },
              { name: 'Thomas B.', text: "Super concept ! La sélection change chaque mois, la qualité artisanale se ressent vraiment.", stars: 5 },
              { name: 'Sophie M.', text: "Notre CE a souscrit pour toute l'entreprise. Les collègues adorent ! La gestion est simple.", stars: 5 },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i as 0 | 1 | 2} className="block h-full">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F3E4CD] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <span key={i} className="text-[#F48F98]">★</span>
                  ))}
                </div>
                <p className="text-[#6B4226] italic mb-4">&ldquo;{t.text}&rdquo;</p>
                <div className="font-semibold text-[#3E4743] text-sm">{t.name}</div>
              </div>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>

      {/* CTA FINAL */}
      <Reveal className="block">
        <section className="bg-[#F3E4CD] py-16 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <div className="text-5xl mb-4">🍪</div>
            <h2 className="text-3xl font-bold text-[#3E4743] mb-4">
              Prêt à vous régaler ?
            </h2>
            <p className="text-[#5C6B65] mb-2">À partir de {BOX_PRICE.annuel}€ HT/mois/box. Sans engagement possible. Résiliable à tout moment.</p>
            <p className="text-[#E0727C] italic mb-8">... c&apos;est le début d&apos;une grande histoire d&apos;amour.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/entreprise"
                className="inline-flex items-center justify-center gap-2 bg-[#3E4743] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#5C6B65] transition-all shadow-lg"
              >
                Je suis une entreprise <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/abonnement"
                className="inline-flex items-center justify-center gap-2 bg-[#F48F98] text-[#3E4743] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#E0727C] hover:text-white transition-all shadow-lg"
              >
                J&apos;ai un code CE <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}

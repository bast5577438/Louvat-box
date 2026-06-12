import Link from 'next/link';
import { CheckCircle, Package, Star, Building2, ArrowRight, Truck } from 'lucide-react';
import { biscuits, boxSizes } from '@/lib/data';

export default function HomePage() {
  const featured = biscuits.slice(0, 4);

  return (
    <div className="bg-[#FBF4E9]">

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#3E4743] text-white">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #F48F98 0%, transparent 60%), radial-gradient(circle at 80% 20%, #E0727C 0%, transparent 50%)' }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block bg-[#F48F98] text-[#3E4743] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
              Biscuits artisanaux
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Votre box de<br />
              <span className="text-[#F48F98]">biscuits Louvat</span><br />
              chaque mois
            </h1>
            <p className="text-lg text-[#E3D4BD] mb-6 max-w-md">
              Sélectionnez vos biscuits préférés parmi notre gamme artisanale. Livraison mensuelle, prélèvement SEPA sans engagement, trimestriel ou annuel.
            </p>
            <div className="flex justify-center md:justify-start mb-8">
              <ul className="space-y-2 text-left">
                {[
                  'Une sélection différente chaque mois, au fil des saisons',
                  'Livraison de septembre à juin (pause en juillet-août)',
                  '1er mois : box + mini plateau vintage Louvat offerts',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#F3E4CD]">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 text-[#F48F98] mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/abonnement"
                className="bg-[#F48F98] text-[#3E4743] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#E0727C] hover:text-white transition-all shadow-lg flex items-center justify-center gap-2"
              >
                Je m&apos;abonne <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/box"
                className="border-2 border-[#F48F98] text-[#F48F98] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#F48F98] hover:text-[#3E4743] transition-all text-center"
              >
                Voir les biscuits
              </Link>
            </div>
          </div>

          {/* Visual */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-72 h-72 md:w-80 md:h-80">
              <div className="absolute inset-0 bg-[#5C6B65] rounded-3xl rotate-6 opacity-30" />
              <div className="absolute inset-0 bg-[#F3E4CD] rounded-3xl flex flex-col items-center justify-center p-6 shadow-2xl">
                <div className="text-6xl mb-4">🍪</div>
                <div className="text-[#3E4743] font-bold text-xl mb-3" style={{ fontFamily: 'Georgia, serif' }}>Louvat Box</div>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {['🍪','🧁','🍫','🥜','🌙','🎂'].map((e, i) => (
                    <div key={i} className="bg-white rounded-xl p-2 text-center shadow-sm text-xl">{e}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative bg-[#2A302D] py-4">
          <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center md:justify-around gap-6 text-center">
            {[
              { val: '12+', label: 'Variétés de biscuits' },
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
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-[#E0727C] italic font-medium mb-2">
            Lovée au pied des Alpes, notre Biscuiterie est avant tout une histoire de passionnés !
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#3E4743]" style={{ fontFamily: 'Georgia, serif' }}>
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
              <h3 className="text-xl font-bold text-[#3E4743] mb-3" style={{ fontFamily: 'Georgia, serif' }}>{item.title}</h3>
              <p className="text-[#6B4226] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="bg-[#3E4743] text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10" style={{ fontFamily: 'Georgia, serif' }}>
            Comment ça marche ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', icon: <Star className="w-8 h-8" />, title: 'Choisissez vos biscuits', desc: 'Parcourez le catalogue Louvat et sélectionnez vos références préférées : palets, sablés, financiers, meringues...' },
              { step: '2', icon: <Package className="w-8 h-8" />, title: 'Choisissez votre engagement', desc: "Sans engagement, trimestriel ou annuel : plus l'engagement est long, plus le tarif mensuel est avantageux. Prélèvement SEPA automatique." },
              { step: '3', icon: <Truck className="w-8 h-8" />, title: 'Recevez votre box', desc: 'Votre box Louvat livrée à domicile, emballée avec soin depuis Saint-Geoire-en-Valdaine.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#2A302D] rounded-2xl text-[#F48F98] mb-4">
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-[#F48F98] uppercase tracking-widest mb-2">Étape {item.step}</div>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>{item.title}</h3>
                <p className="text-[#E3D4BD] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APERÇU BISCUITS */}
      <section className="bg-[#F3E4CD] py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#3E4743]" style={{ fontFamily: 'Georgia, serif' }}>
                Nos biscuits artisanaux
              </h2>
              <p className="text-[#5C6B65] mt-2">Fabriqués à Saint-Geoire-en-Valdaine depuis 1954. Recettes de Patrick Casula, Champion du Monde de Pâtisserie.</p>
            </div>
            <Link href="/box" className="flex items-center gap-2 text-[#5C6B65] font-semibold hover:text-[#3E4743] transition-colors whitespace-nowrap">
              Voir tous les biscuits <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-[#F48F98]/20">
                {b.badge && (
                  <span className="inline-block bg-[#F48F98] text-[#3E4743] text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                    {b.badge}
                  </span>
                )}
                <div className="text-3xl mb-3">🍪</div>
                <h4 className="font-bold text-[#3E4743] text-sm mb-1" style={{ fontFamily: 'Georgia, serif' }}>{b.name}</h4>
                <p className="text-[#8A8E89] text-xs">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOS BOX */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#3E4743]" style={{ fontFamily: 'Georgia, serif' }}>
            Nos box d&apos;abonnement
          </h2>
          <p className="text-[#5C6B65] mt-3">Biscuits pur beurre · Prélèvement SEPA · Sans engagement, trimestriel ou annuel · Livraison incluse</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {boxSizes.map((b) => (
            <div
              key={b.id}
              className={`rounded-2xl p-8 border-2 relative ${b.popular ? 'border-[#F48F98] bg-[#3E4743] text-white shadow-xl' : 'border-[#F3E4CD] bg-white shadow-sm'}`}
            >
              {b.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F48F98] text-[#3E4743] text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                  ⭐ Recommandé
                </span>
              )}
              <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'Georgia, serif' }}>{b.label}</h3>
              <p className={`text-sm mb-3 ${b.popular ? 'text-[#E3D4BD]' : 'text-[#5C6B65]'}`}>{b.description} · {b.weight} de biscuits</p>
              <div className="flex items-baseline gap-1 my-3">
                <span className={`text-sm ${b.popular ? 'text-[#E3D4BD]' : 'text-[#8A8E89]'}`}>à partir de</span>
                <span className="text-4xl font-bold">{b.prices.annuel}€</span>
                <span className={`text-sm ${b.popular ? 'text-[#E3D4BD]' : 'text-[#8A8E89]'}`}>HT/mois</span>
              </div>
              <div className={`grid grid-cols-3 gap-1 text-center text-xs mb-6 pb-4 border-b ${b.popular ? 'border-[#5C3D2E] text-[#E3D4BD]' : 'border-[#F3E4CD] text-[#8A8E89]'}`}>
                <div>
                  <div className={`font-bold text-sm ${b.popular ? 'text-white' : 'text-[#3E4743]'}`}>{b.prices.annuel}€</div>
                  <div>Annuel</div>
                </div>
                <div>
                  <div className={`font-bold text-sm ${b.popular ? 'text-white' : 'text-[#3E4743]'}`}>{b.prices.trimestriel}€</div>
                  <div>Trimestriel</div>
                </div>
                <div>
                  <div className={`font-bold text-sm ${b.popular ? 'text-white' : 'text-[#3E4743]'}`}>{b.prices['sans-engagement']}€</div>
                  <div>Sans engagt.</div>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                {['Biscuits artisanaux Louvat', 'Sélection personnalisée', 'Livraison incluse', 'Prélèvement SEPA sécurisé'].map((item) => (
                  <li key={item} className={`flex items-center gap-2 text-sm ${b.popular ? 'text-[#F3E4CD]' : 'text-[#3E4743]'}`}>
                    <CheckCircle className={`w-4 h-4 flex-shrink-0 ${b.popular ? 'text-[#F48F98]' : 'text-green-600'}`} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={`/abonnement?taille=${b.id}`}
                className={`block text-center py-3 rounded-full font-semibold transition-all ${b.popular ? 'bg-[#F48F98] text-[#3E4743] hover:bg-[#E0727C] hover:text-white' : 'bg-[#3E4743] text-white hover:bg-[#5C6B65]'}`}
              >
                Choisir cette box
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CE */}
      <section className="bg-[#3E4743] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="flex-1">
            <Building2 className="w-12 h-12 text-[#F48F98] mx-auto md:mx-0 mb-4" />
            <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>
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

      {/* TÉMOIGNAGES */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-[#3E4743] mb-12" style={{ fontFamily: 'Georgia, serif' }}>
          Ce que disent nos abonnés
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Marie L.', text: "Les sablés bretons sont à tomber. Je reçois ma box depuis 6 mois et je ne me lasse pas !", stars: 5 },
            { name: 'Thomas B.', text: "Super concept ! Pouvoir choisir ses biscuits est un vrai plus. La qualité artisanale se ressent vraiment.", stars: 5 },
            { name: 'Sophie M.', text: "Notre CE a souscrit pour toute l'entreprise. Les collègues adorent ! La gestion est simple.", stars: 5 },
          ].map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-[#F3E4CD]">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <span key={i} className="text-[#F48F98]">★</span>
                ))}
              </div>
              <p className="text-[#6B4226] italic mb-4">&ldquo;{t.text}&rdquo;</p>
              <div className="font-semibold text-[#3E4743] text-sm">{t.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-[#F3E4CD] py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-5xl mb-4">🍪</div>
          <h2 className="text-3xl font-bold text-[#3E4743] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Prêt à vous régaler ?
          </h2>
          <p className="text-[#5C6B65] mb-2">À partir de 30€ HT/mois. Sans engagement possible. Résiliable à tout moment.</p>
          <p className="text-[#E0727C] italic mb-8">... c&apos;est le début d&apos;une grande histoire d&apos;amour.</p>
          <Link
            href="/abonnement"
            className="inline-flex items-center gap-2 bg-[#3E4743] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#5C6B65] transition-all shadow-lg"
          >
            Créer ma box personnalisée <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

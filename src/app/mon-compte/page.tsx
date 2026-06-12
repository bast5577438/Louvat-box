'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Package, Pause, X, ChevronRight, CheckCircle, LogOut, Lock, Eye, EyeOff, Info, Mail, User as UserIcon } from 'lucide-react';
import { biscuits, boxSizes } from '@/lib/data';
import { getSupabaseBrowserClient, type Abonne } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export default function MonComptePage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  /* ── Session Supabase ── */
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [abonne, setAbonne] = useState<Abonne | null>(null);
  const [loadingAbonne, setLoadingAbonne] = useState(false);

  /* ── Formulaire connexion / inscription ── */
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authMsg, setAuthMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  /* ── État du tableau de bord ── */
  const [tab, setTab] = useState<'abonnement' | 'selection' | 'historique'>('abonnement');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  /* Récupère la session au chargement + écoute les changements (login/logout) */
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      setChecking(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  /* Récupère l'espace abonné lié à ce compte */
  useEffect(() => {
    if (!user) {
      setAbonne(null);
      return;
    }
    setLoadingAbonne(true);
    supabase
      .from('abonnes')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setAbonne(data as Abonne | null);
        setLoadingAbonne(false);
      });
  }, [user, supabase]);

  const boxSize = abonne?.box_id ? boxSizes.find((b) => b.id === abonne.box_id) : undefined;
  const myBiscuits = (abonne?.selections ?? [])
    .map((id) => biscuits.find((b) => b.id === id))
    .filter((b): b is typeof biscuits[number] => !!b);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    setAuthMsg('');
    if (!email.trim() || !pwd) {
      setAuthError('Merci de renseigner votre email et votre mot de passe.');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pwd });
    setSubmitting(false);
    if (error) {
      setAuthError(error.message === 'Invalid login credentials' ? 'Email ou mot de passe incorrect.' : error.message);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    setAuthMsg('');
    if (!email.trim() || !pwd) {
      setAuthError('Merci de renseigner votre email et votre mot de passe.');
      return;
    }
    if (pwd.length < 6) {
      setAuthError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password: pwd,
      options: {
        data: { name: `${prenom} ${nom}`.trim(), prenom, nom },
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/mon-compte` : undefined,
      },
    });
    setSubmitting(false);
    if (error) {
      setAuthError(error.message);
      return;
    }
    setAuthMsg('Votre compte a été créé ! Vérifiez votre boîte mail pour confirmer votre adresse, puis connectez-vous ci-dessous.');
    setMode('login');
    setPwd('');
  }

  async function logout() {
    await supabase.auth.signOut();
    setAbonne(null);
    setTab('abonnement');
    setShowCancelConfirm(false);
  }

  async function updateStatut(statut: 'actif' | 'pause' | 'résilié') {
    if (!abonne) return;
    const { error } = await supabase.from('abonnes').update({ statut }).eq('id', abonne.id);
    if (!error) setAbonne({ ...abonne, statut });
  }

  /* ── Chargement initial ── */
  if (checking) {
    return <div className="bg-[#FBF4E9] min-h-screen" />;
  }

  /* ── Connexion / Inscription ── */
  if (!user) {
    return (
      <div className="bg-[#FBF4E9] min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-sm w-full">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-[#3E4743] rounded-full flex items-center justify-center text-2xl mx-auto mb-3">🍪</div>
            <h1 className="text-2xl font-bold text-[#3E4743]" style={{ fontFamily: 'Georgia, serif' }}>Mon espace Louvat</h1>
            <p className="text-[#8A8E89] text-sm mt-1">
              {mode === 'login' ? 'Connectez-vous pour gérer votre abonnement' : 'Créez votre espace abonné'}
            </p>
          </div>

          {/* Onglets connexion / inscription */}
          <div className="flex gap-2 mb-4 bg-white rounded-full border border-[#F3E4CD] p-1">
            <button
              onClick={() => { setMode('login'); setAuthError(''); setAuthMsg(''); }}
              className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${mode === 'login' ? 'bg-[#3E4743] text-white' : 'text-[#5C6B65]'}`}
            >
              Se connecter
            </button>
            <button
              onClick={() => { setMode('signup'); setAuthError(''); setAuthMsg(''); }}
              className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${mode === 'signup' ? 'bg-[#3E4743] text-white' : 'text-[#5C6B65]'}`}
            >
              Créer un compte
            </button>
          </div>

          <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="bg-white rounded-3xl border border-[#F3E4CD] shadow-sm p-6 space-y-4">
            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#3E4743] mb-1">Prénom</label>
                  <input
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Votre prénom"
                    className="w-full border border-[#F3E4CD] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#5C6B65]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3E4743] mb-1">Nom</label>
                  <input
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Votre nom"
                    className="w-full border border-[#F3E4CD] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#5C6B65]"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-[#3E4743] mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.fr"
                className="w-full border border-[#F3E4CD] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#5C6B65]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3E4743] mb-1">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-[#F3E4CD] rounded-xl px-4 py-2.5 text-sm pr-10 focus:outline-none focus:border-[#5C6B65]"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8E89]">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mode === 'signup' && <p className="text-xs text-[#8A8E89] mt-1">Au moins 6 caractères.</p>}
            </div>

            {authError && (
              <div className="text-red-600 text-sm bg-red-50 rounded-xl p-3">{authError}</div>
            )}
            {authMsg && (
              <div className="flex items-start gap-2 text-green-700 text-sm bg-green-50 rounded-xl p-3">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> {authMsg}
              </div>
            )}

            <button type="submit" disabled={submitting} className="w-full bg-[#3E4743] text-white py-3 rounded-full font-semibold hover:bg-[#5C6B65] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
              {submitting ? (
                <span className="animate-spin">⏳</span>
              ) : mode === 'login' ? (
                <><Lock className="w-4 h-4" /> Se connecter</>
              ) : (
                <><UserIcon className="w-4 h-4" /> Créer mon compte</>
              )}
            </button>

            {mode === 'signup' && (
              <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs rounded-xl p-3">
                <Mail className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Un email de confirmation vous sera envoyé. Cliquez sur le lien qu&apos;il contient pour activer votre compte.</span>
              </div>
            )}
          </form>

          <p className="text-center text-sm text-[#8A8E89] mt-4">
            Pas encore abonné ?{' '}
            <Link href="/abonnement" className="text-[#5C6B65] font-semibold hover:underline">
              Découvrir nos box
            </Link>
          </p>
        </div>
      </div>
    );
  }

  /* ── Tableau de bord ── */
  const tabs = [
    { id: 'abonnement', label: 'Mon abonnement' },
    { id: 'selection', label: 'Mes biscuits' },
    { id: 'historique', label: 'Historique' },
  ] as const;

  return (
    <div className="bg-[#FBF4E9] min-h-screen">
      {/* Header */}
      <div className="bg-[#3E4743] text-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#5C6B65] rounded-full flex items-center justify-center text-2xl">🍪</div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
                {abonne?.prenom ? `Bonjour ${abonne.prenom} !` : 'Bonjour !'}
              </h1>
              <p className="text-[#E3D4BD] text-sm truncate">{user.email}</p>
            </div>
            <div className="ml-auto flex items-center gap-3 flex-shrink-0">
              {abonne && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${abonne.statut === 'actif' ? 'bg-green-700 text-green-100' : abonne.statut === 'pause' ? 'bg-yellow-700 text-yellow-100' : 'bg-red-800 text-red-100'}`}>
                  {abonne.statut === 'actif' ? '● Actif' : abonne.statut === 'pause' ? '⏸ En pause' : '✕ Résilié'}
                </span>
              )}
              <button onClick={logout} className="flex items-center gap-1.5 text-[#E3D4BD] hover:text-white text-sm transition-colors" title="Se déconnecter">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {loadingAbonne ? (
          <div className="text-center py-12 text-[#8A8E89]">Chargement de votre espace…</div>
        ) : !abonne || !abonne.box_id ? (
          /* ── Pas encore d'abonnement ── */
          <div className="bg-white rounded-3xl border border-[#F3E4CD] p-10 text-center shadow-sm">
            <div className="text-4xl mb-4">📦</div>
            <h2 className="text-xl font-bold text-[#3E4743] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Vous n&apos;avez pas encore de box en cours
            </h2>
            <p className="text-[#5C6B65] mb-6">Composez votre première box et choisissez votre formule pour démarrer votre abonnement.</p>
            <Link href="/box" className="inline-flex items-center gap-2 bg-[#3E4743] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#5C6B65] transition-all">
              Composer ma box <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-2 mb-8 border-b border-[#F3E4CD]">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all ${tab === t.id ? 'border-[#5C6B65] text-[#5C6B65]' : 'border-transparent text-[#8A8E89] hover:text-[#5C6B65]'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Onglet Abonnement */}
            {tab === 'abonnement' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { icon: <Package className="w-5 h-5" />, label: 'Ma box', val: boxSize?.label ?? '—' },
                    { icon: <Info className="w-5 h-5" />, label: 'Formule', val: abonne.engagement === 'annuel' ? 'Engagement annuel' : abonne.engagement === 'trimestriel' ? 'Engagement trimestriel' : 'Sans engagement' },
                    { icon: <CheckCircle className="w-5 h-5" />, label: 'Tarif', val: abonne.prix ? `${abonne.prix.toFixed(2)}€ HT/mois` : '—' },
                  ].map((card) => (
                    <div key={card.label} className="bg-white rounded-2xl p-5 border border-[#F3E4CD] shadow-sm">
                      <div className="flex items-center gap-2 text-[#5C6B65] mb-2">{card.icon}<span className="text-xs uppercase tracking-wider font-semibold">{card.label}</span></div>
                      <div className="font-bold text-[#3E4743]">{card.val}</div>
                    </div>
                  ))}
                </div>

                {abonne.ce_code && (
                  <div className="bg-blue-50 border border-blue-100 text-blue-700 text-sm rounded-xl p-4">
                    Code Comité d&apos;Entreprise associé : <strong className="font-mono">{abonne.ce_code}</strong>
                  </div>
                )}

                {/* Actions */}
                <div className="bg-white rounded-2xl border border-[#F3E4CD] p-6 shadow-sm">
                  <h3 className="font-bold text-[#3E4743] mb-4" style={{ fontFamily: 'Georgia, serif' }}>Gérer mon abonnement</h3>
                  <div className="space-y-3">
                    <Link
                      href="/box"
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-[#F3E4CD] hover:bg-[#EDD5B8] transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Package className="w-4 h-4 text-[#5C6B65]" />
                        <div>
                          <div className="font-semibold text-[#3E4743] text-sm">Modifier ma sélection</div>
                          <div className="text-xs text-[#8A8E89]">Changer les biscuits de ma prochaine box</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#5C6B65]" />
                    </Link>

                    {abonne.statut === 'actif' ? (
                      <button
                        onClick={() => updateStatut('pause')}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 transition-all text-left"
                      >
                        <div className="flex items-center gap-3">
                          <Pause className="w-4 h-4 text-yellow-700" />
                          <div>
                            <div className="font-semibold text-yellow-800 text-sm">Mettre en pause</div>
                            <div className="text-xs text-yellow-600">Suspendre temporairement les livraisons</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-yellow-700" />
                      </button>
                    ) : abonne.statut === 'pause' ? (
                      <button
                        onClick={() => updateStatut('actif')}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-green-50 border border-green-200 hover:bg-green-100 transition-all text-left"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-700" />
                          <div>
                            <div className="font-semibold text-green-800 text-sm">Reprendre l&apos;abonnement</div>
                            <div className="text-xs text-green-600">Réactiver mes livraisons</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-green-700" />
                      </button>
                    ) : null}

                    {abonne.statut !== 'résilié' && (
                      <button
                        onClick={() => setShowCancelConfirm(true)}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-100 hover:bg-red-100 transition-all text-left"
                      >
                        <div className="flex items-center gap-3">
                          <X className="w-4 h-4 text-red-600" />
                          <div>
                            <div className="font-semibold text-red-700 text-sm">Résilier l&apos;abonnement</div>
                            <div className="text-xs text-red-400">Sans frais, effectif immédiatement</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-red-500" />
                      </button>
                    )}
                  </div>
                </div>

                {showCancelConfirm && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                    <h4 className="font-bold text-red-800 mb-2">Confirmer la résiliation ?</h4>
                    <p className="text-red-600 text-sm mb-4">Votre abonnement sera résilié immédiatement. Vous ne recevrez plus de box Louvat. Vous pouvez vous réabonner à tout moment.</p>
                    <div className="flex gap-3">
                      <button onClick={() => setShowCancelConfirm(false)} className="flex-1 border border-[#E3D4BD] text-[#5C6B65] py-2 rounded-full text-sm font-semibold hover:bg-[#F3E4CD] transition-all">
                        Annuler
                      </button>
                      <button onClick={() => { updateStatut('résilié'); setShowCancelConfirm(false); }} className="flex-1 bg-red-600 text-white py-2 rounded-full text-sm font-bold hover:bg-red-700 transition-all">
                        Confirmer la résiliation
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Onglet Sélection */}
            {tab === 'selection' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-[#3E4743] text-lg" style={{ fontFamily: 'Georgia, serif' }}>
                    Ma sélection actuelle ({myBiscuits.length} biscuits)
                  </h3>
                  <Link href="/box" className="bg-[#5C6B65] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#3E4743] transition-all">
                    Modifier →
                  </Link>
                </div>
                {myBiscuits.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {myBiscuits.map((b, i) => (
                      <div key={`${b.id}-${i}`} className="bg-white rounded-2xl p-4 border border-[#F3E4CD] text-center shadow-sm">
                        <div className="text-2xl mb-2">🍪</div>
                        <div className="font-semibold text-[#3E4743] text-xs" style={{ fontFamily: 'Georgia, serif' }}>{b.name}</div>
                        <div className="text-[#8A8E89] text-xs mt-1">{b.category}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-[#8A8E89] mb-6">Aucune sélection enregistrée pour le moment.</div>
                )}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                  Les modifications s&apos;appliquent à votre prochaine box. Date limite de modification : 7 jours avant la livraison.
                </div>
              </div>
            )}

            {/* Onglet Historique */}
            {tab === 'historique' && (
              <div>
                <h3 className="font-bold text-[#3E4743] text-lg mb-6" style={{ fontFamily: 'Georgia, serif' }}>Historique des livraisons</h3>
                <div className="text-center py-12 text-[#8A8E89]">
                  Aucune livraison enregistrée pour le moment. Votre historique apparaîtra ici après votre première box.
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Lock, Package, Building2, Users, Mail,
  Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
  CheckCircle, X, Eye, EyeOff, Send, LogOut,
  ChevronDown, AlertCircle, Settings, KeyRound
} from 'lucide-react';
import { biscuits as defaultBiscuits, type Biscuit } from '@/lib/data';

const DEFAULT_ADMIN_PASSWORD = 'louvat1954';
const ADMIN_PASSWORD_KEY = 'louvat_admin_pwd';

/* Le mot de passe peut être changé depuis l'onglet "Paramètres".
   Il est alors mémorisé dans ce navigateur (stockage local), en
   attendant une vraie gestion des comptes via Supabase. */
function getAdminPassword(): string {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_PASSWORD;
  return window.localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_ADMIN_PASSWORD;
}

/* ── Types ── */
type Prospect = {
  id: string;
  societe: string;
  contact: string;
  email: string;
  dateAjout: string;
};

type CECode = {
  id: string;
  code: string;
  prospectId: string;
  employerPct: number;
  abonnes: number;
  dateCreation: string;
  actif: boolean;
};

type Subscriber = {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  formule: string;
  box: string;
  prix: number;
  statut: 'actif' | 'pause' | 'résilié';
  ceCode?: string;
  dateInscription: string;
};

/* ── Données initiales ──
 * Site livré "prêt à l'emploi" : un seul exemple de Comité d'Entreprise
 * (code CE2024) pour démontrer le fonctionnement, aucun abonné ni chiffre
 * d'affaires fictif. Ajoutez vos vrais prospects/codes/abonnés au fil de
 * l'eau depuis cet espace admin. */
const mockProspects: Prospect[] = [
  { id: '1', societe: 'TechCorp SAS', contact: 'Sophie Martin', email: 'ce@techcorp.fr', dateAjout: '2024-01-10' },
];

const mockCECodes: CECode[] = [
  { id: '1', code: 'CE2024', prospectId: '1', employerPct: 30, abonnes: 0, dateCreation: '2024-01-15', actif: true },
];

const mockSubscribers: Subscriber[] = [];

/* ══════════════════════════════════════════════
   COMPOSANT PRINCIPAL
══════════════════════════════════════════════ */
export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'produits' | 'ce' | 'abonnes' | 'prospectus' | 'parametres'>('produits');

  /* Données partagées entre les onglets CE et Prospectus
     (un code CE est toujours lié à un contact entreprise) */
  const [codes, setCodes] = useState<CECode[]>(mockCECodes);
  const [prospects, setProspects] = useState<Prospect[]>(mockProspects);

  /* Vérifier la session */
  useEffect(() => {
    if (sessionStorage.getItem('louvat_admin') === '1') setLoggedIn(true);
  }, []);

  function login(e: React.FormEvent) {
    e.preventDefault();
    if (password === getAdminPassword()) {
      sessionStorage.setItem('louvat_admin', '1');
      setLoggedIn(true);
      setError('');
    } else {
      setError('Mot de passe incorrect.');
    }
  }

  function logout() {
    sessionStorage.removeItem('louvat_admin');
    setLoggedIn(false);
    setPassword('');
  }

  /* ── LOGIN ── */
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-[#3D2B1F] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-10 w-full max-w-sm shadow-2xl text-center">
          <Image
            src="https://biscuiterie-louvat.com/cdn/shop/files/logo_Louvat_gris_446C_800x.png?v=1614330419"
            alt="Louvat"
            width={140}
            height={50}
            className="mx-auto mb-2"
            unoptimized
          />
          <div className="text-[#8B4513] text-xs uppercase tracking-widest mb-6">Espace Administration</div>

          <form onSubmit={login} className="space-y-4">
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                className="w-full border border-[#D2B48C] rounded-xl px-4 py-3 text-sm pr-10 focus:outline-none focus:border-[#8B4513]"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0856B]">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-xl p-3">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
            <button type="submit" className="w-full bg-[#3D2B1F] text-white py-3 rounded-xl font-semibold hover:bg-[#8B4513] transition-all flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" /> Se connecter
            </button>
          </form>
          <p className="text-xs text-[#A0856B] mt-4">Accès réservé à la Biscuiterie Louvat</p>
        </div>
      </div>
    );
  }

  /* ── DASHBOARD ── */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header admin */}
      <header className="bg-[#3D2B1F] text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="https://biscuiterie-louvat.com/cdn/shop/files/logo_Louvat_gris_446C_800x.png?v=1614330419"
            alt="Louvat"
            width={90}
            height={32}
            className="brightness-0 invert"
            unoptimized
          />
          <span className="text-[#F4A460] text-xs font-medium border-l border-[#5C3D2E] pl-3">Administration Box</span>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-[#D2B48C] hover:text-white text-sm transition-colors">
          <LogOut className="w-4 h-4" /> Déconnexion
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Abonnés actifs', val: mockSubscribers.filter(s => s.statut === 'actif').length, color: 'text-green-700', bg: 'bg-green-50 border-green-100' },
            { label: 'Codes CE actifs', val: codes.filter(c => c.actif).length, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-100' },
            { label: 'Produits en box', val: defaultBiscuits.filter(b => b.available !== false).length, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-100' },
            { label: 'CA mensuel est.', val: `${(mockSubscribers.filter(s => s.statut === 'actif').reduce((a, s) => a + s.prix, 0)).toFixed(0)}€`, color: 'text-purple-700', bg: 'bg-purple-50 border-purple-100' },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl p-5 border ${s.bg}`}>
              <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
              <div className="text-gray-500 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
          {[
            { id: 'produits', label: 'Produits box', icon: <Package className="w-4 h-4" /> },
            { id: 'ce', label: 'Codes CE', icon: <Building2 className="w-4 h-4" /> },
            { id: 'abonnes', label: 'Abonnés', icon: <Users className="w-4 h-4" /> },
            { id: 'prospectus', label: 'Prospectus', icon: <Mail className="w-4 h-4" /> },
            { id: 'parametres', label: 'Paramètres', icon: <Settings className="w-4 h-4" /> },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`flex items-center gap-2 pb-3 px-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${tab === t.id ? 'border-[#8B4513] text-[#8B4513]' : 'border-transparent text-gray-400 hover:text-[#8B4513]'}`}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* Contenu des onglets */}
        {tab === 'produits' && <TabProduits />}
        {tab === 'ce' && <TabCE codes={codes} setCodes={setCodes} prospects={prospects} />}
        {tab === 'abonnes' && <TabAbonnes subscribers={mockSubscribers} />}
        {tab === 'prospectus' && <TabProspectus prospects={prospects} setProspects={setProspects} codes={codes} />}
        {tab === 'parametres' && <TabParametres />}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ONGLET PRODUITS
══════════════════════════════════════════════ */
function TabProduits() {
  const [produits, setProduits] = useState<Biscuit[]>(defaultBiscuits);
  const [editing, setEditing] = useState<Biscuit | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Biscuit>>({});
  const [saved, setSaved] = useState(false);

  function toggleAvailable(id: number) {
    setProduits((p) => p.map((b) => b.id === id ? { ...b, available: !b.available } : b));
  }

  function openEdit(b: Biscuit) {
    setEditing(b);
    setForm({ ...b });
    setShowForm(true);
  }

  function openNew() {
    setEditing(null);
    setForm({ available: true, category: 'Classiques', allergens: [] });
    setShowForm(true);
  }

  function saveForm() {
    if (!form.name || !form.description || !form.price) return;
    if (editing) {
      setProduits((p) => p.map((b) => b.id === editing.id ? { ...b, ...form } as Biscuit : b));
    } else {
      const newId = Math.max(...produits.map((b) => b.id)) + 1;
      setProduits((p) => [...p, { ...form, id: newId, allergens: form.allergens ?? [] } as Biscuit]);
    }
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function deleteProduit(id: number) {
    if (confirm('Supprimer ce produit ?')) {
      setProduits((p) => p.filter((b) => b.id !== id));
    }
  }

  const categories = ['Classiques', 'Moelleux', 'Croquants', 'Meringues', 'Macarons', 'Sans gluten', 'Éco-responsable'];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Produits disponibles en box</h2>
          <p className="text-gray-500 text-sm">Activez ou désactivez les produits visibles par les abonnés.</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-green-600 text-sm flex items-center gap-1"><CheckCircle className="w-4 h-4" />Sauvegardé</span>}
          <button onClick={openNew} className="bg-[#8B4513] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#3D2B1F] transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Ajouter un produit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {produits.map((b) => (
          <div key={b.id} className={`bg-white rounded-2xl border-2 p-4 flex gap-4 transition-all ${b.available !== false ? 'border-gray-100' : 'border-red-100 opacity-60'}`}>
            {b.image ? (
              <img src={b.image} alt={b.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-[#F5E6D3] flex items-center justify-center text-2xl flex-shrink-0">🍪</div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">{b.name}</h4>
                  <p className="text-gray-500 text-xs truncate">{b.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">{b.category}</span>
                    <span className="text-[#8B4513] font-bold text-xs">à partir de {b.price}€</span>
                    {b.badge && <span className="bg-[#F4A460] text-[#3D2B1F] text-xs px-2 py-0.5 rounded-full">{b.badge}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(b)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                    <Pencil className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                  <button onClick={() => deleteProduit(b.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => toggleAvailable(b.id)}
                className={`mt-2 flex items-center gap-1.5 text-xs font-medium transition-colors ${b.available !== false ? 'text-green-600' : 'text-red-400'}`}
              >
                {b.available !== false ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                {b.available !== false ? 'Disponible en box' : 'Indisponible'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal édition */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-800 text-lg">{editing ? 'Modifier le produit' : 'Nouveau produit'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea rows={2} value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513] resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix de base (€) *</label>
                  <input type="number" step="0.10" value={form.price ?? ''} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <select value={form.category ?? ''} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513] bg-white">
                    {categories.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL image (optionnel)</label>
                <input value={form.image ?? ''} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Badge (optionnel)</label>
                <input value={form.badge ?? ''} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="Ex: Nouveau, Bestseller, Favori" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513]" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="avail" checked={form.available !== false} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="accent-amber-800 w-4 h-4" />
                <label htmlFor="avail" className="text-sm text-gray-700">Disponible dans les box</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all">Annuler</button>
              <button onClick={saveForm} disabled={!form.name || !form.description || !form.price} className="flex-1 bg-[#3D2B1F] text-white py-3 rounded-xl font-semibold hover:bg-[#8B4513] transition-all disabled:opacity-50">
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   ONGLET CODES CE
   (gère uniquement les codes : % et statut.
    Les contacts entreprise se gèrent dans Prospectus)
══════════════════════════════════════════════ */
function TabCE({ codes, setCodes, prospects }: { codes: CECode[]; setCodes: React.Dispatch<React.SetStateAction<CECode[]>>; prospects: Prospect[] }) {
  const [editing, setEditing] = useState<CECode | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<CECode>>({ employerPct: 30 });
  const [saved, setSaved] = useState(false);

  function toggleActif(id: string) {
    setCodes((c) => c.map((ce) => ce.id === id ? { ...ce, actif: !ce.actif } : ce));
  }

  function openNew() {
    setEditing(null);
    setForm({ employerPct: 30, prospectId: prospects[0]?.id });
    setShowForm(true);
  }

  function openEdit(ce: CECode) {
    setEditing(ce);
    setForm({ ...ce });
    setShowForm(true);
  }

  function saveCode(e: React.FormEvent) {
    e.preventDefault();
    if (!form.prospectId) return;
    if (editing) {
      setCodes((c) => c.map((ce) => ce.id === editing.id
        ? {
            ...ce,
            code: (form.code ?? ce.code).toUpperCase(),
            prospectId: form.prospectId ?? ce.prospectId,
            employerPct: form.employerPct ?? ce.employerPct,
          }
        : ce));
    } else {
      const newCode: CECode = {
        id: Date.now().toString(),
        code: form.code?.toUpperCase() ?? '',
        prospectId: form.prospectId,
        employerPct: form.employerPct ?? 30,
        abonnes: 0,
        dateCreation: new Date().toISOString().split('T')[0],
        actif: true,
      };
      setCodes((c) => [newCode, ...c]);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ employerPct: 30 });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function deleteCode(id: string) {
    if (confirm('Supprimer ce code CE ?')) setCodes((c) => c.filter((ce) => ce.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Codes Comité d&apos;Entreprise</h2>
          <p className="text-gray-500 text-sm">Gérez vos codes de réduction et leur répartition. Les contacts des entreprises se gèrent dans l&apos;onglet <strong>Prospectus</strong>.</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-green-600 text-sm flex items-center gap-1"><CheckCircle className="w-4 h-4" />Enregistré !</span>}
          <button
            onClick={openNew}
            disabled={prospects.length === 0}
            title={prospects.length === 0 ? 'Ajoutez d\'abord un contact dans Prospectus' : undefined}
            className="bg-[#8B4513] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#3D2B1F] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#8B4513]"
          >
            <Plus className="w-4 h-4" /> Nouveau code CE
          </button>
        </div>
      </div>

      {prospects.length === 0 && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 text-amber-700 text-sm rounded-xl p-4 mb-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          Aucun contact entreprise pour l&apos;instant. Ajoutez-en un dans l&apos;onglet <strong className="font-semibold">Prospectus</strong> avant de créer un code CE.
        </div>
      )}

      <div className="space-y-4">
        {codes.map((ce) => {
          const prospect = prospects.find((p) => p.id === ce.prospectId);
          return (
            <div key={ce.id} className={`bg-white rounded-2xl border-2 p-5 transition-all ${ce.actif ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-[#3D2B1F] text-white font-mono font-bold text-sm px-3 py-1 rounded-lg">{ce.code}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ce.actif ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {ce.actif ? '● Actif' : '● Inactif'}
                    </span>
                  </div>
                  {prospect ? (
                    <>
                      <div className="font-semibold text-gray-800">{prospect.societe}</div>
                      <div className="text-gray-500 text-sm">{prospect.contact} · {prospect.email}</div>
                    </>
                  ) : (
                    <div className="text-red-400 text-sm italic">Contact introuvable — il a peut-être été supprimé dans Prospectus.</div>
                  )}
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">Employeur : {ce.employerPct}%</span>
                    <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">Louvat : 10%</span>
                    <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">Salarié : {100 - ce.employerPct - 10}%</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{ce.abonnes} abonné{ce.abonnes > 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(ce)} className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-[#8B4513] transition-all" title="Modifier">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => toggleActif(ce.id)} className={`p-2 rounded-xl text-sm font-medium transition-all ${ce.actif ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`} title={ce.actif ? 'Désactiver' : 'Activer'}>
                    {ce.actif ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>
                  <button onClick={() => deleteCode(ce.id)} className="p-2 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all" title="Supprimer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {codes.length === 0 && (
          <div className="text-center py-8 text-gray-400">Aucun code CE pour le moment.</div>
        )}
      </div>

      {/* Modal nouveau / édition de code */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-800 text-lg">{editing ? 'Modifier le code CE' : 'Nouveau code CE'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={saveCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact entreprise *</label>
                <select required value={form.prospectId ?? ''} onChange={(e) => setForm({ ...form, prospectId: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513] bg-white">
                  <option value="" disabled>— Choisir un contact —</option>
                  {prospects.map((p) => <option key={p.id} value={p.id}>{p.societe} — {p.contact}</option>)}
                </select>
                <p className="text-xs text-gray-400 mt-1">Le contact n&apos;existe pas encore ? Ajoutez-le dans l&apos;onglet <strong>Prospectus</strong>, puis revenez ici.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code CE *</label>
                  <input required value={form.code ?? ''} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="Ex: ACME2024" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono uppercase focus:outline-none focus:border-[#8B4513]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">% Employeur</label>
                  <div className="flex items-center gap-2">
                    <input type="range" min={0} max={60} value={form.employerPct ?? 30} onChange={(e) => setForm({ ...form, employerPct: Number(e.target.value) })} className="flex-1 accent-amber-800" />
                    <span className="font-bold text-[#8B4513] w-10">{form.employerPct}%</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#F5E6D3] rounded-xl p-3 text-sm">
                <strong className="text-[#3D2B1F]">Répartition :</strong>
                <div className="flex gap-2 mt-1 text-xs">
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Employeur {form.employerPct}%</span>
                  <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Louvat 10%</span>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Salarié {100 - (form.employerPct ?? 30) - 10}%</span>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50">Annuler</button>
                <button type="submit" className="flex-1 bg-[#3D2B1F] text-white py-3 rounded-xl font-semibold hover:bg-[#8B4513] transition-all">{editing ? 'Enregistrer les modifications' : 'Créer le code'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   ONGLET ABONNÉS
══════════════════════════════════════════════ */
function TabAbonnes({ subscribers }: { subscribers: Subscriber[] }) {
  const [filter, setFilter] = useState<'tous' | 'actif' | 'pause' | 'résilié'>('tous');
  const [search, setSearch] = useState('');

  const filtered = subscribers.filter((s) => {
    const matchStatus = filter === 'tous' || s.statut === filter;
    const matchSearch = search === '' || `${s.prenom} ${s.nom} ${s.email}`.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const statusColors = {
    'actif': 'bg-green-100 text-green-700',
    'pause': 'bg-yellow-100 text-yellow-700',
    'résilié': 'bg-red-100 text-red-600',
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Abonnés</h2>
          <p className="text-gray-500 text-sm">{subscribers.filter(s => s.statut === 'actif').length} actifs sur {subscribers.length} total</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['tous', 'actif', 'pause', 'résilié'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${filter === f ? 'bg-[#8B4513] text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-[#D2B48C]'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher un abonné (nom, email...)"
        className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm mb-4 focus:outline-none focus:border-[#8B4513]"
      />

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Abonné</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Formule</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Prix</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">CE</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800">{s.prenom} {s.nom}</div>
                  <div className="text-gray-400 text-xs">{s.email}</div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="text-gray-700">{s.formule}</div>
                  <div className="text-gray-400 text-xs">{s.box}</div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="font-bold text-[#8B4513]">{s.prix.toFixed(2)}€</span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  {s.ceCode ? (
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-mono">{s.ceCode}</span>
                  ) : (
                    <span className="text-gray-300 text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${statusColors[s.statut]}`}>
                    {s.statut}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-400">Aucun abonné trouvé.</div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ONGLET PROSPECTUS
   (répertoire des contacts entreprise — ajout, modification,
    suppression — + envoi du catalogue trimestriel)
══════════════════════════════════════════════ */
function TabProspectus({ prospects, setProspects, codes }: { prospects: Prospect[]; setProspects: React.Dispatch<React.SetStateAction<Prospect[]>>; codes: CECode[] }) {
  /* — Répertoire des contacts — */
  const [editing, setEditing] = useState<Prospect | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Prospect>>({});
  const [saved, setSaved] = useState(false);

  /* — Envoi du catalogue — */
  const [sending, setSending] = useState<string | null>(null);
  const [sent, setSent] = useState<string[]>([]);
  const [sendAll, setSendAll] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  /* Contacts ayant un code CE actif → ce sont eux qui reçoivent le prospectus */
  const activeContacts = prospects
    .map((p) => ({ prospect: p, ce: codes.find((c) => c.prospectId === p.id && c.actif) }))
    .filter((x): x is { prospect: Prospect; ce: CECode } => !!x.ce);

  function openNew() {
    setEditing(null);
    setForm({});
    setShowForm(true);
  }

  function openEdit(p: Prospect) {
    setEditing(p);
    setForm({ ...p });
    setShowForm(true);
  }

  function saveProspect(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      setProspects((list) => list.map((p) => p.id === editing.id
        ? { ...p, societe: form.societe ?? p.societe, contact: form.contact ?? p.contact, email: form.email ?? p.email }
        : p));
    } else {
      const newProspect: Prospect = {
        id: Date.now().toString(),
        societe: form.societe ?? '',
        contact: form.contact ?? '',
        email: form.email ?? '',
        dateAjout: new Date().toISOString().split('T')[0],
      };
      setProspects((list) => [newProspect, ...list]);
    }
    setShowForm(false);
    setEditing(null);
    setForm({});
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function deleteProspect(p: Prospect) {
    const linked = codes.filter((c) => c.prospectId === p.id);
    const message = linked.length > 0
      ? `Ce contact est lié à ${linked.length} code${linked.length > 1 ? 's' : ''} CE (${linked.map((c) => c.code).join(', ')}). Le supprimer quand même ?`
      : 'Supprimer ce contact ?';
    if (confirm(message)) setProspects((list) => list.filter((x) => x.id !== p.id));
  }

  function simulateSend(id: string) {
    setSending(id);
    setTimeout(() => {
      setSending(null);
      setSent((s) => [...s, id]);
    }, 1500);
  }

  function simulateSendAll() {
    setSendAll(true);
    setTimeout(() => {
      setSendAll(false);
      setSent(activeContacts.map((x) => x.prospect.id));
    }, 2000);
  }

  const currentQuarter = `T${Math.ceil((new Date().getMonth() + 1) / 3)} ${new Date().getFullYear()}`;

  return (
    <div className="space-y-10">
      {/* ── Répertoire des contacts entreprise ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Contacts entreprises</h2>
            <p className="text-gray-500 text-sm">Ajoutez, modifiez ou supprimez les entreprises à prospecter. Les codes CE se créent ensuite dans l&apos;onglet <strong>Codes CE</strong>.</p>
          </div>
          <div className="flex items-center gap-3">
            {saved && <span className="text-green-600 text-sm flex items-center gap-1"><CheckCircle className="w-4 h-4" />Enregistré !</span>}
            <button onClick={openNew} className="bg-[#8B4513] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#3D2B1F] transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" /> Nouveau contact
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prospects.map((p) => {
            const ce = codes.find((c) => c.prospectId === p.id);
            return (
              <div key={p.id} className="bg-white rounded-2xl border-2 border-gray-100 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-800 truncate">{p.societe}</div>
                    <div className="text-gray-500 text-sm truncate">{p.contact} · {p.email}</div>
                    <div className="mt-2">
                      {ce ? (
                        <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${ce.actif ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {ce.code} · {ce.actif ? 'actif' : 'inactif'}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Pas encore de code CE</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Modifier">
                      <Pencil className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                    <button onClick={() => deleteProspect(p)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {prospects.length === 0 && (
          <div className="text-center py-8 text-gray-400">Aucun contact pour le moment.</div>
        )}
      </div>

      {/* ── Envoi du catalogue trimestriel ── */}
      <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Prospectus trimestriels</h2>
          <p className="text-gray-500 text-sm">Envoi du catalogue {currentQuarter} aux contacts ayant un code CE actif.</p>
        </div>
        <button
          onClick={simulateSendAll}
          disabled={sendAll || activeContacts.length === 0 || sent.length === activeContacts.length}
          className="bg-[#3D2B1F] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#8B4513] transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {sendAll ? (
            <><span className="animate-spin">⏳</span> Envoi en cours...</>
          ) : activeContacts.length > 0 && sent.length === activeContacts.length ? (
            <><CheckCircle className="w-4 h-4 text-green-300" /> Tous envoyés</>
          ) : (
            <><Send className="w-4 h-4" /> Envoyer à tous les CE</>
          )}
        </button>
      </div>

      {/* Modèle d'email */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
        <button
          onClick={() => setOpen(open === 'template' ? null : 'template')}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#F5E6D3] rounded-lg flex items-center justify-center">
              <Mail className="w-4 h-4 text-[#8B4513]" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-800">Modèle d&apos;email — {currentQuarter}</div>
              <div className="text-gray-400 text-xs">Personnalisé automatiquement pour chaque CE</div>
            </div>
          </div>
          {open === 'template' ? <ChevronDown className="w-4 h-4 text-gray-400 rotate-180" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {open === 'template' && (
          <div className="mt-4 bg-[#FFF8F0] rounded-xl p-4 text-sm text-[#3D2B1F] border border-[#F5E6D3] space-y-2">
            <div className="font-bold">Objet : Votre catalogue Louvat Box — {currentQuarter}</div>
            <div className="text-xs text-[#A0856B] italic border-b border-[#F5E6D3] pb-2">
              Les champs en <span className="text-[#8B4513] font-semibold not-italic">orange</span> sont remplis automatiquement avec les données de chaque CE.
            </div>
            <div className="pt-1 space-y-2">
              <p>Bonjour <strong className="text-[#8B4513]">[Prénom du responsable]</strong>,</p>
              <p>Nous vous adressons le catalogue <strong>Louvat Box — {currentQuarter}</strong>. Retrouvez nos nouveautés et notre sélection pur beurre à partager avec vos salariés.</p>
              <p>Code CE de votre entreprise : <strong className="font-mono text-[#8B4513]">[CODE_CE]</strong></p>
              <p>Ce code donne accès à :</p>
              <ul className="list-disc ml-4 space-y-1">
                <li>10% offerts par Louvat</li>
                <li><strong className="text-[#8B4513]">[X]%</strong> pris en charge par votre entreprise</li>
              </ul>
              <p>Lien de commande : <span className="text-[#8B4513] underline">https://box.louvat-biscuits.fr/abonnement?code=<strong>[CODE_CE]</strong></span></p>
              <p>À bientôt,<br /><strong>L&apos;équipe Louvat</strong></p>
            </div>
          </div>
        )}
      </div>

      {/* Liste des contacts avec un code CE actif */}
      <div className="space-y-3">
        {activeContacts.map(({ prospect, ce }) => {
          const isSent = sent.includes(prospect.id);
          const isLoading = sending === prospect.id;
          const isOpen = open === prospect.id;
          const prenom = prospect.contact.split(' ')[0];
          return (
            <div key={prospect.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800">{prospect.societe}</div>
                  <div className="text-gray-500 text-xs">{prospect.contact} · {prospect.email}</div>
                  <div className="flex gap-2 mt-1">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{ce.code}</span>
                    <span className="text-xs text-gray-400">{ce.abonnes} abonnés</span>
                    <span className="text-xs text-[#8B4513] bg-[#F5E6D3] px-2 py-0.5 rounded">Employeur {ce.employerPct}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOpen(isOpen ? null : prospect.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all bg-gray-50 text-gray-600 hover:bg-gray-100"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {isOpen ? 'Masquer' : "Voir l'email"}
                  </button>
                  <button
                    onClick={() => simulateSend(prospect.id)}
                    disabled={isSent || isLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isSent ? 'bg-green-50 text-green-600 cursor-default' : isLoading ? 'bg-gray-100 text-gray-400' : 'bg-[#F5E6D3] text-[#8B4513] hover:bg-[#8B4513] hover:text-white'}`}
                  >
                    {isLoading ? (
                      <span className="animate-spin">⏳</span>
                    ) : isSent ? (
                      <><CheckCircle className="w-4 h-4" /> Envoyé</>
                    ) : (
                      <><Send className="w-4 h-4" /> Envoyer</>
                    )}
                  </button>
                </div>
              </div>
              {isOpen && (
                <div className="border-t border-gray-50 bg-[#FFF8F0] px-4 py-4 text-sm text-[#3D2B1F] space-y-2">
                  <div className="text-xs font-semibold text-[#A0856B] mb-2">
                    Aperçu de l&apos;email envoyé à {prospect.email}
                  </div>
                  <div className="text-xs text-gray-400 font-medium">Objet : Votre catalogue Louvat Box — {currentQuarter}</div>
                  <div className="border border-[#F5E6D3] rounded-lg p-3 bg-white space-y-2">
                    <p>Bonjour <strong>{prenom}</strong>,</p>
                    <p>Nous vous adressons le catalogue <strong>Louvat Box — {currentQuarter}</strong>. Retrouvez nos nouveautés et notre sélection pur beurre à partager avec vos salariés.</p>
                    <p>Code CE de votre entreprise : <strong className="font-mono">{ce.code}</strong></p>
                    <p>Ce code donne accès à :</p>
                    <ul className="list-disc ml-4 space-y-1">
                      <li>10% offerts par Louvat</li>
                      <li><strong>{ce.employerPct}%</strong> pris en charge par {prospect.societe}</li>
                    </ul>
                    <p>Lien de commande : <span className="text-[#8B4513] underline">https://box.louvat-biscuits.fr/abonnement?code={ce.code}</span></p>
                    <p>À bientôt,<br /><strong>L&apos;équipe Louvat</strong></p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {activeContacts.length === 0 && (
        <div className="text-center py-8 text-gray-400">Aucun contact avec un code CE actif pour le moment.</div>
      )}
      </div>

      {/* Modal nouveau / édition contact */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-800 text-lg">{editing ? 'Modifier le contact' : 'Nouveau contact entreprise'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={saveProspect} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Société *</label>
                <input required value={form.societe ?? ''} onChange={(e) => setForm({ ...form, societe: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsable CE *</label>
                <input required value={form.contact ?? ''} onChange={(e) => setForm({ ...form, contact: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input required type="email" value={form.email ?? ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513]" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50">Annuler</button>
                <button type="submit" className="flex-1 bg-[#3D2B1F] text-white py-3 rounded-xl font-semibold hover:bg-[#8B4513] transition-all">{editing ? 'Enregistrer les modifications' : 'Ajouter le contact'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   ONGLET PARAMÈTRES
   (changer le mot de passe d'accès à l'administration)
══════════════════════════════════════════════ */
function TabParametres() {
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (oldPwd !== getAdminPassword()) {
      setError('Le mot de passe actuel est incorrect.');
      return;
    }
    if (newPwd.length < 6) {
      setError('Le nouveau mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (newPwd !== confirmPwd) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }

    window.localStorage.setItem(ADMIN_PASSWORD_KEY, newPwd);
    setOldPwd('');
    setNewPwd('');
    setConfirmPwd('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <div className="max-w-lg">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-800">Paramètres</h2>
        <p className="text-gray-500 text-sm">Gérez le mot de passe d&apos;accès à l&apos;espace administration.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-[#8B4513]" /> Changer le mot de passe
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
            <div className="relative">
              <input
                type={showOld ? 'text' : 'password'}
                value={oldPwd}
                onChange={(e) => setOldPwd(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm pr-10 focus:outline-none focus:border-[#8B4513]"
              />
              <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm pr-10 focus:outline-none focus:border-[#8B4513]"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Au moins 6 caractères.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
            <input
              type={showNew ? 'text' : 'password'}
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513]"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 rounded-xl p-3">
              <CheckCircle className="w-4 h-4 flex-shrink-0" /> Mot de passe mis à jour !
            </div>
          )}

          <button type="submit" className="w-full bg-[#3D2B1F] text-white py-3 rounded-xl font-semibold hover:bg-[#8B4513] transition-all">
            Mettre à jour le mot de passe
          </button>
        </form>
      </div>

      <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 text-amber-700 text-sm rounded-xl p-4 mt-4">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>Ce mot de passe est enregistré uniquement dans ce navigateur (stockage local), en attendant un vrai système de comptes (voir Étape 5 du guide). Si vous videz le cache ou changez d&apos;ordinateur, le mot de passe par défaut (<code className="font-mono">louvat1954</code>) refonctionnera tant que ce changement n&apos;y aura pas été refait.</span>
      </div>
    </div>
  );
}

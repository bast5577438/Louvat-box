'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Lock, Package, Building2, Users, Mail,
  Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
  CheckCircle, X, Eye, EyeOff, Send, LogOut,
  ChevronDown, AlertCircle
} from 'lucide-react';
import { biscuits as defaultBiscuits, type Biscuit } from '@/lib/data';

const ADMIN_PASSWORD = 'louvat1954';

/* ── Types ── */
type CECode = {
  id: string;
  code: string;
  societe: string;
  contact: string;
  email: string;
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

/* ── Données mock initiales ── */
const mockCECodes: CECode[] = [
  { id: '1', code: 'CE2024', societe: 'TechCorp SAS', contact: 'Sophie Martin', email: 'ce@techcorp.fr', employerPct: 30, abonnes: 14, dateCreation: '2024-01-15', actif: true },
  { id: '2', code: 'BOULOT42', societe: 'Industrie du Futur', contact: 'Marc Dupont', email: 'marc@idf.fr', employerPct: 20, abonnes: 7, dateCreation: '2024-03-10', actif: true },
  { id: '3', code: 'SAVEUR50', societe: 'Cabinet Notarial Renard', contact: 'Claire Renard', email: 'claire@notaire-renard.fr', employerPct: 50, abonnes: 3, dateCreation: '2024-06-01', actif: false },
];

const mockSubscribers: Subscriber[] = [
  { id: '1', prenom: 'Marie', nom: 'Laurent', email: 'marie.l@gmail.com', formule: 'Trimestriel', box: 'Box Gourmande', prix: 19.50, statut: 'actif', ceCode: 'CE2024', dateInscription: '2025-03-12' },
  { id: '2', prenom: 'Thomas', nom: 'Bernard', email: 'tbernard@yahoo.fr', formule: 'Mensuel', box: 'Box Découverte', prix: 22.50, statut: 'actif', dateInscription: '2025-04-20' },
  { id: '3', prenom: 'Julie', nom: 'Petit', email: 'julie.p@outlook.com', formule: 'Mensuel', box: 'Box Prestige', prix: 38.25, statut: 'pause', ceCode: 'CE2024', dateInscription: '2025-01-08' },
  { id: '4', prenom: 'Luc', nom: 'Moreau', email: 'luc.moreau@sfr.fr', formule: 'Trimestriel', box: 'Box Gourmande', prix: 52.00, statut: 'actif', ceCode: 'BOULOT42', dateInscription: '2025-05-01' },
  { id: '5', prenom: 'Emma', nom: 'Durand', email: 'emma.d@free.fr', formule: 'Mensuel', box: 'Box Découverte', prix: 25.00, statut: 'résilié', dateInscription: '2024-11-15' },
  { id: '6', prenom: 'Paul', nom: 'Simon', email: 'paul.s@gmail.com', formule: 'Trimestriel', box: 'Box Prestige', prix: 19.50, statut: 'actif', ceCode: 'CE2024', dateInscription: '2025-02-28' },
];

/* ══════════════════════════════════════════════
   COMPOSANT PRINCIPAL
══════════════════════════════════════════════ */
export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'produits' | 'ce' | 'abonnes' | 'prospectus'>('produits');

  /* Vérifier la session */
  useEffect(() => {
    if (sessionStorage.getItem('louvat_admin') === '1') setLoggedIn(true);
  }, []);

  function login(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
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
            { label: 'Codes CE actifs', val: mockCECodes.filter(c => c.actif).length, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-100' },
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
        {tab === 'ce' && <TabCE initialCodes={mockCECodes} />}
        {tab === 'abonnes' && <TabAbonnes subscribers={mockSubscribers} />}
        {tab === 'prospectus' && <TabProspectus ceCodes={mockCECodes} />}
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
══════════════════════════════════════════════ */
function TabCE({ initialCodes }: { initialCodes: CECode[] }) {
  const [codes, setCodes] = useState<CECode[]>(initialCodes);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<CECode>>({ employerPct: 30, actif: true });
  const [saved, setSaved] = useState(false);

  function toggleActif(id: string) {
    setCodes((c) => c.map((ce) => ce.id === id ? { ...ce, actif: !ce.actif } : ce));
  }

  function addCode(e: React.FormEvent) {
    e.preventDefault();
    const newCode: CECode = {
      id: Date.now().toString(),
      code: form.code?.toUpperCase() ?? '',
      societe: form.societe ?? '',
      contact: form.contact ?? '',
      email: form.email ?? '',
      employerPct: form.employerPct ?? 30,
      abonnes: 0,
      dateCreation: new Date().toISOString().split('T')[0],
      actif: true,
    };
    setCodes((c) => [newCode, ...c]);
    setShowForm(false);
    setForm({ employerPct: 30, actif: true });
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
          <p className="text-gray-500 text-sm">Gérez les entreprises partenaires et leurs remises.</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-green-600 text-sm flex items-center gap-1"><CheckCircle className="w-4 h-4" />Créé !</span>}
          <button onClick={() => setShowForm(true)} className="bg-[#8B4513] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#3D2B1F] transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nouveau code CE
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {codes.map((ce) => (
          <div key={ce.id} className={`bg-white rounded-2xl border-2 p-5 transition-all ${ce.actif ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-[#3D2B1F] text-white font-mono font-bold text-sm px-3 py-1 rounded-lg">{ce.code}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ce.actif ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {ce.actif ? '● Actif' : '● Inactif'}
                  </span>
                </div>
                <div className="font-semibold text-gray-800">{ce.societe}</div>
                <div className="text-gray-500 text-sm">{ce.contact} · {ce.email}</div>
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">Employeur : {ce.employerPct}%</span>
                  <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">Louvat : 10%</span>
                  <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">Salarié : {100 - ce.employerPct - 10}%</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{ce.abonnes} abonné{ce.abonnes > 1 ? 's' : ''}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleActif(ce.id)} className={`p-2 rounded-xl text-sm font-medium transition-all ${ce.actif ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                  {ce.actif ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
                <button onClick={() => deleteCode(ce.id)} className="p-2 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal nouveau code */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-800 text-lg">Nouveau code CE</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={addCode} className="space-y-4">
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
                <button type="submit" className="flex-1 bg-[#3D2B1F] text-white py-3 rounded-xl font-semibold hover:bg-[#8B4513] transition-all">Créer le code</button>
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
══════════════════════════════════════════════ */
function TabProspectus({ ceCodes }: { ceCodes: CECode[] }) {
  const [sending, setSending] = useState<string | null>(null);
  const [sent, setSent] = useState<string[]>([]);
  const [sendAll, setSendAll] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  const activeCEs = ceCodes.filter((ce) => ce.actif);

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
      setSent(activeCEs.map((ce) => ce.id));
    }, 2000);
  }

  const currentQuarter = `T${Math.ceil((new Date().getMonth() + 1) / 3)} ${new Date().getFullYear()}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Prospectus trimestriels</h2>
          <p className="text-gray-500 text-sm">Envoi du catalogue {currentQuarter} aux responsables CE.</p>
        </div>
        <button
          onClick={simulateSendAll}
          disabled={sendAll || sent.length === activeCEs.length}
          className="bg-[#3D2B1F] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#8B4513] transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {sendAll ? (
            <><span className="animate-spin">⏳</span> Envoi en cours...</>
          ) : sent.length === activeCEs.length ? (
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

      {/* Liste des CE */}
      <div className="space-y-3">
        {activeCEs.map((ce) => {
          const isSent = sent.includes(ce.id);
          const isLoading = sending === ce.id;
          const isOpen = open === ce.id;
          const prenom = ce.contact.split(' ')[0];
          return (
            <div key={ce.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800">{ce.societe}</div>
                  <div className="text-gray-500 text-xs">{ce.contact} · {ce.email}</div>
                  <div className="flex gap-2 mt-1">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{ce.code}</span>
                    <span className="text-xs text-gray-400">{ce.abonnes} abonnés</span>
                    <span className="text-xs text-[#8B4513] bg-[#F5E6D3] px-2 py-0.5 rounded">Employeur {ce.employerPct}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOpen(isOpen ? null : ce.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all bg-gray-50 text-gray-600 hover:bg-gray-100"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {isOpen ? 'Masquer' : "Voir l'email"}
                  </button>
                  <button
                    onClick={() => simulateSend(ce.id)}
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
                    Aperçu de l&apos;email envoyé à {ce.email}
                  </div>
                  <div className="text-xs text-gray-400 font-medium">Objet : Votre catalogue Louvat Box — {currentQuarter}</div>
                  <div className="border border-[#F5E6D3] rounded-lg p-3 bg-white space-y-2">
                    <p>Bonjour <strong>{prenom}</strong>,</p>
                    <p>Nous vous adressons le catalogue <strong>Louvat Box — {currentQuarter}</strong>. Retrouvez nos nouveautés et notre sélection pur beurre à partager avec vos salariés.</p>
                    <p>Code CE de votre entreprise : <strong className="font-mono">{ce.code}</strong></p>
                    <p>Ce code donne accès à :</p>
                    <ul className="list-disc ml-4 space-y-1">
                      <li>10% offerts par Louvat</li>
                      <li><strong>{ce.employerPct}%</strong> pris en charge par {ce.societe}</li>
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

      {activeCEs.length === 0 && (
        <div className="text-center py-8 text-gray-400">Aucun CE actif pour le moment.</div>
      )}
    </div>
  );
}

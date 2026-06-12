'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Lock, Package, Building2, Users, Mail,
  Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
  CheckCircle, X, Eye, EyeOff, Send, LogOut,
  ChevronDown, AlertCircle, Settings, KeyRound, Info
} from 'lucide-react';
import { boxSizes, type Biscuit } from '@/lib/data';
import type { Abonne } from '@/lib/supabase';

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
  id: number;
  code: string;
  societe: string;
  contact: string | null;
  email: string;
  employer_pct: number;
  abonnes: number;
  actif: boolean;
  created_at?: string;
};

/* ── Données initiales ──
 * Site livré "prêt à l'emploi" : un seul exemple de Comité d'Entreprise
 * (code CE2024) pour démontrer le fonctionnement, aucun abonné ni chiffre
 * d'affaires fictif. Ajoutez vos vrais prospects/codes/abonnés au fil de
 * l'eau depuis cet espace admin. */
const mockProspects: Prospect[] = [
  { id: '1', societe: 'TechCorp SAS', contact: 'Sophie Martin', email: 'ce@techcorp.fr', dateAjout: '2024-01-10' },
];

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
  const [prospects, setProspects] = useState<Prospect[]>(mockProspects);

  /* Codes CE (table `ce_codes` sur Supabase) */
  const [codes, setCodes] = useState<CECode[]>([]);
  const [codesLoading, setCodesLoading] = useState(false);
  const [codesError, setCodesError] = useState('');

  const fetchCeCodes = useCallback(async () => {
    setCodesLoading(true);
    setCodesError('');
    try {
      const res = await fetch('/api/admin/ce-codes', { headers: { 'x-admin-password': getAdminPassword() } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erreur de chargement');
      setCodes(json.codes ?? []);
    } catch (err) {
      setCodesError(err instanceof Error ? err.message : 'Erreur de chargement des codes CE.');
    } finally {
      setCodesLoading(false);
    }
  }, []);

  /* Espaces clients (table `abonnes` sur Supabase) */
  const [abonnes, setAbonnes] = useState<Abonne[]>([]);
  const [abonnesLoading, setAbonnesLoading] = useState(false);
  const [abonnesError, setAbonnesError] = useState('');

  /* Catalogue de biscuits (table `produits` sur Supabase) */
  const [produits, setProduits] = useState<Biscuit[]>([]);
  const [produitsLoading, setProduitsLoading] = useState(false);
  const [produitsError, setProduitsError] = useState('');

  const fetchProduits = useCallback(async () => {
    setProduitsLoading(true);
    setProduitsError('');
    try {
      const res = await fetch('/api/admin/produits', { headers: { 'x-admin-password': getAdminPassword() } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erreur de chargement');
      setProduits(json.produits ?? []);
    } catch (err) {
      setProduitsError(err instanceof Error ? err.message : 'Erreur de chargement des produits.');
    } finally {
      setProduitsLoading(false);
    }
  }, []);

  const fetchAbonnes = useCallback(async () => {
    setAbonnesLoading(true);
    setAbonnesError('');
    try {
      const res = await fetch('/api/admin/abonnes', { headers: { 'x-admin-password': getAdminPassword() } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erreur de chargement');
      setAbonnes(json.abonnes ?? []);
    } catch (err) {
      setAbonnesError(err instanceof Error ? err.message : 'Erreur de chargement des clients.');
    } finally {
      setAbonnesLoading(false);
    }
  }, []);

  /* Vérifier la session */
  useEffect(() => {
    if (sessionStorage.getItem('louvat_admin') === '1') setLoggedIn(true);
  }, []);

  /* Charger les clients, le catalogue et les codes CE une fois connecté */
  useEffect(() => {
    if (loggedIn) {
      fetchAbonnes();
      fetchProduits();
      fetchCeCodes();
    }
  }, [loggedIn, fetchAbonnes, fetchProduits, fetchCeCodes]);

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
            { label: 'Abonnés actifs', val: abonnes.filter(s => s.statut === 'actif').length, color: 'text-green-700', bg: 'bg-green-50 border-green-100' },
            { label: 'Codes CE actifs', val: codes.filter(c => c.actif).length, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-100' },
            { label: 'Produits en box', val: produits.filter(b => b.available !== false).length, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-100' },
            { label: 'CA mensuel est.', val: `${(abonnes.filter(s => s.statut === 'actif').reduce((a, s) => a + (s.prix ?? 0), 0)).toFixed(0)}€`, color: 'text-purple-700', bg: 'bg-purple-50 border-purple-100' },
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
        {tab === 'produits' && (
          <TabProduits
            produits={produits}
            loading={produitsLoading}
            error={produitsError}
            onRefresh={fetchProduits}
            getAdminPassword={getAdminPassword}
          />
        )}
        {tab === 'ce' && (
          <TabCE
            codes={codes}
            loading={codesLoading}
            error={codesError}
            onRefresh={fetchCeCodes}
            getAdminPassword={getAdminPassword}
            prospects={prospects}
          />
        )}
        {tab === 'abonnes' && (
          <TabAbonnes
            abonnes={abonnes}
            loading={abonnesLoading}
            error={abonnesError}
            onRefresh={fetchAbonnes}
            getAdminPassword={getAdminPassword}
          />
        )}
        {tab === 'prospectus' && <TabProspectus prospects={prospects} setProspects={setProspects} codes={codes} />}
        {tab === 'parametres' && <TabParametres />}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   ONGLET PRODUITS
══════════════════════════════════════════════ */
function TabProduits({
  produits,
  loading,
  error,
  onRefresh,
  getAdminPassword,
}: {
  produits: Biscuit[];
  loading: boolean;
  error: string;
  onRefresh: () => void;
  getAdminPassword: () => string;
}) {
  const [editing, setEditing] = useState<Biscuit | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Biscuit>>({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  async function toggleAvailable(b: Biscuit) {
    try {
      await fetch('/api/admin/produits', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': getAdminPassword() },
        body: JSON.stringify({ id: b.id, available: !(b.available !== false) }),
      });
      onRefresh();
    } catch {
      // ignore, l'utilisateur peut réessayer
    }
  }

  function openEdit(b: Biscuit) {
    setEditing(b);
    setForm({ ...b });
    setFormError('');
    setShowForm(true);
  }

  function openNew() {
    setEditing(null);
    setForm({ available: true, category: 'Classiques', allergens: [] });
    setFormError('');
    setShowForm(true);
  }

  async function saveForm() {
    if (!form.name || !form.description || !form.price) return;
    setSaving(true);
    setFormError('');
    try {
      const payload = {
        name: form.name,
        description: form.description,
        category: form.category,
        price: form.price,
        image: form.image,
        badge: form.badge,
        available: form.available ?? true,
        allergens: form.allergens ?? [],
      };
      const res = await fetch('/api/admin/produits', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': getAdminPassword() },
        body: JSON.stringify(editing ? { id: editing.id, ...payload } : payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erreur lors de l’enregistrement.');
      setShowForm(false);
      setSaved(true);
      onRefresh();
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erreur lors de l’enregistrement.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduit(id: number) {
    if (!confirm('Supprimer ce produit ?')) return;
    try {
      await fetch(`/api/admin/produits?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': getAdminPassword() },
      });
      onRefresh();
    } catch {
      // ignore, l'utilisateur peut réessayer
    }
  }

  const categories = ['Classiques', 'Moelleux', 'Croquants', 'Meringues', 'Macarons', 'Éco-responsable'];

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

      {loading && <p className="text-gray-400 text-sm mb-4">Chargement des produits…</p>}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-xl p-3 mb-4">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}
      {!loading && !error && produits.length === 0 && (
        <p className="text-gray-400 text-sm mb-4">Aucun produit pour le moment. Ajoutez-en un.</p>
      )}

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
                onClick={() => toggleAvailable(b)}
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
            {formError && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-xl p-3 mt-4">
                <AlertCircle className="w-4 h-4" /> {formError}
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all">Annuler</button>
              <button onClick={saveForm} disabled={saving || !form.name || !form.description || !form.price} className="flex-1 bg-[#3D2B1F] text-white py-3 rounded-xl font-semibold hover:bg-[#8B4513] transition-all disabled:opacity-50">
                {saving ? 'Enregistrement…' : 'Enregistrer'}
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
function TabCE({
  codes,
  loading,
  error,
  onRefresh,
  getAdminPassword,
  prospects,
}: {
  codes: CECode[];
  loading: boolean;
  error: string;
  onRefresh: () => void;
  getAdminPassword: () => string;
  prospects: Prospect[];
}) {
  const [editing, setEditing] = useState<CECode | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<CECode>>({ employer_pct: 30 });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  async function toggleActif(ce: CECode) {
    try {
      await fetch('/api/admin/ce-codes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': getAdminPassword() },
        body: JSON.stringify({ id: ce.id, actif: !ce.actif }),
      });
      onRefresh();
    } catch {
      // ignore, l'utilisateur peut réessayer
    }
  }

  function openNew() {
    setEditing(null);
    const p = prospects[0];
    setForm({ employer_pct: 30, societe: p?.societe ?? '', contact: p?.contact ?? '', email: p?.email ?? '' });
    setFormError('');
    setShowForm(true);
  }

  function openEdit(ce: CECode) {
    setEditing(ce);
    setForm({ ...ce });
    setFormError('');
    setShowForm(true);
  }

  async function saveCode(e: React.FormEvent) {
    e.preventDefault();
    if (!form.code || !form.societe || !form.email) return;
    setSaving(true);
    setFormError('');
    try {
      const payload = {
        code: form.code,
        societe: form.societe,
        contact: form.contact ?? null,
        email: form.email,
        employer_pct: form.employer_pct ?? 30,
      };
      const res = await fetch('/api/admin/ce-codes', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': getAdminPassword() },
        body: JSON.stringify(editing ? { id: editing.id, ...payload } : payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erreur lors de l’enregistrement.');
      setShowForm(false);
      setEditing(null);
      setForm({ employer_pct: 30 });
      setSaved(true);
      onRefresh();
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erreur lors de l’enregistrement.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteCode(id: number) {
    if (!confirm('Supprimer ce code CE ?')) return;
    try {
      await fetch(`/api/admin/ce-codes?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': getAdminPassword() },
      });
      onRefresh();
    } catch {
      // ignore, l'utilisateur peut réessayer
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Codes Comité d&apos;Entreprise</h2>
          <p className="text-gray-500 text-sm">Gérez vos codes de réduction et leur répartition.</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-green-600 text-sm flex items-center gap-1"><CheckCircle className="w-4 h-4" />Enregistré !</span>}
          <button
            onClick={openNew}
            className="bg-[#8B4513] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#3D2B1F] transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nouveau code CE
          </button>
        </div>
      </div>

      {loading && <p className="text-gray-400 text-sm mb-4">Chargement des codes CE…</p>}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-xl p-3 mb-4">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

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
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">Employeur : {ce.employer_pct}%</span>
                    <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">Louvat : 10%</span>
                    <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">Salarié : {100 - ce.employer_pct - 10}%</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{ce.abonnes} abonné{ce.abonnes > 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(ce)} className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-[#8B4513] transition-all" title="Modifier">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => toggleActif(ce)} className={`p-2 rounded-xl text-sm font-medium transition-all ${ce.actif ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`} title={ce.actif ? 'Désactiver' : 'Activer'}>
                    {ce.actif ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>
                  <button onClick={() => deleteCode(ce.id)} className="p-2 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all" title="Supprimer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
        ))}
        {!loading && codes.length === 0 && (
          <div className="text-center py-8 text-gray-400">Aucun code CE pour le moment.</div>
        )}
      </div>

      {/* Modal nouveau / édition de code */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-800 text-lg">{editing ? 'Modifier le code CE' : 'Nouveau code CE'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={saveCode} className="space-y-4">
              {prospects.length > 0 && !editing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pré-remplir depuis un contact (optionnel)</label>
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      const p = prospects.find((pr) => pr.id === e.target.value);
                      if (p) setForm({ ...form, societe: p.societe, contact: p.contact, email: p.email });
                    }}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513] bg-white"
                  >
                    <option value="">— Choisir un contact —</option>
                    {prospects.map((p) => <option key={p.id} value={p.id}>{p.societe} — {p.contact}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Société *</label>
                <input required value={form.societe ?? ''} onChange={(e) => setForm({ ...form, societe: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                  <input value={form.contact ?? ''} onChange={(e) => setForm({ ...form, contact: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input required type="email" value={form.email ?? ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code CE *</label>
                  <input required value={form.code ?? ''} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="Ex: ACME2024" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono uppercase focus:outline-none focus:border-[#8B4513]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">% Employeur</label>
                  <div className="flex items-center gap-2">
                    <input type="range" min={0} max={60} value={form.employer_pct ?? 30} onChange={(e) => setForm({ ...form, employer_pct: Number(e.target.value) })} className="flex-1 accent-amber-800" />
                    <span className="font-bold text-[#8B4513] w-10">{form.employer_pct}%</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#F5E6D3] rounded-xl p-3 text-sm">
                <strong className="text-[#3D2B1F]">Répartition :</strong>
                <div className="flex gap-2 mt-1 text-xs">
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Employeur {form.employer_pct}%</span>
                  <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Louvat 10%</span>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Salarié {100 - (form.employer_pct ?? 30) - 10}%</span>
                </div>
              </div>
              {formError && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-xl p-3">
                  <AlertCircle className="w-4 h-4" /> {formError}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50">Annuler</button>
                <button type="submit" disabled={saving} className="flex-1 bg-[#3D2B1F] text-white py-3 rounded-xl font-semibold hover:bg-[#8B4513] transition-all disabled:opacity-50">{saving ? 'Enregistrement…' : editing ? 'Enregistrer les modifications' : 'Créer le code'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   ONGLET ABONNÉS / CLIENTS
   (espaces clients réels, table `abonnes` sur Supabase)
══════════════════════════════════════════════ */
const ENGAGEMENT_LABELS: Record<string, string> = {
  'sans-engagement': 'Sans engagement',
  trimestriel: 'Trimestriel',
  annuel: 'Annuel',
};

const STATUT_COLORS: Record<string, string> = {
  actif: 'bg-green-100 text-green-700',
  pause: 'bg-yellow-100 text-yellow-700',
  résilié: 'bg-red-100 text-red-600',
};

type AbonneForm = Partial<Abonne>;

function TabAbonnes({
  abonnes,
  loading,
  error,
  onRefresh,
  getAdminPassword,
}: {
  abonnes: Abonne[];
  loading: boolean;
  error: string;
  onRefresh: () => void;
  getAdminPassword: () => string;
}) {
  const [filter, setFilter] = useState<'tous' | 'actif' | 'pause' | 'résilié'>('tous');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Abonne | null>(null);
  const [form, setForm] = useState<AbonneForm>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const filtered = abonnes.filter((s) => {
    const matchStatus = filter === 'tous' || s.statut === filter;
    const matchSearch = search === '' || `${s.prenom ?? ''} ${s.name ?? ''} ${s.email}`.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  function openNew() {
    setEditing(null);
    setForm({ statut: 'actif' });
    setFormError('');
    setShowForm(true);
  }

  function openEdit(a: Abonne) {
    setEditing(a);
    setForm({ ...a });
    setFormError('');
    setShowForm(true);
  }

  async function saveForm(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email) {
      setFormError("L'email est requis.");
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const headers = { 'Content-Type': 'application/json', 'x-admin-password': getAdminPassword() };
      const res = await fetch('/api/admin/abonnes', {
        method: editing ? 'PUT' : 'POST',
        headers,
        body: JSON.stringify(editing ? { ...form, id: editing.id } : form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erreur lors de l\'enregistrement.');
      setShowForm(false);
      onRefresh();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erreur lors de l\'enregistrement.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteAbonne(a: Abonne) {
    if (!confirm(`Supprimer l'espace client de ${a.email} ? Cette action est irréversible.`)) return;
    try {
      const res = await fetch(`/api/admin/abonnes?id=${a.id}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': getAdminPassword() },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erreur lors de la suppression.');
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la suppression.');
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Clients / Abonnés</h2>
          <p className="text-gray-500 text-sm">{abonnes.filter(s => s.statut === 'actif').length} actifs sur {abonnes.length} total</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(['tous', 'actif', 'pause', 'résilié'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${filter === f ? 'bg-[#8B4513] text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-[#D2B48C]'}`}
            >
              {f}
            </button>
          ))}
          <button onClick={openNew} className="bg-[#8B4513] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#3D2B1F] transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nouveau client
          </button>
        </div>
      </div>

      <p className="text-gray-500 text-sm mb-4">
        Les clients créent eux-mêmes leur espace depuis <Link href="/mon-compte" className="text-[#8B4513] underline">Mon espace abonné</Link>. Utilisez cette section pour ajouter, modifier ou supprimer un espace manuellement (ex. abonnement pris par téléphone).
      </p>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher un client (nom, email...)"
        className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm mb-4 focus:outline-none focus:border-[#8B4513]"
      />

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-4 mb-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Client</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Formule</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Prix</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">CE</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => {
              const box = boxSizes.find((b) => b.id === s.box_id);
              return (
                <tr key={s.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{s.prenom} {s.name}</div>
                    <div className="text-gray-400 text-xs">{s.email}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="text-gray-700">{s.engagement ? ENGAGEMENT_LABELS[s.engagement] ?? s.engagement : '—'}</div>
                    <div className="text-gray-400 text-xs">{box?.label ?? '—'}</div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="font-bold text-[#8B4513]">{s.prix != null ? `${s.prix.toFixed(2)}€` : '—'}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {s.ce_code ? (
                      <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-mono">{s.ce_code}</span>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${STATUT_COLORS[s.statut] ?? 'bg-gray-100 text-gray-600'}`}>
                      {s.statut}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(s)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Modifier">
                        <Pencil className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                      <button onClick={() => deleteAbonne(s)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && (
          <div className="text-center py-8 text-gray-400">Aucun client trouvé.</div>
        )}
        {loading && (
          <div className="text-center py-8 text-gray-400">Chargement…</div>
        )}
      </div>

      {/* Modal nouveau / édition client */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-800 text-lg">{editing ? 'Modifier le client' : 'Nouveau client'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={saveForm} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input value={form.prenom ?? ''} onChange={(e) => setForm({ ...form, prenom: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input required type="email" value={form.email ?? ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Box</label>
                  <select value={form.box_id ?? ''} onChange={(e) => setForm({ ...form, box_id: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513] bg-white">
                    <option value="">— Aucune —</option>
                    {boxSizes.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Formule</label>
                  <select value={form.engagement ?? ''} onChange={(e) => setForm({ ...form, engagement: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513] bg-white">
                    <option value="">— Aucune —</option>
                    {Object.entries(ENGAGEMENT_LABELS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€ HT/mois)</label>
                  <input type="number" step="0.01" value={form.prix ?? ''} onChange={(e) => setForm({ ...form, prix: e.target.value === '' ? undefined : parseFloat(e.target.value) })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code CE</label>
                  <input value={form.ce_code ?? ''} onChange={(e) => setForm({ ...form, ce_code: e.target.value.toUpperCase() })} placeholder="Optionnel" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono uppercase focus:outline-none focus:border-[#8B4513]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select value={form.statut ?? 'actif'} onChange={(e) => setForm({ ...form, statut: e.target.value as Abonne['statut'] })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8B4513] bg-white">
                  <option value="actif">Actif</option>
                  <option value="pause">En pause</option>
                  <option value="résilié">Résilié</option>
                </select>
              </div>

              {!editing && (
                <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs rounded-xl p-3">
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Si le client crée ensuite son propre compte avec ce même email depuis &quot;Mon espace abonné&quot;, son espace sera automatiquement relié à cette fiche.</span>
                </div>
              )}

              {formError && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /> {formError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50">Annuler</button>
                <button type="submit" disabled={saving} className="flex-1 bg-[#3D2B1F] text-white py-3 rounded-xl font-semibold hover:bg-[#8B4513] transition-all disabled:opacity-50">
                  {saving ? 'Enregistrement…' : editing ? 'Enregistrer les modifications' : 'Créer le client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
    .map((p) => ({ prospect: p, ce: codes.find((c) => c.email === p.email && c.actif) }))
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
    const linked = codes.filter((c) => c.email === p.email);
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
            const ce = codes.find((c) => c.email === p.email);
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
                    <span className="text-xs text-[#8B4513] bg-[#F5E6D3] px-2 py-0.5 rounded">Employeur {ce.employer_pct}%</span>
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
                      <li><strong>{ce.employer_pct}%</strong> pris en charge par {prospect.societe}</li>
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

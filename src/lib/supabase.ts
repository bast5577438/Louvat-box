import { createClient } from '@supabase/supabase-js';

/**
 * Client Supabase "navigateur" — utilisé côté client (pages 'use client')
 * pour l'authentification (inscription/connexion) et la lecture/écriture
 * de l'espace abonné, protégées par les règles RLS (chaque client ne voit
 * que sa propre ligne dans la table `abonnes`).
 */
/**
 * Valeurs de repli utilisées uniquement si les variables d'environnement
 * Supabase ne sont pas encore configurées (ex: build local sans .env, ou
 * intégration Vercel pas encore terminée). Cela évite de faire planter la
 * génération des pages ; les appels d'authentification échoueront alors
 * proprement à l'exécution avec un message d'erreur réseau.
 */
const PLACEHOLDER_URL = 'https://placeholder.supabase.co';
const PLACEHOLDER_KEY = 'placeholder-anon-key';

export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || PLACEHOLDER_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || PLACEHOLDER_KEY;

  return createClient(url, anonKey);
}

/**
 * Client Supabase "admin" — utilisé UNIQUEMENT côté serveur (routes API),
 * avec la clé service_role qui contourne les règles RLS. Ne jamais exposer
 * cette clé ni ce client au navigateur.
 */
export function getSupabaseAdminClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || PLACEHOLDER_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || PLACEHOLDER_KEY;

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export type Abonne = {
  id: number;
  user_id: string | null;
  code: string | null;
  name: string | null;
  prenom: string | null;
  email: string;
  formule: string | null;
  box_id: string | null;
  engagement: string | null;
  prix: number | null;
  ce_code: string | null;
  selections: number[] | null;
  statut: 'actif' | 'pause' | 'résilié';
  date_inscription: string | null;
};

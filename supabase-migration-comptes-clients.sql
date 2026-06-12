-- ============================================================
-- Louvat Box — Migration : comptes clients (espace abonné)
-- À coller et exécuter dans Supabase > SQL Editor > New query
-- ============================================================

-- 1) Table ABONNES : on ajoute les colonnes nécessaires à l'espace client
alter table abonnes
  add column if not exists user_id uuid references auth.users(id) on delete set null,
  add column if not exists prenom text,
  add column if not exists box_id text,
  add column if not exists engagement text,
  add column if not exists prix numeric(10,2),
  add column if not exists ce_code text,
  add column if not exists selections jsonb default '[]'::jsonb,
  add column if not exists date_inscription date default current_date;

-- "code" et "formule" deviennent optionnels (remplis plus tard, à l'abonnement)
alter table abonnes alter column code drop not null;
alter table abonnes alter column formule drop not null;

-- 2) Table PRODUITS : champs catalogue complémentaires
alter table produits
  add column if not exists image text,
  add column if not exists badge text,
  add column if not exists allergens jsonb default '[]'::jsonb;

-- 3) Table CE_CODES : nom du contact entreprise
alter table ce_codes
  add column if not exists contact text;

-- 4) Sécurité (RLS) : chaque client ne voit / modifie QUE sa propre ligne.
--    L'espace admin (clé service_role) n'est pas concerné par ces règles.
alter table abonnes enable row level security;

drop policy if exists "Clients lisent leur espace" on abonnes;
create policy "Clients lisent leur espace"
  on abonnes for select
  using (auth.uid() = user_id);

drop policy if exists "Clients modifient leur espace" on abonnes;
create policy "Clients modifient leur espace"
  on abonnes for update
  using (auth.uid() = user_id);

-- 5) Création automatique de l'espace abonné à l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.abonnes (user_id, name, email, statut)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''), new.email, 'actif')
  on conflict (email) do update set user_id = excluded.user_id;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

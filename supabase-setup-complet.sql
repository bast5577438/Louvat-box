-- ============================================================
-- Louvat Box — Script d'installation complet (nouvelle base Supabase)
-- À coller en UNE FOIS dans Supabase > SQL Editor > New query, puis "Run"
--
-- Crée les 3 tables nécessaires au site (produits, ce_codes, abonnes),
-- active la sécurité (RLS), et met en place la création automatique
-- de l'espace abonné lors de l'inscription d'un client.
-- ============================================================

-- ------------------------------------------------------------
-- 1) Table des produits (catalogue de biscuits)
-- ------------------------------------------------------------
create table if not exists produits (
  id serial primary key,
  name text not null,
  description text,
  category text,
  price numeric(10,2),
  image text,
  badge text,
  available boolean default true,
  allergens jsonb default '[]'::jsonb,
  created_at timestamp default now()
);

-- ------------------------------------------------------------
-- 2) Table des codes CE (entreprises partenaires)
-- ------------------------------------------------------------
create table if not exists ce_codes (
  id serial primary key,
  code text unique not null,
  societe text not null,
  contact text,
  email text not null,
  employer_pct integer default 30,
  abonnes integer default 0,
  actif boolean default true,
  created_at timestamp default now()
);

-- ------------------------------------------------------------
-- 3) Table des abonnés (espaces clients)
-- ------------------------------------------------------------
create table if not exists abonnes (
  id serial primary key,
  user_id uuid references auth.users(id) on delete set null,
  code text,
  name text,
  prenom text,
  email text unique not null,
  formule text,
  box_id text,
  engagement text,
  prix numeric(10,2),
  ce_code text,
  selections jsonb default '[]'::jsonb,
  statut text default 'actif',
  date_inscription date default current_date
);

-- ------------------------------------------------------------
-- 4) Sécurité (RLS)
-- ------------------------------------------------------------

-- "produits" et "ce_codes" : données publiques (catalogue, partenaires)
-- → tout le monde peut les consulter, le site (admin) peut les modifier
alter table produits enable row level security;
alter table ce_codes enable row level security;

drop policy if exists "Lecture publique" on produits;
create policy "Lecture publique" on produits for select using (true);
drop policy if exists "Ecriture via le site" on produits;
create policy "Ecriture via le site" on produits for all using (true) with check (true);

drop policy if exists "Lecture publique" on ce_codes;
create policy "Lecture publique" on ce_codes for select using (true);
drop policy if exists "Ecriture via le site" on ce_codes;
create policy "Ecriture via le site" on ce_codes for all using (true) with check (true);

-- "abonnes" : données personnelles des clients (RGPD).
-- Chaque client ne voit / modifie QUE sa propre ligne (via son compte).
-- L'espace admin (clé service_role) n'est pas concerné par ces règles
-- et peut tout lire/modifier/supprimer.
alter table abonnes enable row level security;

drop policy if exists "Clients lisent leur espace" on abonnes;
create policy "Clients lisent leur espace"
  on abonnes for select
  using (auth.uid() = user_id);

drop policy if exists "Clients modifient leur espace" on abonnes;
create policy "Clients modifient leur espace"
  on abonnes for update
  using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 5) Création automatique de l'espace abonné à l'inscription
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.abonnes (user_id, name, prenom, email, statut)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nom', ''),
    coalesce(new.raw_user_meta_data->>'prenom', ''),
    new.email,
    'actif'
  )
  on conflict (email) do update set user_id = excluded.user_id;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

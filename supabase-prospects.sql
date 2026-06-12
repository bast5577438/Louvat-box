-- Table des contacts entreprise (onglet "Prospectus" de l'admin).
-- A coller dans l'editeur SQL de Supabase, une seule fois.

create table if not exists prospects (
  id serial primary key,
  societe text not null,
  contact text not null,
  email text not null,
  date_ajout date default now()
);

alter table prospects enable row level security;

drop policy if exists "Lecture publique" on prospects;
create policy "Lecture publique" on prospects for select using (true);
drop policy if exists "Ecriture via le site" on prospects;
create policy "Ecriture via le site" on prospects for all using (true) with check (true);

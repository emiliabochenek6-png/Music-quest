-- Music Quest — cloud progress sync schema.
--
-- Wklej to w całości w Supabase → SQL Editor → New query → Run, w swoim
-- projekcie. To jedyne miejsce, gdzie ten schemat istnieje — nie ma tu
-- żadnych automatycznych migracji, uruchamia się to ręcznie raz (i
-- ponownie, ręcznie, gdyby kiedyś trzeba było go zmienić).
--
-- Jedna tabela, jeden wiersz na konto — dwie kolumny JSONB dokładnie
-- odzwierciedlają to, co apka już trzyma lokalnie w AsyncStorage:
-- ProgressState (context/ProgressContext.tsx) i GamificationState
-- (context/GamificationContext.tsx). Row Level Security (RLS) jest tym,
-- co faktycznie chroni dane — NIE tajność klucza `anon` (ten klucz jest
-- bezpieczny do trzymania w kodzie klienckim, tak jak jest tu użyty).

create table if not exists app_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  progress jsonb not null default '{}'::jsonb,
  gamification jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table app_state enable row level security;

create policy "użytkownik czyta tylko swój rekord"
  on app_state for select
  using (auth.uid() = user_id);

create policy "użytkownik zapisuje tylko swój rekord"
  on app_state for insert
  with check (auth.uid() = user_id);

create policy "użytkownik aktualizuje tylko swój rekord"
  on app_state for update
  using (auth.uid() = user_id);

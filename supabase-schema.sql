create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  wish text,
  status text not null default 'confirmed',
  created_at timestamptz not null default now()
);

-- Thêm cột lời chúc cho database hiện có.
alter table public.guests
  add column if not exists wish text;

alter table public.guests
  drop constraint if exists guests_wish_length;

alter table public.guests
  add constraint guests_wish_length
  check (wish is null or char_length(wish) <= 500);

alter table public.guests enable row level security;

create policy "Anyone can submit guest name"
on public.guests
for insert
to anon, authenticated
with check (char_length(trim(name)) between 1 and 100);

drop policy if exists "Anyone can view wishes" on public.guests;

create policy "Anyone can view wishes"
on public.guests
for select
to anon, authenticated
using (wish is not null and char_length(trim(wish)) > 0);

create policy "Authenticated admins can view guests"
on public.guests
for select
to authenticated
using (true);

create policy "Authenticated admins can delete guests"
on public.guests
for delete
to authenticated
using (true);

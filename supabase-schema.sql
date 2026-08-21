create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null default 'confirmed',
  created_at timestamptz not null default now()
);

alter table public.guests enable row level security;

create policy "Anyone can submit guest name"
on public.guests
for insert
to anon, authenticated
with check (char_length(trim(name)) between 1 and 100);

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

-- Run this in your Supabase SQL editor

-- Cities table
create table if not exists cities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

-- Seed cities
insert into cities (name) values
  ('Tokyo'), ('Kyoto'), ('Osaka'), ('Nara'),
  ('Hiroshima'), ('Sapporo'), ('Fukuoka'), ('Hakone')
on conflict (name) do nothing;

-- Entries table
create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references cities(id) on delete cascade,
  type text not null check (type in ('destination','restaurant','shopping','hotel','video')),
  name text not null,
  address text,
  google_maps_url text,
  notes text,
  priority text not null default 'nice-to-have' check (priority in ('must-do','nice-to-have')),
  video_source text check (video_source in ('upload','link')),
  video_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger entries_updated_at
  before update on entries
  for each row execute procedure update_updated_at();

-- Public access (no auth required)
alter table cities enable row level security;
alter table entries enable row level security;

create policy "public read cities" on cities for select using (true);
create policy "public insert cities" on cities for insert with check (true);
create policy "public update cities" on cities for update using (true);
create policy "public delete cities" on cities for delete using (true);

create policy "public read entries" on entries for select using (true);
create policy "public insert entries" on entries for insert with check (true);
create policy "public update entries" on entries for update using (true);
create policy "public delete entries" on entries for delete using (true);

-- Storage bucket for video uploads
-- Run in Supabase dashboard: Storage > New bucket > name: "videos", Public: true

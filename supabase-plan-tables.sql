-- Run this in Supabase SQL Editor

-- City date ranges: when are you in each city?
create table if not exists city_dates (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references cities(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  constraint city_dates_city_id_unique unique (city_id),
  constraint city_dates_order check (end_date >= start_date)
);

-- Calendar entries: which entries are scheduled on which day?
create table if not exists calendar_entries (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references entries(id) on delete cascade,
  scheduled_date date not null,
  constraint calendar_entries_unique unique (entry_id, scheduled_date)
);

-- RLS
alter table city_dates enable row level security;
alter table calendar_entries enable row level security;

create policy "public read city_dates" on city_dates for select using (true);
create policy "public insert city_dates" on city_dates for insert with check (true);
create policy "public update city_dates" on city_dates for update using (true);
create policy "public delete city_dates" on city_dates for delete using (true);

create policy "public read calendar_entries" on calendar_entries for select using (true);
create policy "public insert calendar_entries" on calendar_entries for insert with check (true);
create policy "public update calendar_entries" on calendar_entries for update using (true);
create policy "public delete calendar_entries" on calendar_entries for delete using (true);

-- Track each scrape run (Google Maps, LinkedIn, future sources)
create table if not exists public.searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source text not null check (source in ('google_maps', 'linkedin')),
  query text not null default '',
  status text not null default 'running'
    check (status in ('running', 'succeeded', 'failed')),
  apify_run_id text,
  apify_dataset_id text,
  input jsonb not null default '{}',
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists searches_user_id_created_at_idx
  on public.searches (user_id, created_at desc);

alter table public.searches enable row level security;

create policy "Users read own searches"
  on public.searches for select
  using (auth.uid() = user_id);

create policy "Users insert own searches"
  on public.searches for insert
  with check (auth.uid() = user_id);

create policy "Users update own searches"
  on public.searches for update
  using (auth.uid() = user_id);

-- Add standardized columns to leads
alter table public.leads add column if not exists source text;
alter table public.leads add column if not exists name text;
alter table public.leads add column if not exists profile_url text;
alter table public.leads add column if not exists location text;
alter table public.leads add column if not exists search_id uuid references public.searches(id) on delete set null;
alter table public.leads add column if not exists raw_data jsonb not null default '{}';

-- Backfill from legacy Google Maps columns
update public.leads
set
  source = coalesce(source, 'google_maps'),
  name = coalesce(nullif(name, ''), company_name, ''),
  profile_url = coalesce(nullif(profile_url, ''), source_url, ''),
  location = coalesce(
    nullif(location, ''),
    nullif(trim(both ', ' from concat_ws(', ', nullif(city, ''), nullif(country, ''))), ''),
    address,
    ''
  ),
  raw_data = case
    when raw_data is null or raw_data = '{}'::jsonb then jsonb_strip_nulls(jsonb_build_object(
      'category', nullif(category, ''),
      'rating', rating,
      'address', nullif(address, ''),
      'city', nullif(city, ''),
      'country', nullif(country, ''),
      'socialLinks', social_links,
      'searchQuery', nullif(search_query, '')
    ))
    else raw_data
  end
where source is null
   or name is null
   or profile_url is null
   or location is null;

alter table public.leads alter column source set default 'google_maps';
alter table public.leads alter column source set not null;
alter table public.leads alter column name set default '';
alter table public.leads alter column name set not null;
alter table public.leads alter column profile_url set default '';
alter table public.leads alter column profile_url set not null;
alter table public.leads alter column location set default '';
alter table public.leads alter column location set not null;

alter table public.leads drop constraint if exists leads_source_check;
alter table public.leads add constraint leads_source_check
  check (source in ('google_maps', 'linkedin'));

-- Drop legacy columns superseded by name / profile_url / location / raw_data
alter table public.leads drop column if exists company_name;
alter table public.leads drop column if exists category;
alter table public.leads drop column if exists address;
alter table public.leads drop column if exists city;
alter table public.leads drop column if exists country;
alter table public.leads drop column if exists rating;
alter table public.leads drop column if exists social_links;
alter table public.leads drop column if exists source_url;
alter table public.leads drop column if exists search_query;

create index if not exists leads_search_id_idx on public.leads (search_id);
create index if not exists leads_user_id_source_scraped_at_idx
  on public.leads (user_id, source, scraped_at desc);

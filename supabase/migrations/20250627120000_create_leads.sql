create table if not exists public.leads (
  id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  company_name text not null default '',
  category text not null default '',
  website text not null default '',
  phone text not null default '',
  email text not null default '',
  address text not null default '',
  city text not null default '',
  country text not null default '',
  rating numeric,
  social_links jsonb not null default '{}',
  source_url text not null default '',
  scraped_at timestamptz not null default now(),
  search_query text not null default '',
  primary key (user_id, id)
);

create index if not exists leads_user_id_scraped_at_idx on public.leads (user_id, scraped_at desc);

alter table public.leads enable row level security;

create policy "Users read own leads"
  on public.leads for select
  using (auth.uid() = user_id);

create policy "Users insert own leads"
  on public.leads for insert
  with check (auth.uid() = user_id);

create policy "Users delete own leads"
  on public.leads for delete
  using (auth.uid() = user_id);

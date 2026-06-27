# LeadScraper

Find verified business leads from Google Maps. Search by keyword and location, store leads in Supabase, and export to CSV.

## Requirements

- Node.js >= 22.12.0
- [Apify](https://console.apify.com/account/integrations) API token
- [Supabase](https://supabase.com) project (auth + leads database)

## Setup

```bash
cp .env.example .env
```

Add to `.env`:

```env
APIFY_API_TOKEN=your_apify_token
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

Apply the database migration:

```bash
# Via Supabase SQL Editor, run:
# supabase/migrations/20250627120000_create_leads.sql
```

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build (Cloudflare Pages) |
| `npm run preview` | Preview production build |

## Deploy to Cloudflare Pages

See [DEPLOY.md](DEPLOY.md) for full instructions.

## How it works

1. Sign in via Supabase
2. Run a search from the **Dashboard** (async Apify scrape with progress polling)
3. Leads save to **Supabase** (`leads` table, per-user RLS)
4. View, filter, and export from **Results**

## Project structure

```
src/
  pages/          Routes and API endpoints
  components/     React UI islands
  lib/            Apify, Supabase, auth, db helpers
supabase/
  migrations/     Postgres schema
```

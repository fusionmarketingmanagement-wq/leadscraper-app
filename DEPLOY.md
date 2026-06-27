# Deploy LeadScraper to Cloudflare Pages

## Prerequisites

- GitHub repo pushed: `fusionmarketingmanagement-wq/leadscraper-app`
- Cloudflare account
- Supabase project with `leads` table migration applied (see `supabase/migrations/`)
- Apify API token

## 1. Apply Supabase migration

Run the SQL in [`supabase/migrations/20250627120000_create_leads.sql`](supabase/migrations/20250627120000_create_leads.sql) via Supabase Dashboard → SQL Editor, or:

```bash
supabase db push
```

## 2. Supabase Auth URLs (required)

Supabase Dashboard → **Authentication** → **URL Configuration**:

| Field | Value |
|-------|-------|
| Site URL | `https://<your-project>.pages.dev` |
| Redirect URLs | `https://<your-project>.pages.dev/**` |

Add your custom domain URLs too if you connect one.

## 3. Connect Cloudflare Pages to GitHub

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Select `fusionmarketingmanagement-wq/leadscraper-app`
3. Build settings:

| Setting | Value |
|---------|-------|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` (repo root is the app) |

If the repo root is `leadscraper-app` subfolder, set root to `leadscraper-app`.

## 4. Environment variables (Cloudflare Pages → Settings → Variables)

| Variable | Encrypted |
|----------|-----------|
| `APIFY_API_TOKEN` | Yes |
| `PUBLIC_SUPABASE_URL` | No |
| `PUBLIC_SUPABASE_PUBLISHABLE_KEY` | No |

Use the same values as your local `.env` file.

## 5. Deploy

Push to `main` — Cloudflare builds and deploys automatically.

Or deploy manually:

```bash
npm run build
npx wrangler pages deploy dist
```

## 6. Verify

1. Open your `*.pages.dev` URL
2. Sign in
3. Settings → Apify shows **Configured** → **Test** → Valid
4. Run a dashboard search (async polling — may take 1–3 minutes)
5. Check Results and CSV export

## Notes

- Leads are stored in **Supabase Postgres** (per user, RLS enabled)
- Scraping uses **async Apify** with client polling (Cloudflare request timeout safe)
- Local `data/leads.json` is no longer used in production

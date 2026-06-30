import { createBrowserClient, createServerClient, parseCookieHeader, type CookieMethodsServer } from '@supabase/ssr'
import type { AstroCookies } from 'astro'
import type { PublicSupabaseConfig } from './env'
import { isPublicSupabaseConfigured } from './env'

function assertConfigured(): void {
  throw new Error(
    '[LeadScraper] Supabase is not configured.\n' +
    'Add these to your environment:\n' +
    '  PUBLIC_SUPABASE_URL=https://your-project.supabase.co\n' +
    '  PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key\n' +
    'On Cloudflare Pages: Settings → Environment variables → redeploy.'
  )
}

export function isSupabaseConfigured(config: PublicSupabaseConfig): boolean {
  return isPublicSupabaseConfigured(config)
}

export function getBrowserClient(url: string, key: string) {
  return createBrowserClient(url, key)
}

export function getServerClient(
  request: Request,
  astroCookies: AstroCookies,
  config: PublicSupabaseConfig
) {
  const { url: supabaseUrl, key: supabaseAnonKey } = config
  if (!supabaseUrl || !supabaseAnonKey) {
    assertConfigured()
  }

  const cookies: CookieMethodsServer = {
    getAll() {
      return parseCookieHeader(request.headers.get('Cookie') ?? '').map(
        ({ name, value }) => ({ name, value: value ?? '' })
      )
    },
    setAll(cookiesToSet) {
      cookiesToSet.forEach(({ name, value, options }) => {
        astroCookies.set(name, value, options as Parameters<AstroCookies['set']>[2])
      })
    },
  }

  return createServerClient(supabaseUrl!, supabaseAnonKey!, { cookies })
}

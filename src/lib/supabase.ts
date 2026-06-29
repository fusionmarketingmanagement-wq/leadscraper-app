import { createBrowserClient, createServerClient, parseCookieHeader, type CookieMethodsServer } from '@supabase/ssr'
import type { AstroCookies } from 'astro'
import { getPublicSupabaseConfig, isPublicSupabaseConfigured } from './env'

export function isSupabaseConfigured(): boolean {
  return isPublicSupabaseConfigured(getPublicSupabaseConfig())
}

function assertConfigured(): void {
  const { url, key } = getPublicSupabaseConfig()
  if (!url || !key) {
    throw new Error(
      '[LeadScraper] Supabase is not configured.\n' +
      'Add these to your .env file:\n' +
      '  PUBLIC_SUPABASE_URL=https://your-project.supabase.co\n' +
      '  PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key\n' +
      'Get them from: Supabase Dashboard → Settings → API'
    )
  }
}

export function getBrowserClient(url?: string, key?: string) {
  const config = url && key ? { url, key } : getPublicSupabaseConfig()
  if (!config.url || !config.key) {
    assertConfigured()
  }
  return createBrowserClient(config.url!, config.key!)
}

export function getServerClient(request: Request, astroCookies: AstroCookies) {
  const { url: supabaseUrl, key: supabaseAnonKey } = getPublicSupabaseConfig()
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

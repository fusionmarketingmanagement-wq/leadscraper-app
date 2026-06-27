import { createBrowserClient, createServerClient, parseCookieHeader, type CookieMethodsServer } from '@supabase/ssr'
import type { AstroCookies } from 'astro'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY as string | undefined

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

function assertConfigured(): void {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      '[LeadScraper] Supabase is not configured.\n' +
      'Add these to your .env file:\n' +
      '  PUBLIC_SUPABASE_URL=https://your-project.supabase.co\n' +
      '  PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key\n' +
      'Get them from: Supabase Dashboard → Settings → API'
    )
  }
}

export function getBrowserClient() {
  assertConfigured()
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!)
}

export function getServerClient(request: Request, astroCookies: AstroCookies) {
  assertConfigured()

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

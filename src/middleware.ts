import { defineMiddleware } from 'astro:middleware'
import { createServerClient, parseCookieHeader, type CookieMethodsServer } from '@supabase/ssr'

const PROTECTED_PAGES = ['/dashboard', '/results', '/settings']
const PROTECTED_API_PREFIXES = ['/api/scrape', '/api/leads', '/api/export', '/api/settings', '/api/status', '/api/collect']

function isProtectedPage(pathname: string): boolean {
  return PROTECTED_PAGES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  )
}

function isProtectedApi(pathname: string): boolean {
  return PROTECTED_API_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  )
}

export const onRequest = defineMiddleware(async (context, next) => {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined
  const supabaseKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY as string | undefined

  if (!supabaseUrl || !supabaseKey) {
    context.locals.user = null
    return next()
  }

  const cookies: CookieMethodsServer = {
    getAll() {
      return parseCookieHeader(context.request.headers.get('Cookie') ?? '').map(
        ({ name, value }) => ({ name, value: value ?? '' })
      )
    },
    setAll(cookiesToSet) {
      cookiesToSet.forEach(({ name, value, options }) => {
        context.cookies.set(name, value, options as Parameters<typeof context.cookies.set>[2])
      })
    },
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, { cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  context.locals.user = user ?? null

  const { pathname } = context.url

  if (!user && (isProtectedPage(pathname) || isProtectedApi(pathname))) {
    if (isProtectedApi(pathname)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return context.redirect(`/signin?redirect=${encodeURIComponent(pathname)}`)
  }

  if (pathname === '/signin' && user) {
    return context.redirect('/dashboard')
  }

  return next()
})

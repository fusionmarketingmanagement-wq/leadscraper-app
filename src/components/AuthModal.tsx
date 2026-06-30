import { useState, useEffect } from 'react'
import { getBrowserClient } from '../lib/supabase'

type Tab = 'signup' | 'signin'

interface Props {
  standalone?: boolean
  defaultTab?: Tab
  supabaseUrl?: string
  supabaseKey?: string
}

function getPostAuthRedirect(): string {
  const redirect = new URLSearchParams(window.location.search).get('redirect')
  if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
    return redirect
  }
  return '/dashboard'
}

export default function AuthModal({
  standalone = false,
  defaultTab = 'signup',
  supabaseUrl,
  supabaseKey,
}: Props) {
  const [open, setOpen] = useState(standalone)
  const [tab, setTab] = useState<Tab>(defaultTab)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (standalone) return
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ tab: Tab }>
      setTab(ce.detail?.tab ?? 'signup')
      setError('')
      setMessage('')
      setOpen(true)
    }
    document.addEventListener('open-auth-modal', handler)
    return () => document.removeEventListener('open-auth-modal', handler)
  }, [standalone])

  useEffect(() => {
    if (standalone) return
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open, standalone])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (!supabaseUrl || !supabaseKey) {
      setError(
        'Supabase is not configured. In Cloudflare Pages go to Settings → Environment variables, add PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_PUBLISHABLE_KEY, then redeploy.'
      )
      setLoading(false)
      return
    }

    const supabase = getBrowserClient(supabaseUrl, supabaseKey)

    if (tab === 'signup') {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      })
      if (err) {
        setError(err.message)
      } else if (data.session) {
        window.location.href = getPostAuthRedirect()
      } else {
        setMessage('Account created! Check your email to confirm, then sign in.')
      }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) {
        setError(err.message)
      } else {
        window.location.href = getPostAuthRedirect()
      }
    }

    setLoading(false)
  }

  function reset() {
    setName(''); setEmail(''); setPassword(''); setError(''); setMessage('')
  }

  function switchTab(next: Tab) {
    setTab(next)
    reset()
  }

  const inputCls =
    'w-full h-10 px-3 rounded-md border border-[#ebebeb] bg-white text-[#171717] text-sm placeholder:text-[#888888] focus:outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717]/10 transition-all'

  const card = (
    <div
      className="w-full max-w-sm rounded-xl border border-[#ebebeb] bg-white overflow-hidden"
      style={{ boxShadow: '0px 1px 1px #00000005, 0px 8px 16px -4px #0000000a, 0px 24px 32px -8px #0000000f' }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-5 border-b border-[#ebebeb]">
        <div className="flex items-center gap-2.5 mb-5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #a855f7 100%)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" fill="white" fillOpacity="0.95" />
              <circle cx="12" cy="10" r="3" fill="white" fillOpacity="0.45" />
            </svg>
          </div>
          <span className="font-semibold text-[#171717] text-sm">LeadScraper</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-lg bg-[#f5f5f5] border border-[#ebebeb]">
          {(['signup', 'signin'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => switchTab(t)}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                tab === t
                  ? 'bg-white text-[#171717] shadow-sm border border-[#ebebeb]'
                  : 'text-[#888888] hover:text-[#171717]'
              }`}
            >
              {t === 'signup' ? 'Create account' : 'Sign in'}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-3">
        {tab === 'signup' && (
          <div>
            <label className="block text-xs font-medium text-[#4d4d4d] mb-1.5">Full name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Smith"
              className={inputCls}
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-[#4d4d4d] mb-1.5">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@company.com"
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#4d4d4d] mb-1.5">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            className={inputCls}
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500 mt-0.5 shrink-0">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-xs text-red-700 leading-relaxed">{error}</p>
          </div>
        )}

        {message && (
          <div className="flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600 mt-0.5 shrink-0">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <p className="text-xs text-emerald-700 leading-relaxed">{message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 rounded-md bg-[#171717] text-white text-sm font-medium hover:bg-[#2d2d2d] disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-1"
        >
          {loading ? 'Please wait…' : tab === 'signup' ? 'Create account' : 'Sign in'}
        </button>
      </form>

      {/* Footer */}
      <div className="px-6 pb-6 -mt-1">
        <p className="text-center text-xs text-[#888888]">
          {tab === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
          <button
            type="button"
            onClick={() => switchTab(tab === 'signup' ? 'signin' : 'signup')}
            className="text-[#171717] hover:text-[#4d4d4d] transition-colors underline underline-offset-2"
          >
            {tab === 'signup' ? 'Sign in' : 'Create one'}
          </button>
        </p>
      </div>
    </div>
  )

  if (!open && !standalone) return null

  if (standalone) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
        {card}
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
      onClick={() => setOpen(false)}
    >
      {card}
    </div>
  )
}

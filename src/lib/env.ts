export type PublicSupabaseConfig = {
  url: string | undefined
  key: string | undefined
}

export function getPublicSupabaseConfig(): PublicSupabaseConfig {
  return {
    url: import.meta.env.PUBLIC_SUPABASE_URL,
    key: import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  }
}

export function isPublicSupabaseConfigured(config: PublicSupabaseConfig): boolean {
  return Boolean(config.url && config.key)
}

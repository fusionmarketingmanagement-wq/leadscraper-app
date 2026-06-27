/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string
  readonly PUBLIC_SUPABASE_PUBLISHABLE_KEY: string
  readonly APIFY_API_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare namespace App {
  interface Locals {
    user: import('@supabase/supabase-js').User | null
  }
}

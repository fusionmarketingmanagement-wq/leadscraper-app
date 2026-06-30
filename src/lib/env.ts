export type PublicSupabaseConfig = {
  url: string | undefined
  key: string | undefined
}

type WorkerEnv = {
  PUBLIC_SUPABASE_URL?: string
  PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string
  APIFY_API_TOKEN?: string
}

let workerEnvPromise: Promise<WorkerEnv | null> | null = null

function loadWorkerEnv(): Promise<WorkerEnv | null> {
  if (!workerEnvPromise) {
    workerEnvPromise = import('cloudflare:workers')
      .then((mod) => (mod.env ?? null) as WorkerEnv)
      .catch(() => null)
  }
  return workerEnvPromise
}

function fromImportMeta(): PublicSupabaseConfig {
  return {
    url: import.meta.env.PUBLIC_SUPABASE_URL,
    key: import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  }
}

export async function getPublicSupabaseConfig(): Promise<PublicSupabaseConfig> {
  const meta = fromImportMeta()
  if (meta.url && meta.key) return meta

  const workerEnv = await loadWorkerEnv()
  if (!workerEnv) return meta

  return {
    url: workerEnv.PUBLIC_SUPABASE_URL ?? meta.url,
    key: workerEnv.PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? meta.key,
  }
}

export function isPublicSupabaseConfigured(config: PublicSupabaseConfig): boolean {
  return Boolean(config.url && config.key)
}

export async function getApifyToken(): Promise<string | undefined> {
  const fromMeta = import.meta.env.APIFY_API_TOKEN
  if (fromMeta) return fromMeta

  const workerEnv = await loadWorkerEnv()
  return workerEnv?.APIFY_API_TOKEN ?? fromMeta
}

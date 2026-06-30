import { getBrowserClient } from '../lib/supabase'

interface Props {
  supabaseUrl?: string
  supabaseKey?: string
}

export default function SignOutButton({ supabaseUrl, supabaseKey }: Props) {
  async function handleSignOut() {
    if (!supabaseUrl || !supabaseKey) {
      window.location.assign('/')
      return
    }

    const supabase = getBrowserClient(supabaseUrl, supabaseKey)
    await supabase.auth.signOut()
    window.location.assign('/')
  }

  return (
    <button
      type="button"
      onClick={() => void handleSignOut()}
      className="flex items-center gap-1.5 px-3.5 h-8 text-sm font-medium text-[#171717] bg-white hover:bg-[#f5f5f5] rounded-md border border-[#ebebeb] transition-all cursor-pointer"
    >
      Sign out
    </button>
  )
}

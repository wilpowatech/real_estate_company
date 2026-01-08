import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_REAL_ESTATESUPABASE_URL!,
    process.env.NEXT_PUBLIC_REAL_ESTATESUPABASE_ANON_KEY!,
  )
}

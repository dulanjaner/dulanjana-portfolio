import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { isSupabaseConfigured, getNormalizedSupabaseUrl } from "./client";

/**
 * Creates a server-side Supabase client with Next.js App Router async cookie store.
 * Automatically respects Row Level Security (RLS) based on the active user session.
 */
export async function createClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(
    getNormalizedSupabaseUrl()!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This is ignored when session refreshing is handled via middleware.
          }
        },
      },
    }
  );
}

/**
 * Privileged server-only Supabase client using the Service Role Key.
 *
 * CRITICAL SECURITY RULES:
 * 1. NEVER import this function into Client Components.
 * 2. Only use for backend tasks (e.g., initial system migrations or server actions where auth is verified).
 * 3. Standard operations should ALWAYS prefer createClient() with authenticated RLS.
 */
export function createAdminClient() {
  const supabaseUrl = getNormalizedSupabaseUrl();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase Service Role configuration (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)."
    );
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

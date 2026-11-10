import { createBrowserClient } from "@supabase/ssr";

/**
 * Normalizes Supabase URL to origin (e.g., https://xyz.supabase.co).
 */
export function getNormalizedSupabaseUrl(): string | undefined {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!rawUrl) return undefined;
  try {
    const parsed = new URL(rawUrl);
    return parsed.origin;
  } catch {
    return rawUrl;
  }
}

/**
 * Checks whether Supabase credentials are configured.
 */
export function isSupabaseConfigured(): boolean {
  const url = getNormalizedSupabaseUrl();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  return Boolean(
    url &&
    anonKey &&
    url.startsWith("https://") &&
    !url.includes("your-project-id") &&
    !anonKey.includes("...")
  );
}

/**
 * Creates a Supabase browser client.
 */
export function createClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!rawUrl || !anonKey) {
    throw new Error(
      "Supabase environment variables are missing. Check .env.local."
    );
  }

  try {
    const parsedUrl = new URL(rawUrl);

    if (
      parsedUrl.protocol !== "https:" ||
      !parsedUrl.hostname.endsWith(".supabase.co")
    ) {
      throw new Error(
        "Invalid Supabase project URL. Expected format: https://<project-id>.supabase.co"
      );
    }

    if (anonKey.includes("...")) {
      throw new Error(
        "The Supabase API key appears to be incomplete."
      );
    }

    return createBrowserClient(parsedUrl.origin, anonKey);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Invalid Supabase URL format.");
    }

    throw error;
  }
}
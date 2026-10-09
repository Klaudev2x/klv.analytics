export function requireEnv(name: string): string {
  const v = import.meta.env[name] as string | undefined;
  if (!v || !v.trim()) {
    throw new Error(
      `Supabase configuration error: missing required environment variable ${name}. ` +
        `Set it in your .env (VITE_*) and ensure Vite is restarted.`,
    );
  }
  return v;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

/**
 * Reads config without throwing — returns a descriptive error instead.
 * The app shell uses this to render a setup screen rather than whitescreen.
 */
export function getSupabaseConfig(): { config: SupabaseConfig; error: null } | { config: null; error: string } {
  const url = (import.meta.env["VITE_SUPABASE_URL"] as string | undefined)?.trim();
  const anonKey = (import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined)?.trim();

  const missing: string[] = [];
  if (!url) missing.push("VITE_SUPABASE_URL");
  if (!anonKey) missing.push("VITE_SUPABASE_ANON_KEY");
  if (missing.length > 0) {
    return {
      config: null,
      error:
        `Missing required environment variable${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}. ` +
        `Add them to your .env file locally, or to Project Settings → Environment Variables on Vercel, then redeploy.`,
    };
  }

  const isHttps = /^https:\/\//i.test(url!);
  const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(url!);

  if ((!isHttps && !isLocalhost) || /\s/.test(url!)) {
    return {
      config: null,
      error: `VITE_SUPABASE_URL must be an https:// URL (http:// allowed only for localhost). Got: ${url}`,
    };
  }

  return { config: { url: url!, anonKey: anonKey! }, error: null };
}

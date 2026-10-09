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

export function requireSupabaseConfig() {
  const url = requireEnv("VITE_SUPABASE_URL");
  const anonKey = requireEnv("VITE_SUPABASE_ANON_KEY");

  const isHttps = /^https:\/\//i.test(url);
  const isLocalhost = /^http:\/\/localhost(:\d+)?/i.test(url) || /^http:\/\/127\.0\.0\.1(:\d+)?/i.test(url);

  if ((!isHttps && !isLocalhost) || /\s/.test(url)) {
    throw new Error(
      `Supabase configuration error: VITE_SUPABASE_URL must be an https:// URL (http:// allowed only for localhost). Got: ${url}`,
    );
  }

  // debugLogSupabaseConfig(url, anonKey);

  return { url, anonKey };
}

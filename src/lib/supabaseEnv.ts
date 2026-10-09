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

  if (!/^https:\/\//i.test(url) || !url.includes(".supabase.co")) {
    throw new Error(
      `Supabase configuration error: VITE_SUPABASE_URL must be a real project URL like https://xxxx.supabase.co. Got: ${url}`,
    );
  }

  // debugLogSupabaseConfig(url, anonKey);

  return { url, anonKey };
}

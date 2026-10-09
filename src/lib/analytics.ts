import { createClient } from "@supabase/supabase-js";

import { getSupabaseConfig } from "./supabaseEnv";

const result = getSupabaseConfig();

/** Null when env config is valid; otherwise a human-readable setup error. */
export const configError: string | null = result.error;

// Never throw at import time (that whitescreens the app). When env vars are
// missing we stand up a placeholder client and let the App shell render a
// setup screen instead; no query is ever issued through it.
const { url: supabaseUrl, anonKey: supabaseAnonKey } = result.config ?? {
  url: "https://placeholder.supabase.co",
  anonKey: "placeholder",
};

export { supabaseUrl, supabaseAnonKey };

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function checkConnection(): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    let response: Response;
    try {
      response = await fetch(`${supabaseUrl}/auth/v1/health`, {
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }
    if (!response.ok) {
      return {
        ok: false,
        error: `Backend health check failed (HTTP ${response.status}). The Supabase project may be paused or the URL is incorrect.`,
      };
    }
    return { ok: true };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return { ok: false, error: "Connection timed out. Please check your internet connection and try again." };
    }
    return {
      ok: false,
      error: `Cannot reach your Supabase project at ${supabaseUrl}. The project may be paused or the URL is incorrect.`,
    };
  }
}

export async function trackingEndpoint(payload: unknown) {
  const functionUrl = `${supabaseUrl}/functions/v1/analytics-track`;
  const response = await fetch(functionUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Tracking failed (HTTP ${response.status})${detail ? `: ${detail.slice(0, 200)}` : ""}`);
  }

  return response.json();
}

export async function adminApiCall(
  endpoint: string,
  method: string = "GET",
  body?: unknown,
) {
  const functionUrl = `${supabaseUrl}/functions/v1/analytics-api/${endpoint}`;

  const init: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || ""}`,
      apikey: supabaseAnonKey,
    },
  };
  // fetch() rejects bodies on GET/HEAD in some browsers — only attach for writes.
  if (body !== undefined && method !== "GET" && method !== "HEAD") {
    init.body = JSON.stringify(body);
  }

  const response = await fetch(functionUrl, init);

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`API call failed (HTTP ${response.status})${detail ? `: ${detail.slice(0, 200)}` : ""}`);
  }

  return response.json();
}

export function subscribeToEvents(
  siteId: string,
  callback: (event: unknown) => void,
) {
  const subscription = supabase
    .channel(`analytics:${siteId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "analytics_events",
        filter: `site_id=eq.${siteId}`,
      },
      (payload: { new: unknown }) => {
        callback(payload.new);
      },
    )
    .subscribe();

  return () => subscription.unsubscribe();
}

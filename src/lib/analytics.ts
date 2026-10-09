import { createClient } from "@supabase/supabase-js";

import { requireSupabaseConfig } from "./supabaseEnv";

const { url: supabaseUrl, anonKey: supabaseAnonKey } = requireSupabaseConfig();

export { supabaseUrl, supabaseAnonKey };

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function checkConnection(): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase.auth.getSession();
    if (
      error &&
      (error.message.includes("Failed to fetch") ||
        error.message.includes("ERR_NAME"))
    ) {
      return {
        ok: false,
        error: `Cannot reach your Supabase project at ${supabaseUrl}. The project may be paused or the URL is incorrect.`,
      };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: `Connection failed: ${err instanceof Error ? err.message : "Unknown error"}`,
    };
  }
}

export async function trackingEndpoint(payload: unknown) {
  const functionUrl = `${supabaseUrl}/functions/v1/analytics-track`;
  const response = await fetch(functionUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Tracking failed: ${response.statusText}`);
  }

  return response.json();
}

export async function adminApiCall(
  endpoint: string,
  method: string = "GET",
  body?: unknown,
) {
  const functionUrl = `${supabaseUrl}/functions/v1/analytics-api/${endpoint}`;

  const response = await fetch(functionUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || ""}`,
      apikey: supabaseAnonKey,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
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

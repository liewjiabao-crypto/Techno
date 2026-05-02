import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

export function isAllowedAdminEmail(email: string | undefined | null) {
  const allowListRaw = (import.meta.env.VITE_ADMIN_EMAILS as string | undefined) || "";
  const allowList = allowListRaw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  if (allowList.length === 0) return true;
  if (!email) return false;
  return allowList.includes(email.toLowerCase());
}
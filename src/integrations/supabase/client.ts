import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://bzlkbjwofykferwacwxa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_K7W23TlpWcvZ6yEim5hnPQ_-hF1v8Jb";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});

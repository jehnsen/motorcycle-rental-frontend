import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/** Cookie-free client for generateStaticParams (build time, no request context). */
export function createBuildClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

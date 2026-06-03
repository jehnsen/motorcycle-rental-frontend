import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/types";

const PROTECTED_PATHS = ["/dashboard", "/account"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const isProtected = PROTECTED_PATHS.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (!isProtected) return res;

  try {
    const supabase = createMiddlewareClient<Database>({ req, res });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  } catch {
    // Supabase env vars not set — allow access in dev (mock mode)
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*"],
};

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://fpteiupgrjdoraigcjhw.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwdGVpdXBncmpkb3JhaWdjamh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MDA5MzIsImV4cCI6MjEwMDk3NjkzMn0.sSUc6GhduRqi3TTHCNbUIFKc4PXmEQP9bd_5nC234R4";

// Auth gate: refresh session + redirect unauthenticated users to /login.
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  try {
    const sb = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (toSet) =>
          toSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          ),
      },
    });

    const {
      data: { user },
    } = await sb.auth.getUser();

    const { pathname } = request.nextUrl;
    const isAuthRoute = pathname.startsWith("/login");
    const isApiRoute = pathname.startsWith("/api/");

    if (isApiRoute) {
      return response;
    }

    // Authed user hitting /login -> send to dashboard
    if (user && isAuthRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Unauthed user hitting protected route -> login
    if (!user && !isAuthRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch (err) {
    console.error("Middleware auth check note:", err);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};

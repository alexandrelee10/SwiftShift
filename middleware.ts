import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Optimistic, cookie-only auth check for all /dashboard routes. This is a
// centralized first line of defense — it only confirms a valid session
// exists and does not replace the role/ownership checks that already live
// in each dashboard layout, server action, and API route.
export default async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    // Edge middleware's own "is this HTTPS" detection is unreliable behind
    // Vercel's proxy, so it can look for the wrong cookie name
    // (next-auth.session-token vs __Secure-next-auth.session-token) and miss
    // a session that was just set. Force it explicitly instead of guessing.
    secureCookie: process.env.NODE_ENV === "production",
  });

  if (!token) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "cfg-admin-session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin routes except the login page itself
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const session = req.cookies.get(SESSION_COOKIE);

    if (!session?.value) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Validate the session token format (base64 of "cfg-admin:<timestamp>")
    try {
      const decoded = Buffer.from(session.value, "base64").toString("utf8");
      if (!decoded.startsWith("cfg-admin:")) {
        throw new Error("invalid");
      }
    } catch {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("from", pathname);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete(SESSION_COOKIE);
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

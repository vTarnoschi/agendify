import { NextRequest, NextResponse } from "next/server";

import { verifyToken } from "./lib/auth";

const PUBLIC_PATHS = [
  "/",
  "/sign-in",
  "/sign-up",
  "/api/auth/sign-in",
  "/api/auth/sign-up",
];

export async function middleware(req: NextRequest) {
  console.log("MIDDLEWARE EXECUTADO", req.nextUrl.pathname);
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (pathname.startsWith("/dashboard")) {
    if (!token || !(await verifyToken(token))) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

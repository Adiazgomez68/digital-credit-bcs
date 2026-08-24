import { SESSION_COOKIE } from "@/constants/session";
import { NextRequest, NextResponse } from "next/server";
import { WEB_ROUTES } from "./routes/web";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === WEB_ROUTES.ADVISOR.AUTH) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!token) {
    return NextResponse.redirect(new URL(WEB_ROUTES.ADVISOR.AUTH, request.url));
  }
}

export const config = {
  matcher: "/advisor-portal/:path*",
};

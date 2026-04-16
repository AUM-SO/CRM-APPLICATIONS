import { NextRequest, NextResponse } from "next/server"

const PUBLIC_PATHS = ["/login", "/api"]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get("crm_token")?.value

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))

  // Unauthenticated user tries to access protected route -> redirect to /login
  if (!isPublic && !token) {
    const loginUrl = new URL("/login", req.url)
    return NextResponse.redirect(loginUrl)
  }

  // Authenticated user tries to access /login -> redirect to /customers
  if (pathname === "/login" && token) {
    const dashboardUrl = new URL("/customers", req.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf)).*)",
  ],
}

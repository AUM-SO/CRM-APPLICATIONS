import { NextRequest, NextResponse } from "next/server"
import { nestFetch } from "@/lib/api-client"

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))

  const upstream = await nestFetch("/login", {
    method: "POST",
    body: JSON.stringify(body),
  })

  const data = await upstream.json()

  if (!upstream.ok) {
    return NextResponse.json(data, { status: upstream.status })
  }

  const res = NextResponse.json(data, { status: upstream.status })
  res.cookies.set("crm_token", data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  })
  return res
}

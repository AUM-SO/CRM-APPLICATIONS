import { NextRequest, NextResponse } from "next/server"
import { nestFetch } from "@/lib/api-client"

async function proxy(
  req: NextRequest,
  params: { path: string[] }
): Promise<NextResponse> {
  const path = "/" + params.path.join("/")
  const search = req.nextUrl.searchParams.toString()
  const url = search ? `${path}?${search}` : path

  const token = req.cookies.get("crm_token")?.value
  const isReadMethod = ["GET", "HEAD"].includes(req.method)

  const upstream = await nestFetch(url, {
    method: req.method,
    body: isReadMethod ? undefined : await req.text(),
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })

  const text = await upstream.text()
  const contentType = upstream.headers.get("Content-Type") ?? "application/json"

  return new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": contentType },
  })
}

type RouteContext = { params: Promise<{ path: string[] }> }

export async function GET(req: NextRequest, { params }: RouteContext) {
  return proxy(req, await params)
}
export async function POST(req: NextRequest, { params }: RouteContext) {
  return proxy(req, await params)
}
export async function PUT(req: NextRequest, { params }: RouteContext) {
  return proxy(req, await params)
}
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  return proxy(req, await params)
}
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  return proxy(req, await params)
}

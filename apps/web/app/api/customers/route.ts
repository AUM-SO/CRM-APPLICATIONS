import { NextRequest, NextResponse } from "next/server";
import { nestFetch } from "@/lib/api-client";

export async function GET(req: NextRequest) {
  // Forward all query params to NestJS as-is
  const search = req.nextUrl.searchParams.toString();
  const path = search ? `/customers?${search}` : "/customers";

  const upstream = await nestFetch(path);
  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}

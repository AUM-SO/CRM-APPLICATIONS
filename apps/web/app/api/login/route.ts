import { NextRequest, NextResponse } from "next/server";
import { nestFetch } from "@/lib/api-client";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  const upstream = await nestFetch("/login", {
    method: "POST",
    body: JSON.stringify(body),
  });

  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}

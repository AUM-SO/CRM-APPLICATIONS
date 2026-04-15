import { NextRequest, NextResponse } from "next/server";
import { nestFetch } from "@/lib/api-client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const upstream = await nestFetch(`/customers/${id}`);
  const data = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}

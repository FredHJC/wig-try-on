import { NextRequest, NextResponse } from "next/server";
import { getWigById } from "@/lib/wigs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ wigId: string }> }
) {
  const { wigId } = await params;
  const wig = getWigById(wigId);

  if (!wig) {
    return NextResponse.json({ error: "Wig not found" }, { status: 404 });
  }

  return NextResponse.json(wig);
}

import { NextRequest, NextResponse } from "next/server";

const FREEPIK_API_KEY = process.env.FREEPIK_API_KEY ?? "FPSXf4b724af68364c448c82c8e7710a6575";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const res = await fetch(`https://api.freepik.com/v1/music/${id}`, {
      headers: { "x-freepik-api-key": FREEPIK_API_KEY, Accept: "application/json" },
    });
    if (!res.ok) return NextResponse.json({ error: "Not found" }, { status: res.status });
    const data = await res.json();
    return NextResponse.json({
      audioUrl: data.file_url ?? data.preview_url ?? null,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

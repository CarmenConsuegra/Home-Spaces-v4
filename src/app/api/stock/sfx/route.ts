import { NextRequest, NextResponse } from "next/server";

const FREEPIK_API_KEY = process.env.FREEPIK_API_KEY ?? "FPSXf4b724af68364c448c82c8e7710a6575";
const BASE_URL = "https://api.freepik.com/v1/sound-effects";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type RawSfxItem = {
  id: number;
  title?: string;
  tags?: string[];
  category?: { name?: string; parent?: { name?: string } | null };
  duration?: number;
  is_premium?: boolean;
  popularity?: number;
  download_count?: number;
  file_url?: string | null;
};

function normalize(item: RawSfxItem) {
  const categoryName = item.category?.parent?.name ?? item.category?.name ?? undefined;
  return {
    id: item.id,
    title: item.title ?? "Untitled",
    type: "sfx",
    audioUrl: item.file_url ?? null,
    duration: item.duration ? formatDuration(item.duration) : undefined,
    sfxCategory: categoryName,
    tags: item.tags ?? [],
    image: { source: { url: "" } },
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const limit = searchParams.get("limit") ?? "40";
  const offset = searchParams.get("offset") ?? "0";

  const params = new URLSearchParams({ limit, offset });

  if (category) {
    params.set("category", category);
  }
  if (q.trim()) {
    params.set("q", q);
  }

  params.set("include-premium", "false");
  const hasFilters = q.trim() || category;
  params.set("order_by", hasFilters ? "relevance" : "-popularity");

  // Freepik randomly returns 0 results for certain limit values (API bug).
  // Retry with nearby values until we get results.
  const baseLimit = parseInt(limit, 10);
  const candidates = [baseLimit, baseLimit + 5, baseLimit - 5, baseLimit + 10, baseLimit - 10, 20, 30, 40];

  async function tryFetch(): Promise<RawSfxItem[]> {
    for (const tryLimit of candidates) {
      if (tryLimit < 1) continue;
      params.set("limit", String(tryLimit));
      const res = await fetch(`${BASE_URL}?${params.toString()}`, {
        headers: { "x-freepik-api-key": FREEPIK_API_KEY, Accept: "application/json" },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const items = (data.results ?? []) as RawSfxItem[];
      if (items.length > 0) return items;
    }
    return [];
  }

  try {
    let items = await tryFetch();

    if (items.length === 0 && !hasFilters) {
      const fallbackCategories = ["ambience", "foley", "transitions"];
      for (const fb of fallbackCategories) {
        params.set("category", fb);
        params.set("order_by", "relevance");
        items = await tryFetch();
        if (items.length > 0) break;
      }
    }

    return NextResponse.json({ data: items.map(normalize) });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

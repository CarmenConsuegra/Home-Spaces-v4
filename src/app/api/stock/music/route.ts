import { NextRequest, NextResponse } from "next/server";

const FREEPIK_API_KEY = process.env.FREEPIK_API_KEY ?? "FPSXf4b724af68364c448c82c8e7710a6575";
const BASE_URL = "https://api.freepik.com/v1/music";

// Maps tab labels to proper API filter params
const tabFilters: Record<string, { mood?: string; genre?: string }> = {
  happy:      { mood: "Happy" },
  energetic:  { mood: "Energetic" },
  peaceful:   { mood: "Peaceful" },
  dark:       { mood: "Dark" },
  epic:       { mood: "Epic" },
  upbeat:     { mood: "Upbeat" },
  cinematic:  { genre: "Cinematic" },
  jazz:       { genre: "Jazz" },
  "lo-fi":    { genre: "Lofi" },
  electronic: { genre: "Electronic" },
};

type RawMusicItem = {
  id: number;
  title?: string;
  artist?: { name?: string } | null;
  genres?: { name?: string }[];
  moods?: { name?: string }[];
  seconds?: number;
  time?: string;
  file_url?: string | null;
  preview_url?: string | null;
  download_url?: string | null;
  cover_url?: string | null;
  bpm?: number;
  is_premium?: boolean;
  popularity?: number;
};

/**
 * The search endpoint returns blocked S3 URLs like:
 *   https://s3.amazonaws.com/freepik-tunes/covers/FILENAME
 * The detail endpoint returns accessible CDN URLs like:
 *   https://cdn-tunes-im.freepik.com/covers/FILENAME?im=SmartCrop,...
 * We can transform the search URL to the CDN pattern.
 */
function toCdnCoverUrl(url: string | null | undefined): string {
  if (!url) return "";
  const match = url.match(/freepik-tunes\/covers\/(.+)$/);
  if (match) {
    return `https://cdn-tunes-im.freepik.com/covers/${match[1]}?im=SmartCrop,algorithm=dnn,width=300,height=300`;
  }
  return url;
}

function normalize(item: RawMusicItem) {
  return {
    id: item.id,
    title: item.title ?? "Untitled",
    type: "music",
    audioUrl: item.file_url ?? item.preview_url ?? null,
    duration: item.time ?? undefined,
    genre: item.genres?.[0]?.name ?? undefined,
    bpm: item.bpm ?? undefined,
    mood: item.moods?.map((m) => m.name).filter(Boolean) as string[] ?? [],
    artist: item.artist?.name ?? undefined,
    image: { source: { url: toCdnCoverUrl(item.cover_url) } },
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q      = searchParams.get("q")     ?? "";
  const genre  = searchParams.get("genre") ?? "";
  const mood   = searchParams.get("mood")  ?? "";
  const limit  = searchParams.get("limit") ?? "40";
  const offset = searchParams.get("offset") ?? "0";

  const params = new URLSearchParams({ limit, offset });

  if (genre || mood) {
    // Direct dropdown filters — can combine both
    if (genre) params.set("genre", genre);
    if (mood)  params.set("mood",  mood);
    if (q.trim()) params.set("q", q);
  } else {
    // Fall back to tab-based mapping or plain text search
    const tabFilter = tabFilters[q.trim().toLowerCase()];
    if (tabFilter) {
      if (tabFilter.mood)  params.set("mood", tabFilter.mood);
      if (tabFilter.genre) params.set("genre", tabFilter.genre);
    } else if (q.trim()) {
      params.set("q", q);
    }
  }

  params.set("include-premium", "false");
  const hasQuery = q.trim() || genre || mood;
  params.set("order_by", hasQuery ? "relevance" : "-popularity");

  const baseLimit = parseInt(limit, 10);
  const candidates = [baseLimit, baseLimit + 5, baseLimit - 5, baseLimit + 10, baseLimit - 10, 20, 30, 40];

  async function tryFetch(): Promise<RawMusicItem[]> {
    for (const tryLimit of candidates) {
      if (tryLimit < 1) continue;
      params.set("limit", String(tryLimit));
      const res = await fetch(`${BASE_URL}?${params.toString()}`, {
        headers: { "x-freepik-api-key": FREEPIK_API_KEY, Accept: "application/json" },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const items = (data.results ?? []) as RawMusicItem[];
      if (items.length > 0) return items;
    }
    return [];
  }

  try {
    let items = await tryFetch();

    if (items.length === 0 && !hasQuery) {
      params.set("genre", "Pop");
      items = await tryFetch();
    }

    return NextResponse.json({ data: items.map(normalize) });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

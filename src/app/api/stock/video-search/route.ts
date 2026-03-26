import { NextRequest, NextResponse } from "next/server";

const FREEPIK_API_KEY = process.env.FREEPIK_API_KEY ?? "FPSXf4b724af68364c448c82c8e7710a6575";
const BASE_URL = "https://api.freepik.com/v1/videos";

const DEFAULT_TERMS = ["nature", "lifestyle", "technology", "architecture", "travel"];

function parseAspectRatioString(ar?: string): string | undefined {
  if (!ar) return undefined;
  const [w, h] = ar.split(":").map(Number);
  if (!w || !h) return undefined;
  return `${w * 100}x${h * 100}`;
}

type RawVideoItem = {
  id: number;
  name?: string;
  aspect_ratio?: string;
  duration?: string;
  quality?: string;
  thumbnails?: { url: string; width?: number; height?: number }[];
  previews?: { url: string; width?: number; height?: number }[];
};

function normalize(item: RawVideoItem) {
  const thumb = item.thumbnails?.[item.thumbnails.length - 1] ?? item.thumbnails?.[0];
  const preview = item.previews?.[0];
  const size = parseAspectRatioString(item.aspect_ratio);
  return {
    id: item.id,
    title: item.name ?? "",
    type: "video",
    duration: item.duration,
    quality: item.quality,
    previewUrl: preview?.url ?? null,
    image: { source: { url: thumb?.url ?? "", size } },
  };
}

async function fetchVideos(term: string, page: string, aspectRatio: "16:9" | "9:16") {
  const params = new URLSearchParams({ term, page, order: "relevance" });
  params.append("filters[aspect_ratio][]", aspectRatio);
  params.set("filters[ai-generated][only]", "true");

  const res = await fetch(`${BASE_URL}?${params.toString()}`, {
    headers: {
      "x-freepik-api-key": FREEPIK_API_KEY,
      Accept: "application/json",
      "Accept-Language": "en-US",
    },
  });

  if (!res.ok) return [];
  const data = await res.json();
  return (data.items ?? data.data ?? []) as RawVideoItem[];
}

function interleaveMany<T>(arrays: T[][]): T[] {
  const maxLen = Math.max(...arrays.map((a) => a.length));
  const result: T[] = [];
  for (let i = 0; i < maxLen; i++) {
    for (const arr of arrays) {
      if (i < arr.length) result.push(arr[i]);
    }
  }
  return result;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const term = searchParams.get("term") ?? "";
  const page = searchParams.get("page") ?? "1";

  // When a user provides a search term, use it for both aspect ratios
  // When browsing with no term, fetch across multiple default terms for variety
  const isDefaultBrowse = !term.trim();

  try {
    let raw: RawVideoItem[];

    if (isDefaultBrowse) {
      // Fire landscape + portrait for each default term in parallel
      const batches = await Promise.all(
        DEFAULT_TERMS.flatMap((t) => [
          fetchVideos(t, page, "16:9"),
          fetchVideos(t, page, "9:16"),
        ])
      );
      // batches: [cinematic-16:9, cinematic-9:16, abstract-16:9, abstract-9:16, ...]
      // Pair landscape+portrait per term, then interleave across terms
      const pairs = DEFAULT_TERMS.map((_, i) =>
        interleaveMany([batches[i * 2], batches[i * 2 + 1]])
      );
      raw = interleaveMany(pairs);
    } else {
      const [landscape, portrait] = await Promise.all([
        fetchVideos(term, page, "16:9"),
        fetchVideos(term, page, "9:16"),
      ]);
      raw = interleaveMany([landscape, portrait]);
    }

    const seen = new Set<number>();
    const normalized = raw
      .filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      })
      .map(normalize);

    return NextResponse.json({ data: normalized });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

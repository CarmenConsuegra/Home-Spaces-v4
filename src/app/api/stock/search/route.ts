import { NextRequest, NextResponse } from "next/server";

const FREEPIK_API_KEY = process.env.FREEPIK_API_KEY ?? "FPSXf4b724af68364c448c82c8e7710a6575";
const BASE_URL = "https://api.freepik.com/v1/resources";

const MIXED_DEFAULT_TERMS = ["nature", "lifestyle", "technology", "architecture", "travel"];

// Categories that map directly to API content_type filter flags
const apiContentTypes: Record<string, "photo" | "vector" | "psd"> = {
  photos: "photo",
  vectors: "vector",
  psds: "psd",
};

// Categories without a direct filter — appended as a keyword modifier
const keywordModifiers: Record<string, string> = {
  illustrations: "illustration",
  icons: "icon",
  videos: "video",
  mockups: "mockup",
  designs: "design template",
  fonts: "font typography",
  audio: "audio music",
};

type ActiveFilters = {
  contentType: string;
  license: string;
  aiGenerated: string;
  orientation: string;
  color: string;
  people: string;
};

function applyFilters(
  params: URLSearchParams,
  filters: ActiveFilters,
  categoryContentType: "photo" | "vector" | "psd" | null,
) {
  // AI generated
  if (filters.aiGenerated === "only") {
    params.set("filters[ai_generated][only]", "1");
  } else if (filters.aiGenerated === "excluded") {
    params.set("filters[ai_generated][excluded]", "1");
  }

  // Content type: filter override takes priority over category default
  const ct = filters.contentType !== "all" ? filters.contentType : categoryContentType;
  if (ct) params.set(`filters[content_type][${ct}]`, "1");

  // License
  if (filters.license !== "all") params.set(`filters[license][${filters.license}]`, "1");

  // Orientation
  if (filters.orientation !== "all") params.set(`filters[orientation][${filters.orientation}]`, "1");

  // Color
  if (filters.color) params.set("filters[color]", filters.color);

  // People (only applies to photos — ensure photo content type is set)
  if (filters.people === "include" || filters.people === "exclude") {
    if (!ct) params.set("filters[content_type][photo]", "1");
    params.set(`filters[people][${filters.people}]`, "1");
  }
}

async function fetchOne(term: string, contentType: "photo" | "vector" | "psd" | null, modifier: string | null, limit: number): Promise<unknown[]> {
  const params = new URLSearchParams({ term: modifier && term ? `${term} ${modifier}` : modifier || term, page: "1", limit: String(limit), locale: "en-US" });
  if (contentType) params.set(`filters[content_type][${contentType}]`, "1");
  params.set("filters[ai_generated][only]", "1");
  const res = await fetch(`${BASE_URL}?${params.toString()}`, {
    headers: { "x-freepik-api-key": FREEPIK_API_KEY, Accept: "application/json" },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data ?? [];
}

function interleave(...arrays: unknown[][]): unknown[] {
  const maxLen = Math.max(...arrays.map((a) => a.length));
  const result: unknown[] = [];
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
  const category = searchParams.get("category") ?? "featured";
  const page = searchParams.get("page") ?? "1";

  const filters: ActiveFilters = {
    contentType: searchParams.get("contentType") ?? "all",
    license: searchParams.get("license") ?? "all",
    aiGenerated: searchParams.get("aiGenerated") ?? "only",
    orientation: searchParams.get("orientation") ?? "all",
    color: searchParams.get("color") ?? "",
    people: searchParams.get("people") ?? "all",
  };

  // Mixed with no search term: fetch curated multi-term photos (ignores user filters intentionally)
  if (category === "mixed" && !term.trim()) {
    try {
      const batches = await Promise.all(
        MIXED_DEFAULT_TERMS.map((t) => fetchOne(t, "photo", null, 12))
      );
      const merged = interleave(...batches);
      const seen = new Set<number>();
      const deduped = merged.filter((item: unknown) => {
        const id = (item as { id: number }).id;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });
      return NextResponse.json({ data: deduped });
    } catch (err) {
      return NextResponse.json({ error: String(err) }, { status: 500 });
    }
  }
  // Mixed with a search term falls through to the regular search below

  // Combine the search term with any keyword modifier for the category
  const modifier = keywordModifiers[category];
  const fullTerm = modifier && term ? `${term} ${modifier}` : modifier || term;

  const params = new URLSearchParams({ page, limit: "40", locale: "en-US" });
  // Only set term when non-empty — Freepik API rejects empty query strings
  if (fullTerm) params.set("term", fullTerm);

  applyFilters(params, filters, apiContentTypes[category] ?? null);

  const url = `${BASE_URL}?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        "x-freepik-api-key": FREEPIK_API_KEY,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

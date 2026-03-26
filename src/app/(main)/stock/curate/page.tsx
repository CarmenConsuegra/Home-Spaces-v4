"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  MagnifyingGlass,
  CheckCircle,
  Trash,
  Export,
  Upload,
  X,
} from "@phosphor-icons/react";
import defaultCuratedRaw from "@/app/api/stock/curated-defaults.json";

const STORAGE_KEY = "stock-curated-items";

type FreepikResource = {
  id: number;
  title: string;
  image: { source: { url: string; size?: string }; orientation?: string };
  preview?: { url: string };
  type: string;
  duration?: string;
  quality?: string;
  previewUrl?: string | null;
};

function parseAspectRatio(size?: string): number | undefined {
  if (!size) return undefined;
  const [w, h] = size.split("x").map(Number);
  if (!w || !h) return undefined;
  return w / h;
}

function LazyVideo({ src, className }: { src: string; className: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true);
        else el.pause();
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={active ? src : undefined}
      muted
      loop
      playsInline
      className={className}
      onCanPlay={(e) => e.currentTarget.play().catch(() => {})}
    />
  );
}

function ResourceCard({
  item,
  selected,
  onToggle,
}: {
  item: FreepikResource;
  selected: boolean;
  onToggle: (item: FreepikResource) => void;
}) {
  const imgUrl = item.image?.source?.url ?? item.preview?.url;
  if (!imgUrl) return null;
  const ratio = parseAspectRatio(item.image?.source?.size);

  return (
    <button
      type="button"
      onClick={() => onToggle(item)}
      className="group relative mb-3 block w-full cursor-pointer overflow-hidden rounded-xl transition-transform hover:scale-[1.02]"
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      <div className="absolute inset-0" style={{ background: "var(--surface-border-alpha-0)" }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgUrl}
        alt={item.title}
        className="relative w-full object-cover opacity-0 transition-opacity duration-300"
        style={ratio ? { aspectRatio: ratio } : undefined}
        loading="lazy"
        onLoad={(e) => (e.currentTarget.style.opacity = "1")}
      />
      {item.type === "video" && item.previewUrl && (
        <LazyVideo
          src={item.previewUrl}
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}
      {/* Selected overlay */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
          selected ? "bg-black/40" : "bg-black/0 group-hover:bg-black/20"
        }`}
      >
        {selected && (
          <CheckCircle weight="fill" size={32} className="text-white drop-shadow-lg" />
        )}
      </div>
      {/* Selected ring */}
      {selected && (
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-white/80" />
      )}
    </button>
  );
}

export default function CuratePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"search" | "curated">("curated");
  const [searchResults, setSearchResults] = useState<FreepikResource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [curated, setCurated] = useState<FreepikResource[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage on mount, fall back to defaults if empty
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setCurated(parsed);
      } else {
        setCurated(defaultCuratedRaw as FreepikResource[]);
      }
    } catch {
      setCurated(defaultCuratedRaw as FreepikResource[]);
    }
  }, []);

  // Persist to localStorage whenever curated changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(curated));
  }, [curated]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setIsLoading(true);
    try {
      const [imagesRes, videosRes] = await Promise.all([
        fetch(`/api/stock/search?term=${encodeURIComponent(searchQuery)}&category=photos`, {
          signal: abortRef.current.signal,
        }),
        fetch(`/api/stock/video-search?term=${encodeURIComponent(searchQuery)}&page=1`, {
          signal: abortRef.current.signal,
        }),
      ]);
      const [imagesData, videosData] = await Promise.all([imagesRes.json(), videosRes.json()]);
      const images: FreepikResource[] = imagesData.data ?? [];
      const videos: FreepikResource[] = videosData.data ?? [];
      // Interleave 1 video every 6 images
      const merged: FreepikResource[] = [];
      let vi = 0;
      images.forEach((img, i) => {
        merged.push(img);
        if ((i + 1) % 6 === 0 && vi < videos.length) merged.push(videos[vi++]);
      });
      setSearchResults(merged);
    } catch {
      // aborted
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  const toggleItem = useCallback((item: FreepikResource) => {
    setCurated((prev) => {
      const exists = prev.some((c) => c.id === item.id && c.type === item.type);
      if (exists) return prev.filter((c) => !(c.id === item.id && c.type === item.type));
      return [...prev, item];
    });
  }, []);

  const isSelected = (item: FreepikResource) =>
    curated.some((c) => c.id === item.id && c.type === item.type);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(curated, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "curated-mixed-feed.json";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported successfully");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (Array.isArray(parsed)) {
          setCurated(parsed);
          showToast(`Imported ${parsed.length} items`);
        }
      } catch {
        showToast("Invalid JSON file");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const displayItems = activeTab === "curated" ? curated : searchResults;

  return (
    <div
      className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-2xl"
      style={{ background: "var(--surface-modal)", color: "var(--surface-foreground-0)" }}
    >
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b px-6 py-4" style={{ borderColor: "var(--surface-border-alpha-0)" }}>
        <div>
          <h1 className="text-lg font-semibold">Curate Mixed Feed</h1>
          <p className="text-sm" style={{ color: "var(--surface-foreground-2)" }}>
            {curated.length} item{curated.length !== 1 ? "s" : ""} selected
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-8 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm transition-colors hover:bg-fg/5"
            style={{ color: "var(--surface-foreground-2)" }}
          >
            <Upload size={14} />
            Import
          </button>
          <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          <button
            type="button"
            onClick={handleExport}
            disabled={curated.length === 0}
            className="flex h-8 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm transition-colors hover:bg-fg/5 disabled:opacity-40"
            style={{ color: "var(--surface-foreground-2)" }}
          >
            <Export size={14} />
            Export JSON
          </button>
        </div>
      </header>

      {/* Search bar */}
      <div className="shrink-0 px-6 py-3">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: "var(--surface-border-alpha-0)" }}>
          <MagnifyingGlass size={16} style={{ color: "var(--surface-foreground-2)" }} />
          <input
            type="text"
            placeholder="Search photos and videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-fg/30"
          />
          {searchQuery && (
            <button type="button" onClick={() => { setSearchQuery(""); setSearchResults([]); }}>
              <X size={14} style={{ color: "var(--surface-foreground-2)" }} />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex shrink-0 gap-1 px-6 pb-3">
        {(["search", "curated"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className="h-8 rounded-lg px-4 text-xs font-medium capitalize transition-colors"
            style={{
              background: activeTab === tab ? "var(--selected)" : "transparent",
              color: activeTab === tab ? "var(--surface-foreground-0)" : "var(--surface-foreground-2)",
            }}
          >
            {tab === "curated" ? `Curated (${curated.length})` : "Search"}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
        {isLoading && (
          <p className="py-12 text-center text-sm" style={{ color: "var(--surface-foreground-2)" }}>
            Loading…
          </p>
        )}
        {!isLoading && activeTab === "search" && searchResults.length === 0 && (
          <p className="py-12 text-center text-sm" style={{ color: "var(--surface-foreground-2)" }}>
            Search for photos and videos to add to your curated feed
          </p>
        )}
        {!isLoading && activeTab === "curated" && curated.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16">
            <p className="text-sm" style={{ color: "var(--surface-foreground-2)" }}>No items curated yet</p>
            <button
              type="button"
              onClick={() => setActiveTab("search")}
              className="text-sm underline"
              style={{ color: "var(--surface-foreground-2)" }}
            >
              Search to add items
            </button>
          </div>
        )}
        {!isLoading && displayItems.length > 0 && (
          <div className="columns-4 gap-3">
            {displayItems.map((item) => (
              <ResourceCard
                key={`${item.type ?? "img"}-${item.id}`}
                item={item}
                selected={isSelected(item)}
                onToggle={toggleItem}
              />
            ))}
          </div>
        )}

        {/* Remove buttons in curated view */}
        {activeTab === "curated" && curated.length > 0 && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => { setCurated([]); showToast("Cleared all curated items"); }}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-fg/5"
              style={{ color: "var(--surface-foreground-2)" }}
            >
              <Trash size={14} />
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-lg" style={{ background: "rgba(0,0,0,0.8)" }}>
          {toast}
        </div>
      )}
    </div>
  );
}

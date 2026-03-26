"use client";

import { useState, useEffect, useRef } from "react";
import {
  MagnifyingGlass,
  ClockCounterClockwise,
  Image,
  VideoCamera,
  TreeStructure,
  Shapes,
  Globe,
} from "@phosphor-icons/react";
import { usePalette } from "@/contexts/PaletteContext";

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export function SpotlightSearch({ isOpen, onClose, initialQuery = "" }: SpotlightSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const { colors: c, surfaceColors: sc } = usePalette();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setQuery(initialQuery);
      // Trigger animation after mount
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
      // Focus input after animation starts
      const t = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(t);
    } else {
      setIsAnimating(false);
      // Delay unmounting to allow fade-out animation
      const t = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen, initialQuery]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen && !mounted) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 transition-opacity duration-300"
        style={{
          background: "rgba(0, 0, 0, 0.7)",
          opacity: isAnimating ? 1 : 0,
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
        }}
        onClick={onClose}
      >
        <div
          className="w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 flex flex-col"
          style={{
            background: "rgba(28, 28, 30, 0.8)",
            backdropFilter: "blur(5px) saturate(180%)",
            WebkitBackdropFilter: "blur(5px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            opacity: isAnimating ? 1 : 0,
            transform: isAnimating ? "translateY(0) scale(1)" : "translateY(-10px) scale(0.95)",
            height: "640px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 border-b px-4 py-3" style={{ borderColor: "var(--surface-border-alpha-0)" }}>
            <MagnifyingGlass
              weight="bold"
              size={20}
              className="shrink-0 opacity-50"
              style={{ color: "var(--surface-foreground-2)" }}
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search projects, assets, and more..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:opacity-50"
              style={{
                color: "var(--surface-foreground-0)",
              }}
            />
            <kbd
              className="rounded px-2 py-1 text-xs font-normal opacity-50"
              style={{
                background: "var(--surface-1)",
                color: "var(--surface-foreground-2)",
                border: "1px solid var(--surface-border-alpha-0)",
              }}
            >
              ESC
            </kbd>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {query.trim() ? (
              <p className="text-sm opacity-70" style={{ color: "var(--surface-foreground-2)" }}>
                Search results for &quot;{query}&quot; would appear here.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Recents */}
                <section>
                  <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-fg/30">
                    Recents
                  </p>
                  {[
                    { label: "Spaces" },
                    { label: "Variations" },
                    { label: "Image Tools" },
                  ].map(({ label }) => (
                    <button key={label} type="button" className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/5">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md" style={{ background: sc.button }}>
                        <ClockCounterClockwise weight="regular" size={13} style={{ color: "var(--surface-foreground-2)" }} />
                      </div>
                      <span className="text-sm" style={{ color: "var(--surface-foreground-1)" }}>{label}</span>
                    </button>
                  ))}
                </section>

                {/* Quick Actions */}
                <section>
                  <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-fg/30">
                    Quick Actions
                  </p>
                  {[
                    { label: "Create image",    Icon: Image,        bg: c.image.bg,  iconColor: c.image.icon,  shortcut: "⌘⇧F" },
                    { label: "Create video",    Icon: VideoCamera,  bg: c.video.bg,  iconColor: c.video.icon,  shortcut: "⌘⇧V" },
                    { label: "Create a space",  Icon: TreeStructure,bg: c.spaces.bg, iconColor: c.spaces.icon, shortcut: "⌘⇧L" },
                    { label: "Search stock",    Icon: Shapes,       bg: sc.button,   iconColor: "var(--surface-foreground-2)", shortcut: "⌘⇧S" },
                    { label: "Go to Community", Icon: Globe,        bg: sc.button,   iconColor: "var(--surface-foreground-2)", shortcut: "↩" },
                  ].map(({ label, Icon, bg, iconColor, shortcut }) => (
                    <button key={label} type="button" className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/5">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md" style={{ background: bg }}>
                        <Icon weight="regular" size={13} style={{ color: iconColor }} />
                      </div>
                      <span className="flex-1 text-left text-sm" style={{ color: "var(--surface-foreground-1)" }}>{label}</span>
                      {shortcut && (
                        <kbd
                          className="flex h-6 items-center justify-center rounded px-1.5 text-xs font-medium"
                          style={{ background: sc.button, color: "var(--surface-foreground-2)", border: "1px solid var(--surface-border-alpha-0)" }}
                        >
                          {shortcut}
                        </kbd>
                      )}
                    </button>
                  ))}
                </section>

              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

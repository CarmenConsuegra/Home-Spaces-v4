"use client";

import { createPortal } from "react-dom";
import {
  usePalette,
  PaletteColors,
  SurfaceColors,
  darkPaletteColors,
  lightPaletteColors,
  darkSurfaceColors,
  lightSurfaceColors,
  DEFAULT_CTA_COLOR,
  DEFAULT_CTA_TEXT_COLOR,
  type ColorMode,
} from "@/contexts/PaletteContext";
import { useState } from "react";

type SectionKey = keyof PaletteColors;
type ColorKey = "icon" | "bg" | "border";
type SurfaceKey = keyof SurfaceColors;

type Preset = { label: string; colors: PaletteColors; surfaceColors: SurfaceColors; ctaColor: string; ctaTextColor?: string };

const PRESETS: Record<ColorMode, Preset[]> = {
  dark: [
    {
      label: "Default",
      colors: darkPaletteColors,
      surfaceColors: darkSurfaceColors,
      ctaColor: DEFAULT_CTA_COLOR,
    },
    {
      label: "Warm Black",
      colors: {
        image:  { bg: "#103037", border: "#9ACFDA1a", icon: "#9ACFDA" },
        video:  { bg: "#2A362D", border: "#C9E9D31a", icon: "#C9E9D3" },
        audio:  { bg: "#342B25", border: "#F2CBAE1a", icon: "#F2CBAE" },
        "3d":   { bg: "#2E2A1E", border: "#D4BF961a", icon: "#D4BF96" },
        spaces: { bg: "#36274C", border: "#C5ADEE1a", icon: "#C5ADEE" },
        stock:  { bg: "#2C2828", border: "#ffffff1a", icon: "#ffffff" },
      },
      surfaceColors: {
        page: "#100f0f", content: "#181616", sidebar: "#1d1b1b",
        panel: "#1d1b1b", card: "#232020", button: "#2b2828",
        text: "#f7f7f7", textSubtle: "#c8c8c8",
      },
      ctaColor: "#0539BF",
    },
    // ── Palette-based dark themes ──────────────────────────────────────────
    {
      label: "Martin",
      colors: {
        image:  { bg: "#103037", border: "#9ACFDA1a", icon: "#9ACFDA" },
        video:  { bg: "#2A362D", border: "#9bbba51a", icon: "#9BBBA5" },
        audio:  { bg: "#312725", border: "#d3aca71a", icon: "#D3ACA7" },
        "3d":   { bg: "#2E2A1E", border: "#D4BF961a", icon: "#D4BF96" },
        spaces: { bg: "#36274C", border: "#C5ADEE1a", icon: "#C5ADEE" },
        stock:  { bg: "#2C2828", border: "#c7c7c71a", icon: "#C7C7C7" },
      },
      surfaceColors: {
        page: "#0F0F0F", content: "#171717", sidebar: "#1C1C1C",
        panel: "#1C1C1C", card: "#222222", button: "#2A2A2A",
        text: "#F7F7F7", textSubtle: "#C8C8C8",
      },
      ctaColor: "#FF58A1",
      ctaTextColor: "#000000",
    },
    {
      label: "Magnific Muted",
      colors: {
        image:  { bg: "#103037", border: "#9ACFDA1a", icon: "#9ACFDA" },
        video:  { bg: "#2A362D", border: "#9bbba51a", icon: "#9BBBA5" },
        audio:  { bg: "#312725", border: "#d3aca71a", icon: "#D3ACA7" },
        "3d":   { bg: "#2E2A1E", border: "#D4BF961a", icon: "#D4BF96" },
        spaces: { bg: "#36274C", border: "#C5ADEE1a", icon: "#C5ADEE" },
        stock:  { bg: "#2C2828", border: "#c7c7c71a", icon: "#C7C7C7" },
      },
      surfaceColors: {
        page: "#100F0F", content: "#181616", sidebar: "#1D1B1B",
        panel: "#1D1B1B", card: "#232020", button: "#2B2828",
        text: "#F7F7F7", textSubtle: "#C8C8C8",
      },
      ctaColor: "#FF58A1",
      ctaTextColor: "#000000",
    },
    {
      label: "Magnific Magenta",
      colors: {
        image:  { bg: "#1D1C1C", border: "#FF46B11a", icon: "#FF46B1" },
        video:  { bg: "#1C1B1B", border: "#FF46B11a", icon: "#FF46B1" },
        audio:  { bg: "#1e1d1d", border: "#FF46B11a", icon: "#FF46B1" },
        "3d":   { bg: "#1d1c1c", border: "#FF46B11a", icon: "#FF46B1" },
        spaces: { bg: "#1c1b1b", border: "#FF46B11a", icon: "#FF46B1" },
        stock:  { bg: "#1e1d1d", border: "#FF46B11a", icon: "#FF46B1" },
      },
      surfaceColors: {
        page: "#100f0f", content: "#181717", sidebar: "#1d1c1c",
        panel: "#1d1c1c", card: "#232121", button: "#2b2929",
        text: "#f5f2f3", textSubtle: "#808080",
      },
      ctaColor: "#ff46b1",
    },
    {
      label: "Grey",
      colors: {
        image:  { bg: "#1d1c1c", border: "#9A95921a", icon: "#9A9592" },
        video:  { bg: "#1b1a1a", border: "#8280801a", icon: "#828080" },
        audio:  { bg: "#1e1d1d", border: "#AEAAA81a", icon: "#AEAAA8" },
        "3d":   { bg: "#1c1b1b", border: "#C4C0BE1a", icon: "#C4C0BE" },
        spaces: { bg: "#1c1b1b", border: "#7674721a", icon: "#767472" },
        stock:  { bg: "#1d1c1c", border: "#CCCAC81a", icon: "#CCCAC8" },
      },
      surfaceColors: {
        page: "#0f0f0f", content: "#171717", sidebar: "#1c1c1c",
        panel: "#1c1c1c", card: "#222222", button: "#2a2a2a",
        text: "#f2f1f0", textSubtle: "#888480",
      },
      ctaColor: "#545250",
    },
    {
      label: "Iris",
      colors: {
        image:  { bg: "#1c1c1d", border: "#928F9A1a", icon: "#928F9A" },
        video:  { bg: "#1b1b1d", border: "#847F8C1a", icon: "#847F8C" },
        audio:  { bg: "#1d1c1e", border: "#9E9AA81a", icon: "#9E9AA8" },
        "3d":   { bg: "#1c1c1d", border: "#ABAAB61a", icon: "#ABAAB6" },
        spaces: { bg: "#1b1b1d", border: "#786F841a", icon: "#786F84" },
        stock:  { bg: "#1d1c1e", border: "#B0AEC01a", icon: "#B0AEC0" },
      },
      surfaceColors: {
        page: "#0f0e10", content: "#171618", sidebar: "#1c1b1e",
        panel: "#1c1b1e", card: "#222125", button: "#2a292e",
        text: "#f3f1f5", textSubtle: "#7A7488",
      },
      ctaColor: "#503888",
    },
    {
      label: "Eclipse",
      colors: {
        image:  { bg: "#1c1c1d", border: "#8F93991a", icon: "#8F9399" },
        video:  { bg: "#1b1c1d", border: "#83878F1a", icon: "#83878F" },
        audio:  { bg: "#1c1d1e", border: "#9A9EA51a", icon: "#9A9EA5" },
        "3d":   { bg: "#1c1c1d", border: "#A0A5AC1a", icon: "#A0A5AC" },
        spaces: { bg: "#1b1c1d", border: "#7A7E851a", icon: "#7A7E85" },
        stock:  { bg: "#1c1d1e", border: "#A8ADB31a", icon: "#A8ADB3" },
      },
      surfaceColors: {
        page: "#0f0f10", content: "#171718", sidebar: "#1c1c1d",
        panel: "#1c1c1d", card: "#222224", button: "#2a2a2c",
        text: "#eff1f3", textSubtle: "#6A7278",
      },
      ctaColor: "#1E4E96",
    },
    {
      label: "Viridian",
      colors: {
        image:  { bg: "#1c1d1c", border: "#90989519", icon: "#909895" },
        video:  { bg: "#1b1c1b", border: "#848C881a", icon: "#848C88" },
        audio:  { bg: "#1c1d1c", border: "#9AA29E1a", icon: "#9AA29E" },
        "3d":   { bg: "#1c1d1c", border: "#A4ACA81a", icon: "#A4ACA8" },
        spaces: { bg: "#1b1c1b", border: "#7C84801a", icon: "#7C8480" },
        stock:  { bg: "#1c1d1c", border: "#AEB6B21a", icon: "#AEB6B2" },
      },
      surfaceColors: {
        page: "#0f100f", content: "#171817", sidebar: "#1c1d1c",
        panel: "#1c1d1c", card: "#222422", button: "#2a2c2a",
        text: "#eff2ef", textSubtle: "#687068",
      },
      ctaColor: "#226040",
    },
    // ── Pure grayscale ─────────────────────────────────────────────────────
    {
      label: "Grayscale",
      colors: {
        image:  { bg: "#2a2a2a", border: "#ffffff1a", icon: "#c0c0c0" },
        video:  { bg: "#272727", border: "#ffffff1a", icon: "#b8b8b8" },
        audio:  { bg: "#252525", border: "#ffffff1a", icon: "#b0b0b0" },
        "3d":   { bg: "#232323", border: "#ffffff1a", icon: "#a8a8a8" },
        spaces: { bg: "#282828", border: "#ffffff1a", icon: "#bcbcbc" },
        stock:  { bg: "#2a2a2a", border: "#ffffff1a", icon: "#c0c0c0" },
      },
      surfaceColors: {
        page: "#0f0f0f", content: "#171717", sidebar: "#1c1c1c",
        panel: "#1c1c1c", card: "#222222", button: "#2a2a2a",
        text: "#f0f0f0", textSubtle: "#888888",
      },
      ctaColor: "#3a3a3a",
    },
  ],
  light: [
    {
      label: "Default",
      colors: lightPaletteColors,
      surfaceColors: lightSurfaceColors,
      ctaColor: DEFAULT_CTA_COLOR,
    },
    // ── Palette-based light themes ─────────────────────────────────────────
    {
      label: "Magnific Magenta",
      colors: {
        image:  { bg: "#F5F1EF", border: "#FF46B11a", icon: "#FF46B1" },
        video:  { bg: "#F5F1EF", border: "#FF46B11a", icon: "#FF46B1" },
        audio:  { bg: "#F5F1EF", border: "#FF46B11a", icon: "#FF46B1" },
        "3d":   { bg: "#F5F1EF", border: "#FF46B11a", icon: "#FF46B1" },
        spaces: { bg: "#F5F1EF", border: "#FF46B11a", icon: "#FF46B1" },
        stock:  { bg: "#F5F1EF", border: "#FF46B11a", icon: "#FF46B1" },
      },
      surfaceColors: {
        page: "#ededed", content: "#fafafa", sidebar: "#ffffff",
        panel: "#ffffff", card: "#fafafa", button: "#ededed",
        text: "#000000", textSubtle: "#000000",
      },
      ctaColor: "#ff46b1",
    },
    {
      label: "Grey",
      colors: {
        image:  { bg: "#F3F1F0", border: "#73716F1a", icon: "#73716F" },
        video:  { bg: "#ECE8E6", border: "#5F5E5C1a", icon: "#5F5E5C" },
        audio:  { bg: "#D9D3D0", border: "#4B4A491a", icon: "#4B4A49" },
        "3d":   { bg: "#F3F1F0", border: "#A099941a", icon: "#A09994" },
        spaces: { bg: "#ECE8E6", border: "#73716F1a", icon: "#373736" },
        stock:  { bg: "#F3F1F0", border: "#73716F1a", icon: "#5F5E5C" },
      },
      surfaceColors: {
        page: "#F3F1F0", content: "#fafafa", sidebar: "#ffffff",
        panel: "#ffffff", card: "#ECE8E6", button: "#D9D3D0",
        text: "#101010", textSubtle: "#73716F",
      },
      ctaColor: "#4B4A49",
    },
    {
      label: "Iris",
      colors: {
        image:  { bg: "#FAF9FC", border: "#6553801a", icon: "#655380" },
        video:  { bg: "#F9F8FC", border: "#5644701a", icon: "#564470" },
        audio:  { bg: "#FAF9FC", border: "#7260901a", icon: "#726090" },
        "3d":   { bg: "#F9F9FC", border: "#7E70A01a", icon: "#7E70A0" },
        spaces: { bg: "#F9F8FC", border: "#4A38601a", icon: "#4A3860" },
        stock:  { bg: "#FAF9FC", border: "#9080B01a", icon: "#9080B0" },
      },
      surfaceColors: {
        page: "#FAF9FC", content: "#FDFCFF", sidebar: "#ffffff",
        panel: "#ffffff", card: "#F2F0F8", button: "#ECEAF5",
        text: "#120e18", textSubtle: "#68587A",
      },
      ctaColor: "#503888",
    },
    {
      label: "Eclipse",
      colors: {
        image:  { bg: "#F8FAFB", border: "#4F6A871a", icon: "#4F6A87" },
        video:  { bg: "#F8F9FB", border: "#435A781a", icon: "#435A78" },
        audio:  { bg: "#F8FAFB", border: "#5B76961a", icon: "#5B7696" },
        "3d":   { bg: "#F8FAFB", border: "#6888A41a", icon: "#6888A4" },
        spaces: { bg: "#F8F9FB", border: "#3A50681a", icon: "#3A5068" },
        stock:  { bg: "#F8FAFB", border: "#7898B21a", icon: "#7898B2" },
      },
      surfaceColors: {
        page: "#F8FAFB", content: "#FBFCFE", sidebar: "#ffffff",
        panel: "#ffffff", card: "#EEF2F6", button: "#E8EDF2",
        text: "#0c1016", textSubtle: "#5A7080",
      },
      ctaColor: "#1E4E96",
    },
    {
      label: "Viridian",
      colors: {
        image:  { bg: "#F8FBF9", border: "#4070551a", icon: "#407055" },
        video:  { bg: "#F8FAF9", border: "#3660481a", icon: "#366048" },
        audio:  { bg: "#F8FBF9", border: "#4E806A1a", icon: "#4E806A" },
        "3d":   { bg: "#F8FAF9", border: "#5C90781a", icon: "#5C9078" },
        spaces: { bg: "#F8FAF9", border: "#2C50381a", icon: "#2C5038" },
        stock:  { bg: "#F8FBF9", border: "#6A9E841a", icon: "#6A9E84" },
      },
      surfaceColors: {
        page: "#F8FBF9", content: "#FAFCFB", sidebar: "#ffffff",
        panel: "#ffffff", card: "#EEF4F1", button: "#E8F0EB",
        text: "#0c1410", textSubtle: "#507060",
      },
      ctaColor: "#226040",
    },
    // ── Pure grayscale ─────────────────────────────────────────────────────
    {
      label: "Grayscale",
      colors: {
        image:  { bg: "#e8e8e8", border: "#00000012", icon: "#606060" },
        video:  { bg: "#ebebeb", border: "#00000012", icon: "#585858" },
        audio:  { bg: "#e5e5e5", border: "#00000012", icon: "#505050" },
        "3d":   { bg: "#e2e2e2", border: "#00000012", icon: "#484848" },
        spaces: { bg: "#e9e9e9", border: "#00000012", icon: "#5c5c5c" },
        stock:  { bg: "#e8e8e8", border: "#00000012", icon: "#606060" },
      },
      surfaceColors: {
        page: "#f0f0f0", content: "#fafafa", sidebar: "#ffffff",
        panel: "#ffffff", card: "#f5f5f5", button: "#eeeeee",
        text: "#0f0f0f", textSubtle: "#606060",
      },
      ctaColor: "#3a3a3a",
    },
  ],
};

const sectionLabels: Record<SectionKey, string> = {
  image: "Image",
  video: "Video",
  audio: "Audio",
  "3d": "3D",
  spaces: "Spaces",
  stock: "Stock",
};

const surfaceLabels: Record<SurfaceKey, string> = {
  page:       "Page",
  content:    "Content",
  sidebar:    "Sidebar",
  panel:      "Panel",
  card:       "Card",
  button:     "Button",
  text:       "Text",
  textSubtle: "Subtle text",
};

function toPickerHex(value: string): string {
  const hex = value.startsWith("#") ? value.slice(1, 7) : "ffffff";
  return "#" + hex.padEnd(6, "0").slice(0, 6);
}

function isValidHex(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

function ColorField({
  label,
  value,
  defaultValue,
  onChange,
}: {
  label: string;
  value: string;
  defaultValue: string;
  onChange: (v: string) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const isDirty = value !== defaultValue;
  const displayValue = draft ?? value.toUpperCase();

  const commit = (raw: string) => {
    setDraft(null);
    const normalized = raw.startsWith("#") ? raw : "#" + raw;
    if (isValidHex(normalized)) onChange(normalized);
  };

  return (
    <div className="flex items-center gap-2">
      <label className="w-10 shrink-0 text-[10px] uppercase tracking-wider text-white/30">{label}</label>
      <div className="relative shrink-0">
        <input
          type="color"
          value={toPickerHex(value)}
          onChange={(e) => { setDraft(null); onChange(e.target.value); }}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <div
          className="size-6 rounded-md border border-white/10 pointer-events-none"
          style={{ background: toPickerHex(value) }}
        />
      </div>
      <input
        type="text"
        value={displayValue}
        maxLength={7}
        spellCheck={false}
        onChange={(e) => setDraft(e.target.value.toUpperCase())}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") commit((e.target as HTMLInputElement).value); }}
        className="flex-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-xs text-white/70 outline-none transition-colors focus:border-white/20 focus:text-white"
      />
      {isDirty && (
        <button
          type="button"
          title="Reset to default"
          onClick={() => { setDraft(null); onChange(defaultValue); }}
          className="text-[11px] text-white/20 transition-colors hover:text-white/60"
        >
          ↺
        </button>
      )}
    </div>
  );
}

function ColumnHeader({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/20">{children}</p>
  );
}

export function PaletteEditorModal() {
  const {
    colors, updateColor,
    surfaceColors, updateSurface,
    ctaColor, updateCtaColor,
    ctaTextColor, updateCtaTextColor,
    resetColors, colorMode, setColorMode,
    paletteEditorOpen, closePaletteEditor,
  } = usePalette();

  const defaultPaletteColors = colorMode === "light" ? lightPaletteColors : darkPaletteColors;
  const defaultSurfaceColors = colorMode === "light" ? lightSurfaceColors : darkSurfaceColors;
  const [copied, setCopied] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState("");

  const applyPreset = (preset: Preset) => {
    Object.entries(preset.colors).forEach(([section, vals]) => {
      updateColor(section as SectionKey, "icon", vals.icon);
      updateColor(section as SectionKey, "bg", vals.bg);
      updateColor(section as SectionKey, "border", vals.border);
    });
    Object.entries(preset.surfaceColors).forEach(([key, val]) => {
      updateSurface(key as SurfaceKey, val);
    });
    updateCtaColor(preset.ctaColor);
    updateCtaTextColor(preset.ctaTextColor ?? DEFAULT_CTA_TEXT_COLOR);
  };

  if (!paletteEditorOpen) return null;

  const exportCode = JSON.stringify({ colors, surfaceColors, ctaColor, ctaTextColor }, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(exportCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleImport = () => {
    setImportError(null);
    try {
      const parsed = JSON.parse(importText);
      if (parsed.colors) {
        Object.entries(parsed.colors).forEach(([section, vals]) => {
          const v = vals as Record<string, string>;
          if (v.icon) updateColor(section as SectionKey, "icon", v.icon);
          if (v.bg) updateColor(section as SectionKey, "bg", v.bg);
          if (v.border) updateColor(section as SectionKey, "border", v.border);
        });
      }
      if (parsed.surfaceColors) {
        Object.entries(parsed.surfaceColors).forEach(([key, val]) => {
          updateSurface(key as SurfaceKey, val as string);
        });
      }
      if (parsed.ctaColor) updateCtaColor(parsed.ctaColor);
      if (parsed.ctaTextColor) updateCtaTextColor(parsed.ctaTextColor);
      setImporting(false);
      setImportText("");
    } catch (e) {
      setImportError(`Invalid JSON — ${e instanceof Error ? e.message : "paste the exact output from Copy as code"}`);
    }
  };

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9990]" onClick={closePaletteEditor} />
      <div
        className="fixed left-1/2 top-1/2 z-[9991] w-[720px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
        style={{ background: "#161616" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-white/[0.06] px-5 pt-3 pb-0">
          <div className="flex items-center justify-between pb-3">
            <div>
              <p className="text-sm font-semibold text-white">Palette Editor</p>
              <p className="text-[10px] text-white/30">Dev tool · changes persist to localStorage</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={resetColors}
                className="rounded-lg px-2.5 py-1 text-[11px] font-medium text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={closePaletteEditor}
                className="flex size-7 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/5 hover:text-white/70"
              >
                ✕
              </button>
            </div>
          </div>
          {/* Mode tabs */}
          <div className="flex gap-1 pb-0">
            {(["dark", "light"] as ColorMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => { setColorMode(mode); setSelectedPreset(""); }}
                className="relative px-4 py-2 text-xs font-medium capitalize transition-colors"
                style={{ color: colorMode === mode ? "white" : "rgba(255,255,255,0.35)" }}
              >
                {mode === "dark" ? "🌙" : "☀️"} {mode.charAt(0).toUpperCase() + mode.slice(1)}
                {colorMode === mode && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-white" />
                )}
              </button>
            ))}
          </div>

          {/* Preset selector */}
          <div className="flex items-center gap-2.5 border-t border-white/[0.06] py-2.5">
            <span className="shrink-0 text-[10px] uppercase tracking-wider text-white/30">Preset</span>
            <select
              value={selectedPreset}
              onChange={(e) => {
                const preset = PRESETS[colorMode].find((p) => p.label === e.target.value);
                if (preset) applyPreset(preset);
                setSelectedPreset(e.target.value);
              }}
              className="flex-1 cursor-pointer rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/70 outline-none transition-colors hover:bg-white/10"
              style={{ colorScheme: "dark" }}
            >
              <option value="" disabled>Apply a preset…</option>
              {PRESETS[colorMode].map((p) => (
                <option key={p.label} value={p.label}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Two-column body */}
        <div className="flex gap-0 divide-x divide-white/[0.06]">

          {/* Left column — Surfaces + CTA */}
          <div className="flex w-1/2 flex-col gap-0 p-4">
            <ColumnHeader>Backgrounds</ColumnHeader>
            <div className="space-y-1.5">
              {(["page", "content", "sidebar", "panel", "card", "button"] as SurfaceKey[]).map((key) => (
                <div key={key} className="rounded-xl px-3 py-2.5" style={{ background: "#1f1f1f" }}>
                  <div className="mb-2 flex items-center gap-2">
                    <div className="size-2.5 rounded-full border border-white/10" style={{ background: surfaceColors[key] }} />
                    <span className="text-xs font-semibold text-white/80">{surfaceLabels[key]}</span>
                  </div>
                  <ColorField
                    label="bg"
                    value={surfaceColors[key]}
                    defaultValue={defaultSurfaceColors[key]}
                    onChange={(v) => updateSurface(key, v)}
                  />
                </div>
              ))}
            </div>

            <div className="mt-3">
              <ColumnHeader>Text</ColumnHeader>
              <div className="space-y-1.5">
                {(["text", "textSubtle"] as SurfaceKey[]).map((key) => (
                  <div key={key} className="rounded-xl px-3 py-2.5" style={{ background: "#1f1f1f" }}>
                    <div className="mb-2 flex items-center gap-2">
                      <div className="size-2.5 rounded-full border border-white/10" style={{ background: surfaceColors[key] }} />
                      <span className="text-xs font-semibold text-white/80">{surfaceLabels[key]}</span>
                    </div>
                    <ColorField
                      label="fg"
                      value={surfaceColors[key]}
                      defaultValue={defaultSurfaceColors[key]}
                      onChange={(v) => updateSurface(key, v)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <ColumnHeader>Primary CTA</ColumnHeader>
              <div className="rounded-xl px-3 py-2.5" style={{ background: "#1f1f1f" }}>
                <div className="mb-2 flex items-center gap-2">
                  <div className="size-2.5 rounded-full" style={{ background: ctaColor }} />
                  <span className="text-xs font-semibold text-white/80">Button</span>
                  <span className="text-[10px] text-white/30">New · Generate</span>
                </div>
                <div className="space-y-1.5">
                  <ColorField
                    label="bg"
                    value={ctaColor}
                    defaultValue={DEFAULT_CTA_COLOR}
                    onChange={updateCtaColor}
                  />
                  <ColorField
                    label="text"
                    value={ctaTextColor}
                    defaultValue={DEFAULT_CTA_TEXT_COLOR}
                    onChange={updateCtaTextColor}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right column — Section colors */}
          <div className="flex w-1/2 flex-col p-4">
            <ColumnHeader>Sections</ColumnHeader>
            <div className="space-y-1.5">
              {(Object.keys(colors) as SectionKey[]).map((section) => (
                <div key={section} className="rounded-xl px-3 py-2.5" style={{ background: "#1f1f1f" }}>
                  <div className="mb-2 flex items-center gap-2">
                    <div className="size-2.5 rounded-full" style={{ background: colors[section].icon }} />
                    <span className="text-xs font-semibold text-white/80">{sectionLabels[section]}</span>
                  </div>
                  <div className="space-y-1.5">
                    {(["icon", "bg"] as ColorKey[]).map((key) => (
                      <ColorField
                        key={key}
                        label={key}
                        value={colors[section][key]}
                        defaultValue={defaultPaletteColors[section][key]}
                        onChange={(v) => {
                          updateColor(section, key, v);
                          if (key === "icon") updateColor(section, "border", v + "1a");
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/[0.06] p-3 space-y-2">
          {importing ? (
            <div className="space-y-2">
              <textarea
                autoFocus
                value={importText}
                onChange={(e) => { setImportText(e.target.value); setImportError(null); }}
                placeholder='Paste JSON here e.g. {"colors":{...},"surfaceColors":{...},"ctaColor":"#..."}'
                rows={4}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 p-2.5 font-mono text-[11px] text-white/70 outline-none transition-colors focus:border-white/20 placeholder:text-white/20"
              />
              {importError && (
                <p className="text-[10px] text-red-400/80">{importError}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleImport}
                  className="flex-1 rounded-xl py-2 text-xs font-medium transition-colors"
                  style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={() => { setImporting(false); setImportText(""); setImportError(null); }}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-white/30 transition-colors hover:text-white/60"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 rounded-xl py-2 text-xs font-medium transition-colors"
                style={{
                  background: copied ? "rgba(100,200,100,0.1)" : "rgba(255,255,255,0.05)",
                  color: copied ? "rgba(100,220,100,0.9)" : "rgba(255,255,255,0.5)",
                }}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                type="button"
                onClick={() => setImporting(true)}
                className="flex-1 rounded-xl py-2 text-xs font-medium transition-colors"
                style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}
              >
                Import
              </button>
            </div>
          )}
        </div>
      </div>
    </>,
    document.body,
  );
}

"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { sectionColors } from "@/lib/sectionColors";

type SectionKey = keyof typeof sectionColors;
type SectionColor = { bg: string; border: string; icon: string };
export type PaletteColors = Record<SectionKey, SectionColor>;

export type SurfaceColors = {
  page: string;        // outermost page background  → --surface-0
  content: string;     // main content area          → --surface-modal
  sidebar: string;     // sidebar icon column
  panel: string;       // left tool panels
  card: string;        // inner card/list surfaces
  button: string;      // button background tint
  text: string;        // primary text               → --surface-foreground-0
  textSubtle: string;  // secondary/dim text         → --surface-foreground-2
};

export type ColorMode = "dark" | "light";

// ─── Dark defaults ────────────────────────────────────────────────────────────

export const darkPaletteColors: PaletteColors = {
  image:  { ...sectionColors.image },
  video:  { ...sectionColors.video },
  audio:  { ...sectionColors.audio },
  "3d":   { ...sectionColors["3d"] },
  spaces: { ...sectionColors.spaces },
  stock:  { ...sectionColors.stock },
};

export const darkSurfaceColors: SurfaceColors = {
  page:       "#0f0f0f",
  content:    "#171717",
  sidebar:    "#1c1c1c",
  panel:      "#1c1c1c",
  card:       "#222222",
  button:     "#2a2a2a",
  text:       "#f7f7f7",
  textSubtle: "#A8A8A8",
};

const DARK_CSS_VARS: Record<string, string> = {
  "--surface-0":              "#0f0f0f",
  "--surface-1":              "#1c1c1c",
  "--surface-modal":          "#171717",
  "--surface-foreground-0":   "#f7f7f7",
  "--surface-foreground-2":   "#A8A8A8",
  "--surface-border-alpha-0": "#ffffff0d",
  "--surface-border-alpha-1": "#ffffff1a",
  "--sidebar":                "#1c1c1c",
  "--selected":               "#343434",
};

// ─── Light defaults ───────────────────────────────────────────────────────────

export const lightPaletteColors: PaletteColors = {
  image:  { bg: "#d6edf2", border: "#1e7b8f1a", icon: "#1e7b8f" },
  video:  { bg: "#d6ecdf", border: "#1e70401a", icon: "#1e7040" },
  audio:  { bg: "#f2e4d6", border: "#a0521e1a", icon: "#a0521e" },
  "3d":   { bg: "#ede8d0", border: "#7a68281a", icon: "#7a6828" },
  spaces: { bg: "#e4d6f2", border: "#5a28a01a", icon: "#5a28a0" },
  stock:  { bg: "#e2e2e2", border: "#4040401a", icon: "#404040" },
};

export const lightSurfaceColors: SurfaceColors = {
  page:       "#f0f0f0",
  content:    "#FAFAFA",
  sidebar:    "#ffffff",
  panel:      "#ffffff",
  card:       "#F5F5F5",
  button:     "#F5F5F5",
  text:       "#0f0f0f",
  textSubtle: "#454545",
};

const LIGHT_CSS_VARS: Record<string, string> = {
  "--surface-0":              "#f0f0f0",
  "--surface-1":              "#ffffff",
  "--surface-modal":          "#FAFAFA",
  "--surface-foreground-0":   "#0f0f0f",
  "--surface-foreground-2":   "#454545",
  "--surface-border-alpha-0": "#0000000d",
  "--surface-border-alpha-1": "#0000001a",
  "--sidebar":                "#ffffff",
  "--selected":               "#e0e0e0",
};

function applyCSSVars(vars: Record<string, string>) {
  Object.entries(vars).forEach(([k, v]) =>
    document.documentElement.style.setProperty(k, v)
  );
}

// ─── Aliases for backwards compat ─────────────────────────────────────────────
export const defaultPaletteColors = darkPaletteColors;
export const defaultSurfaceColors = darkSurfaceColors;
export const DEFAULT_CTA_COLOR      = "#0539BF";
export const DEFAULT_CTA_TEXT_COLOR = "#ffffff";

// ─── Storage keys ─────────────────────────────────────────────────────────────
// Colors and surfaces are stored per-mode so switching modes restores each mode's last state
const colorKey   = (mode: ColorMode) => `dev-palette-colors-${mode}`;
const surfaceKey = (mode: ColorMode) => `dev-palette-surfaces-${mode}`;
const CTA_STORAGE_KEY      = "dev-palette-cta";
const CTA_TEXT_STORAGE_KEY = "dev-palette-cta-text";
const MODE_STORAGE_KEY     = "dev-palette-mode";

function loadColors(mode: ColorMode): PaletteColors {
  try {
    const raw = localStorage.getItem(colorKey(mode));
    if (raw) return { ...(mode === "light" ? lightPaletteColors : darkPaletteColors), ...JSON.parse(raw) };
  } catch {}
  return mode === "light" ? lightPaletteColors : darkPaletteColors;
}

function loadSurfaces(mode: ColorMode): SurfaceColors {
  try {
    const raw = localStorage.getItem(surfaceKey(mode));
    if (raw) return { ...(mode === "light" ? lightSurfaceColors : darkSurfaceColors), ...JSON.parse(raw) };
  } catch {}
  return mode === "light" ? lightSurfaceColors : darkSurfaceColors;
}

// ─── Context type ─────────────────────────────────────────────────────────────
type PaletteContextType = {
  colors: PaletteColors;
  updateColor: (section: SectionKey, key: keyof SectionColor, value: string) => void;
  surfaceColors: SurfaceColors;
  updateSurface: (key: keyof SurfaceColors, value: string) => void;
  resetColors: () => void;
  ctaColor: string;
  updateCtaColor: (value: string) => void;
  ctaTextColor: string;
  updateCtaTextColor: (value: string) => void;
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  paletteEditorOpen: boolean;
  openPaletteEditor: () => void;
  closePaletteEditor: () => void;
};

const PaletteContext = createContext<PaletteContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function PaletteProvider({ children }: { children: ReactNode }) {
  const [colors, setColors]               = useState<PaletteColors>(darkPaletteColors);
  const [surfaceColors, setSurfaceColors] = useState<SurfaceColors>(darkSurfaceColors);
  const [ctaColor, setCtaColor]           = useState<string>(DEFAULT_CTA_COLOR);
  const [ctaTextColor, setCtaTextColor]   = useState<string>(DEFAULT_CTA_TEXT_COLOR);
  const [colorMode, setColorModeState]    = useState<ColorMode>("dark");
  const [paletteEditorOpen, setPaletteEditorOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedMode = (localStorage.getItem(MODE_STORAGE_KEY) ?? "dark") as ColorMode;
    setColorModeState(storedMode);
    applyCSSVars(storedMode === "light" ? LIGHT_CSS_VARS : DARK_CSS_VARS);
    setColors(loadColors(storedMode));
    setSurfaceColors(loadSurfaces(storedMode));
      try {
      const storedCta = localStorage.getItem(CTA_STORAGE_KEY);
      if (storedCta) setCtaColor(storedCta);
      const storedCtaText = localStorage.getItem(CTA_TEXT_STORAGE_KEY);
      if (storedCtaText) setCtaTextColor(storedCtaText);
    } catch {}
  }, []);

  // Sync surface colors to CSS variables whenever they change
  useEffect(() => {
    document.documentElement.style.setProperty("--surface-0", surfaceColors.page);
  }, [surfaceColors.page]);

  useEffect(() => {
    document.documentElement.style.setProperty("--surface-modal", surfaceColors.content);
  }, [surfaceColors.content]);

  useEffect(() => {
    document.documentElement.style.setProperty("--surface-foreground-0", surfaceColors.text);
  }, [surfaceColors.text]);

  useEffect(() => {
    document.documentElement.style.setProperty("--surface-foreground-2", surfaceColors.textSubtle);
  }, [surfaceColors.textSubtle]);

  const setColorMode = useCallback((mode: ColorMode) => {
    setColorModeState(mode);
    localStorage.setItem(MODE_STORAGE_KEY, mode);
    // Restore each mode's own saved palette (or defaults if never customised)
    setColors(loadColors(mode));
    setSurfaceColors(loadSurfaces(mode));
    applyCSSVars(mode === "light" ? LIGHT_CSS_VARS : DARK_CSS_VARS);
  }, []);

  const updateColor = useCallback((section: SectionKey, key: keyof SectionColor, value: string) => {
    setColors((prev) => {
      const next = { ...prev, [section]: { ...prev[section], [key]: value } };
      try { localStorage.setItem(colorKey(colorMode), JSON.stringify(next)); } catch {}
      return next;
    });
  }, [colorMode]);

  const updateSurface = useCallback((key: keyof SurfaceColors, value: string) => {
    setSurfaceColors((prev) => {
      const next = { ...prev, [key]: value };
      try { localStorage.setItem(surfaceKey(colorMode), JSON.stringify(next)); } catch {}
      return next;
    });
  }, [colorMode]);

  const updateCtaColor = useCallback((value: string) => {
    setCtaColor(value);
    try { localStorage.setItem(CTA_STORAGE_KEY, value); } catch {}
  }, []);

  const updateCtaTextColor = useCallback((value: string) => {
    setCtaTextColor(value);
    try { localStorage.setItem(CTA_TEXT_STORAGE_KEY, value); } catch {}
  }, []);

  const resetColors = useCallback(() => {
    const newPalette  = colorMode === "light" ? lightPaletteColors  : darkPaletteColors;
    const newSurfaces = colorMode === "light" ? lightSurfaceColors : darkSurfaceColors;
    setColors(newPalette);
    setSurfaceColors(newSurfaces);
    setCtaColor(DEFAULT_CTA_COLOR);
    setCtaTextColor(DEFAULT_CTA_TEXT_COLOR);
    applyCSSVars(colorMode === "light" ? LIGHT_CSS_VARS : DARK_CSS_VARS);
    try {
      localStorage.removeItem(colorKey(colorMode));
      localStorage.removeItem(surfaceKey(colorMode));
      localStorage.removeItem(CTA_STORAGE_KEY);
      localStorage.removeItem(CTA_TEXT_STORAGE_KEY);
    } catch {}
  }, [colorMode]);

  const openPaletteEditor  = useCallback(() => setPaletteEditorOpen(true), []);
  const closePaletteEditor = useCallback(() => setPaletteEditorOpen(false), []);

  return (
    <PaletteContext.Provider value={{
      colors, updateColor,
      surfaceColors, updateSurface,
      resetColors,
      ctaColor, updateCtaColor,
      ctaTextColor, updateCtaTextColor,
      colorMode, setColorMode,
      paletteEditorOpen, openPaletteEditor, closePaletteEditor,
    }}>
      {children}
    </PaletteContext.Provider>
  );
}

export function usePalette() {
  const context = useContext(PaletteContext);
  if (!context) throw new Error("usePalette must be used within PaletteProvider");
  return context;
}

"use client";

import localFont from "next/font/local";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";

const klarheit = localFont({ src: "../../fonts/ESKlarheitPlakat-Xbd.otf" });
import { Breadcrumb } from "@/components/Breadcrumb";
import {
  Compass,
  Shapes,
  Image,
  PaintBrush,
  GridFour,
  Star,
  TShirt,
  Play,
  File,
  Layout,
  TextT,
  SpeakerHigh,
  Plus,
  MagnifyingGlass,
  Shuffle,
  DotsThree,
  Trash,
  DownloadSimple,
  Heart,
  ShareNetwork,
  CaretDown,
  X,
  MusicNotes,
  Waveform,
  Pause,
} from "@phosphor-icons/react";
import { AssistantButton } from "@/components/AssistantButton";
import { AvatarWithProgress } from "@/components/AvatarWithProgress";
import { FreepikButton } from "@/components/FreepikButton";
import { usePalette } from "@/contexts/PaletteContext";
import defaultCuratedRaw from "@/app/api/stock/curated-defaults.json";

const defaultCurated = defaultCuratedRaw as FreepikResource[];

const stockItems = [
  { id: "mixed", label: "Explore", icon: Shapes },
  // { id: "featured", label: "Explore", icon: Compass },
  { id: "photos", label: "Photos", icon: Image },
  { id: "illustrations", label: "Illustrations", icon: PaintBrush },
  { id: "vectors", label: "Vectors", icon: GridFour },
  { id: "icons", label: "Icons", icon: Star },
  { id: "mockups", label: "Mockups", icon: TShirt },
  { id: "videos", label: "Videos", icon: Play },
  { id: "psds", label: "PSD's", icon: File },
  { id: "designs", label: "Designs", icon: Layout },
  { id: "fonts", label: "Fonts", icon: TextT },
  { id: "music", label: "Music", icon: MusicNotes },
  { id: "sfx", label: "Sound Effects", icon: Waveform },
];

const myCollectionsItems = [
  { id: "brand-assets", label: "Brand assets", thumbnail: "bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300" },
  { id: "product-mockups", label: "Product mockups", thumbnail: "bg-gradient-to-br from-purple-300 via-pink-300 to-orange-300" },
  { id: "bw-portraits", label: "Black and white portrai...", thumbnail: "bg-gradient-to-br from-gray-300 to-gray-500" },
  { id: "backgrounds", label: "Backgrounds", thumbnail: "bg-gradient-to-br from-blue-300 via-indigo-300 to-purple-300" },
];

const stockImages = [
  // 9:16 — dead tree in desert
  { id: "s1", src: "https://images.unsplash.com/photo-1772289093030-bc33ef6d4417?w=400&q=80", aspect: 9 / 16 },
  // 16:9 — landscape
  { id: "s2", src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80", aspect: 16 / 9 },
  // 1:1 — food
  { id: "s3", src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", aspect: 1 },
  // 4:3 — architecture
  { id: "s4", src: "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?w=400&q=80", aspect: 4 / 3 },
  // 9:16 — portrait
  { id: "s5", src: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=400&q=80", aspect: 9 / 16 },
  // 16:9 — city
  { id: "s6", src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80", aspect: 16 / 9 },
  // 1:1 — abstract
  { id: "s7", src: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80", aspect: 1 },
  // 4:3 — interior
  { id: "s8", src: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80", aspect: 4 / 3 },
  // 9:16 — fashion
  { id: "s9", src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80", aspect: 9 / 16 },
  // 16:9 — aerial
  { id: "s10", src: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=600&q=80", aspect: 16 / 9 },
  // 1:1 — product
  { id: "s11", src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", aspect: 1 },
  // 4:3 — tech
  { id: "s12", src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80", aspect: 4 / 3 },
  // 9:16 — nature vertical
  { id: "s13", src: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&q=80", aspect: 9 / 16 },
  // 16:9 — mountains
  { id: "s14", src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80", aspect: 16 / 9 },
  // 1:1 — group of friends
  { id: "s15", src: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&q=80", aspect: 1 },
  // 4:3 — travel
  { id: "s16", src: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80", aspect: 4 / 3 },
  // 9:16 — portrait outdoor
  { id: "s17", src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80", aspect: 9 / 16 },
  // 16:9 — city night
  { id: "s18", src: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&q=80", aspect: 16 / 9 },
  // 1:1 — texture
  { id: "s19", src: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&q=80", aspect: 1 },
  // 4:3 — minimalist
  { id: "s20", src: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=600&q=80", aspect: 4 / 3 },
  // 9:16 — model
  { id: "s21", src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80", aspect: 9 / 16 },
  // 16:9 — food flat lay
  { id: "s22", src: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=600&q=80", aspect: 16 / 9 },
  // 1:1 — macro
  { id: "s23", src: "https://images.unsplash.com/photo-1550159930-40066082a4fc?w=400&q=80", aspect: 1 },
  // 4:3 — turtle
  { id: "s24", src: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=400&q=80", aspect: 4 / 3 },
  // 1:1 — cat
  { id: "s25", src: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&q=80", aspect: 1 },
  // 1:1 — abstract wavy lines
  { id: "s26", src: "https://images.unsplash.com/photo-1772144040482-cdb26a51548f?w=400&q=80", aspect: 1 },
  // 4:3 — auto rickshaw cityscape
  { id: "s27", src: "https://images.unsplash.com/photo-1772223610205-0a8f53d83b42?w=600&q=80", aspect: 4 / 3 },
  // 16:9 — sand dunes ocean
  { id: "s28", src: "https://images.unsplash.com/photo-1772289495953-1271fe108a6c?w=600&q=80", aspect: 16 / 9 },
  // 16:9 — crowded beach umbrellas
  { id: "s29", src: "https://images.unsplash.com/photo-1770929356906-765cd4e21dd1?w=600&q=80", aspect: 16 / 9 },
  // 16:9 — modern living room
  { id: "s30", src: "https://images.unsplash.com/photo-1772475329864-e30a2f1278c0?w=600&q=80", aspect: 16 / 9 },
  // 9:16 — Japanese signs at night
  { id: "s31", src: "https://images.unsplash.com/photo-1772452324050-bca34b3201fd?w=400&q=80", aspect: 9 / 16 },
  // 1:1 — flowers in vases
  { id: "s32", src: "https://images.unsplash.com/photo-1772453609524-fa1d206482d7?w=400&q=80", aspect: 1 },
  // 9:16 — man in hallway
  { id: "s33", src: "https://images.unsplash.com/photo-1770347277163-ea9dc1b1ebc5?w=400&q=80", aspect: 9 / 16 },
  // 1:1 — abstract grid lights
  { id: "s34", src: "https://images.unsplash.com/photo-1771873679947-dd2b426cfd77?w=400&q=80", aspect: 1 },
  // 16:9 — airplane window clouds
  { id: "s35", src: "https://images.unsplash.com/photo-1771694583915-78f9b39fd6d1?w=600&q=80", aspect: 16 / 9 },
  // 4:3 — orange sneakers
  { id: "s36", src: "https://images.unsplash.com/photo-1771049873881-45b23a2e9847?w=400&q=80", aspect: 4 / 3 },
  // 9:16 — woman with bangs in red
  { id: "s37", src: "https://images.unsplash.com/photo-1770135157320-68ecfe9cd608?w=400&q=80", aspect: 9 / 16 },
  // 1:1 — abstract swirling orange silver
  { id: "s38", src: "https://images.unsplash.com/photo-1770492727730-05cb5ff3e90a?w=400&q=80", aspect: 1 },
  // 4:3 — woman walking curved pavement
  { id: "s39", src: "https://images.unsplash.com/photo-1770074051176-76dc5019be0a?w=400&q=80", aspect: 4 / 3 },
];



const categoryFilters: Record<string, string[]> = {
  featured: ["Nature", "Business", "Technology", "Abstract", "People", "Architecture", "Food", "Travel", "Fashion", "Animals"],
  mixed: ["Nature", "Business", "Technology", "Abstract", "People", "Architecture", "Food", "Travel", "Fashion", "Animals"],
  photos: ["Portrait", "Landscape", "Aerial", "Street", "Black & white", "Macro", "Night", "Documentary", "Editorial"],
  illustrations: ["Flat", "3D", "Hand-drawn", "Isometric", "Line art", "Watercolor", "Character", "Infographic"],
  vectors: ["Geometric", "Patterns", "Icons", "Logos", "Backgrounds", "Borders", "Shapes", "Gradients"],
  icons: ["Outlined", "Filled", "Duotone", "Animated", "Flat", "Gradient", "Glyph", "Hand-drawn"],
  mockups: ["Device", "Apparel", "Packaging", "Stationery", "Print", "Scene", "Social media", "Billboard"],
  videos: ["Cinematic", "Aerial", "Timelapse", "Slow motion", "Nature", "Urban", "Lifestyle", "Abstract"],
  psds: ["UI kits", "Templates", "Flyers", "Banners", "Business cards", "Social media", "Posters", "Brochures"],
  designs: ["Web", "Mobile", "Dashboard", "Landing page", "Email", "Presentation", "App UI", "Wireframe"],
  fonts: ["Sans-serif", "Serif", "Display", "Handwritten", "Monospace", "Script", "Slab", "Variable"],
  music: ["Happy", "Energetic", "Peaceful", "Dark", "Epic", "Upbeat", "Cinematic", "Jazz", "Lo-Fi", "Electronic"],
  sfx: ["Ambience", "Foley", "Transitions", "Musical", "Realistic", "Interface"],
};


type FreepikResource = {
  id: number;
  title: string;
  image: { source: { url: string; size?: string }; orientation?: string };
  preview?: { url: string };
  type: string;
  duration?: string;
  quality?: string;
  previewUrl?: string | null;
  // Audio fields
  audioUrl?: string | null;
  genre?: string;
  bpm?: number;
  mood?: string[];
  artist?: string;
  sfxCategory?: string;
  tags?: string[];
};

type SearchFilters = {
  contentType: string;
  license: string;
  aiGenerated: string;
  orientation: string;
  color: string;
  people: string;
};

const defaultFilters: SearchFilters = {
  contentType: "all",
  license: "all",
  aiGenerated: "only",
  orientation: "all",
  color: "",
  people: "all",
};

// Maps each music tab to its Freepik API filter type (mood or genre)
const musicTabMappings: Record<string, { mood?: string; genre?: string }> = {
  // Moods
  "Happy":      { mood: "Happy" },
  "Energetic":  { mood: "Energetic" },
  "Upbeat":     { mood: "Upbeat" },
  "Exciting":   { mood: "Exciting" },
  "Groovy":     { mood: "Groovy" },
  "Playful":    { mood: "Playful" },
  "Peaceful":   { mood: "Peaceful" },
  "Hopeful":    { mood: "Hopeful" },
  "Elegant":    { mood: "Elegant" },
  "Soulful":    { mood: "Soulful" },
  "Laid Back":  { mood: "Laid Back" },
  "Sentimental":{ mood: "Sentimental" },
  "Melancholic":{ mood: "Melancholic" },
  "Dark":       { mood: "Dark" },
  "Dramatic":   { mood: "Dramatic" },
  "Epic":       { mood: "Epic" },
  "Tension":    { mood: "Tension" },
  "Sad":        { mood: "Sad" },
  // Genres
  "Pop":        { genre: "Pop" },
  "Electronic": { genre: "Electronic" },
  "Hip Hop":    { genre: "Hip Hop" },
  "Rock":       { genre: "Rock" },
  "Jazz":       { genre: "Jazz" },
  "Cinematic":  { genre: "Cinematic" },
  "Ambient":    { genre: "Ambient" },
  "Lo-Fi":      { genre: "Lofi" },
  "Corporate":  { genre: "Corporate" },
  "Classical":  { genre: "Classical" },
  "Acoustic":   { genre: "Acoustic" },
  "Synthwave":  { genre: "Synthwave" },
  "RnB":        { genre: "RnB" },
  "Soul":       { genre: "Soul" },
  "Funk":       { genre: "Funk" },
  "Latin":      { genre: "Latin" },
  "Country":    { genre: "Country" },
  "Reggae":     { genre: "Reggae" },
  "Blues":      { genre: "Blues" },
  "Disco":      { genre: "Disco" },
  "Lounge":     { genre: "Lounge" },
  "Afrobeat":   { genre: "Afrobeat" },
  "World":      { genre: "World" },
  "Children":   { genre: "Children" },
};
const musicTabs = Object.keys(musicTabMappings);

const musicCollections = [
  { label: "Trending Now", colorKey: "image" as const, query: "trending" },
  { label: "Chill Vibes", colorKey: "video" as const, query: "chill" },
  { label: "Workout Energy", colorKey: "audio" as const, query: "workout" },
  { label: "Focus & Study", colorKey: "spaces" as const, query: "focus" },
  { label: "Cinematic Scores", colorKey: "3d" as const, query: "cinematic" },
  { label: "Happy & Uplifting", colorKey: "stock" as const, query: "happy uplifting" },
  { label: "Travel & Adventure", colorKey: "video" as const, query: "travel adventure" },
  { label: "Romantic", colorKey: "audio" as const, query: "romantic" },
  { label: "Night Drive", colorKey: "spaces" as const, query: "night drive" },
  { label: "Nature Sounds", colorKey: "image" as const, query: "nature" },
];

const sfxTabMappings: Record<string, string> = {
  "Ambience":           "ambience",
  "Forest":             "forest",
  "City":               "city-ambience",
  "Room Tones":         "room-tones",
  "Rain & Storm":       "rain-and-storm",
  "Beach & Ocean":      "beach-and-ocean",
  "Wind":               "wind",
  "Foley":              "foley",
  "Weapons":            "weapons-and-warfare",
  "Footsteps":          "footsteps",
  "Explosions":         "explosions-and-crashes",
  "Kicks & Punches":    "kicks-and-punches",
  "Clothing":           "clothing",
  "Debris":             "debris",
  "Human Sounds":       "human-sounds",
  "Glitch & Noise":     "glitch-and-noise",
  "Cartoon":            "cartoon-voices-and-sounds",
  "Sci-Fi":             "sci-fi-sounds",
  "Horror":             "ghosts-and-horror-transitions",
  "Gaming & Fantasy":   "gaming-and-fantasy",
  "Interface":          "interface-and-alerts",
  "UI":                 "user-interface",
  "Musical":            "musical",
  "Drums & Percussion": "drum-and-percussion-loops",
  "Vocal Phrases":      "vocal-phrases",
  "One Shots":          "one-shots",
  "Melodic Loops":      "melodic-loops",
  "Realistic":          "realistic",
  "Wildlife":           "wildlife",
  "Machines & Tools":   "machines-and-tools",
  "Household":          "household-objects",
  "Cars & Airplanes":   "cars-and-airplanes",
  "Water":              "water",
  "Electronic Devices": "electronic-devices",
  "Pets & Farm":        "pets-and-farm-animals",
  "Transitions":        "transitions",
  "Epic Transitions":   "epic-transitions",
  "Cinematic Impacts":  "cinematic-impacts",
  "Whooshes":           "whooshes",
  "Risers":             "risers",
  "Intros & Outros":    "intros-and-outros",
};
const sfxTabs = Object.keys(sfxTabMappings);

const sfxCollections = [
  { label: "Ambience", colorKey: "image" as const, category: "ambience" },
  { label: "Rain & Storm", colorKey: "video" as const, category: "rain-and-storm" },
  { label: "Foley", colorKey: "audio" as const, category: "foley" },
  { label: "Explosions", colorKey: "3d" as const, category: "explosions-and-crashes" },
  { label: "Sci-Fi", colorKey: "spaces" as const, category: "sci-fi-sounds" },
  { label: "Interface", colorKey: "stock" as const, category: "interface-and-alerts" },
  { label: "Cinematic Impacts", colorKey: "audio" as const, category: "cinematic-impacts" },
  { label: "Cartoon", colorKey: "video" as const, category: "cartoon-voices-and-sounds" },
  { label: "Whooshes", colorKey: "spaces" as const, category: "whooshes" },
  { label: "Footsteps", colorKey: "image" as const, category: "footsteps" },
  { label: "Glitch & Noise", colorKey: "3d" as const, category: "glitch-and-noise" },
  { label: "Ghosts & Horror", colorKey: "spaces" as const, category: "ghosts-and-horror-transitions" },
  { label: "Gaming & Fantasy", colorKey: "video" as const, category: "gaming-and-fantasy" },
  { label: "User Interface", colorKey: "stock" as const, category: "user-interface" },
  { label: "Musical", colorKey: "audio" as const, category: "musical" },
];

type FilterOption = { value: string; label: string; hex?: string };
type FilterDef = {
  id: keyof SearchFilters;
  label: string;
  icon?: React.ElementType;
  options: FilterOption[];
  isColor?: boolean;
};

const filterDefs: FilterDef[] = [
  {
    id: "contentType",
    label: "All Images",
    icon: GridFour,
    options: [
      { value: "all", label: "All Images" },
      { value: "photo", label: "Photos" },
      { value: "vector", label: "Vectors" },
      { value: "psd", label: "PSDs" },
    ],
  },
  {
    id: "license",
    label: "License",
    options: [
      { value: "all", label: "Any license" },
      { value: "freemium", label: "Free" },
      { value: "premium", label: "Premium" },
    ],
  },
  {
    id: "aiGenerated",
    label: "AI-generated",
    options: [
      { value: "only", label: "AI only" },
      { value: "all", label: "All" },
      { value: "excluded", label: "No AI" },
    ],
  },
  {
    id: "orientation",
    label: "Orientation",
    options: [
      { value: "all", label: "Any" },
      { value: "landscape", label: "Landscape" },
      { value: "portrait", label: "Portrait" },
      { value: "square", label: "Square" },
      { value: "panoramic", label: "Panoramic" },
    ],
  },
  {
    id: "color",
    label: "Color",
    isColor: true,
    options: [
      { value: "", label: "Any color" },
      { value: "black", label: "Black", hex: "#1a1a1a" },
      { value: "blue", label: "Blue", hex: "#3b82f6" },
      { value: "gray", label: "Gray", hex: "#9ca3af" },
      { value: "green", label: "Green", hex: "#22c55e" },
      { value: "orange", label: "Orange", hex: "#f97316" },
      { value: "red", label: "Red", hex: "#ef4444" },
      { value: "white", label: "White", hex: "#e5e5e5" },
      { value: "yellow", label: "Yellow", hex: "#eab308" },
      { value: "purple", label: "Purple", hex: "#a855f7" },
      { value: "cyan", label: "Cyan", hex: "#06b6d4" },
      { value: "pink", label: "Pink", hex: "#ec4899" },
    ],
  },
  {
    id: "people",
    label: "People",
    options: [
      { value: "all", label: "Any" },
      { value: "include", label: "With people" },
      { value: "exclude", label: "Without people" },
    ],
  },
];

function FilterPill({
  label,
  icon: Icon,
  options,
  value,
  onChange,
  isColor = false,
}: {
  label: string;
  icon?: React.ElementType;
  options: FilterOption[];
  value: string;
  onChange: (v: string) => void;
  isColor?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const isActive = isColor ? value !== "" : value !== options[0].value;
  const currentLabel = options.find((o) => o.value === value)?.label ?? label;
  const activeColor = isColor && value ? options.find((o) => o.value === value) : null;

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t) || dropdownRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleOpen = () => {
    if (btnRef.current) setRect(btnRef.current.getBoundingClientRect());
    setOpen((v) => !v);
  };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        className="flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg pl-3 text-xs font-medium transition-colors"
        style={{
          background: isActive ? "var(--selected)" : "var(--surface-border-alpha-0)",
          color: isActive ? "var(--surface-foreground-0)" : "var(--surface-foreground-2)",
          paddingRight: isActive ? "6px" : "12px",
        }}
      >
        {Icon && !activeColor && <Icon size={13} weight="bold" className="opacity-70" />}
        {activeColor && (
          <span
            className="size-3.5 shrink-0 rounded-full"
            style={{
              background: activeColor.hex,
              border: activeColor.value === "white" ? "1px solid var(--surface-border-alpha-1)" : "none",
            }}
          />
        )}
        <span>{!isColor && isActive ? currentLabel : label}</span>
        {isActive ? (
          <span
            role="button"
            aria-label="Clear filter"
            className="flex size-5 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-fg/15"
            onClick={(e) => {
              e.stopPropagation();
              onChange(options[0].value);
            }}
          >
            <X size={10} weight="bold" />
          </span>
        ) : (
          <CaretDown size={9} weight="bold" className="opacity-50" />
        )}
      </button>

      {open && rect &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: rect.bottom + 4,
              left: rect.left,
              zIndex: 9999,
              background: "var(--surface-modal)",
              borderColor: "var(--surface-border-alpha-1)",
            }}
            className="rounded-xl border p-1 shadow-2xl"
          >
            {isColor ? (
              <div className="p-2">
                <div className="grid grid-cols-4 gap-1.5">
                  {options.slice(1).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      title={opt.label}
                      onClick={() => { onChange(opt.value); setOpen(false); }}
                      className="size-8 shrink-0 rounded-lg transition-transform hover:scale-105"
                      style={{
                        background: opt.hex,
                        outline: opt.value === value ? "2px solid var(--surface-foreground-0)" : "none",
                        outlineOffset: 2,
                        border: opt.value === "white" ? "1px solid var(--surface-border-alpha-1)" : "none",
                      }}
                    />
                  ))}
                </div>
                {value && (
                  <button
                    type="button"
                    onClick={() => { onChange(""); setOpen(false); }}
                    className="mt-1.5 h-7 w-full rounded-lg text-xs text-fg-muted transition-colors hover:bg-fg/10"
                  >
                    Clear
                  </button>
                )}
              </div>
            ) : (
              options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className="flex h-8 w-full cursor-pointer items-center rounded-lg px-3 text-xs transition-colors hover:bg-fg/10"
                  style={{
                    color: opt.value === value ? "var(--surface-foreground-0)" : "var(--surface-foreground-2)",
                    background: opt.value === value ? "var(--selected)" : "transparent",
                    minWidth: 140,
                  }}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>,
          document.body
        )}
    </>
  );
}

function parseAspectRatio(size?: string): number | undefined {
  if (!size) return undefined;
  const [w, h] = size.split("x").map(Number);
  if (!w || !h) return undefined;
  return w / h;
}


function LazyVideo({ src, autoPlay, className }: { src: string; autoPlay: boolean; className: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const shouldPlayRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          shouldPlayRef.current = autoPlay;
          setActive(true);
          // If src is already loaded (e.g. revisiting), play immediately
          if (autoPlay && el.readyState >= 3) el.play().catch(() => {});
        } else {
          shouldPlayRef.current = false;
          el.pause();
          if (!autoPlay) el.currentTime = 0;
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [autoPlay]);

  return (
    <video
      ref={ref}
      src={active ? src : undefined}
      muted
      loop
      playsInline
      className={className}
      onCanPlay={(e) => {
        if (shouldPlayRef.current) e.currentTarget.play().catch(() => {});
      }}
    />
  );
}

function getWaveformBars(id: number, count = 52): number[] {
  const bars: number[] = [];
  let seed = Math.abs(id) * 1000;
  for (let i = 0; i < count; i++) {
    seed = (seed * 1664525 + 1013904223) & 0x7fffffff;
    bars.push(12 + (seed % 76));
  }
  return bars;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function AudioRow({
  item,
  isPlaying,
  onTogglePlay,
  audioRef,
}: {
  item: FreepikResource;
  isPlaying: boolean;
  onTogglePlay: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}) {
  const meta = [item.artist, item.genre, item.sfxCategory].filter(Boolean).join(" · ");
  const bars = useMemo(() => getWaveformBars(item.id, 80), [item.id]);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const waveformRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setProgress(0);
      setElapsed(0);
      return;
    }
    const tick = () => {
      const audio = audioRef.current;
      if (audio?.duration && !isDraggingRef.current) {
        setProgress(audio.currentTime / audio.duration);
        setElapsed(audio.currentTime);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isPlaying, audioRef]);

  const seekTo = useCallback((clientX: number) => {
    const audio = audioRef.current;
    if (!waveformRef.current || !audio?.duration) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
    setProgress(ratio);
    setElapsed(audio.currentTime);
  }, [audioRef]);

  const handleWaveformMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isPlaying) {
      onTogglePlay();
      return;
    }
    e.preventDefault();
    isDraggingRef.current = true;
    seekTo(e.clientX);
    const onMove = (ev: MouseEvent) => seekTo(ev.clientX);
    const onUp = () => {
      isDraggingRef.current = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [isPlaying, onTogglePlay, seekTo]);

  return (
    <div
      className="group flex min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-fg/5"
    >
      {/* Cover art + play overlay */}
      <div className="relative shrink-0">
        <div
          className="size-12 overflow-hidden rounded-xl"
          style={{ background: "var(--surface-border-alpha-1)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image?.source?.url || "/sfx-placeholder.png"}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        </div>
        <button
          type="button"
          onClick={onTogglePlay}
          className={`absolute inset-0 flex cursor-pointer items-center justify-center rounded-xl transition-opacity ${isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
          style={{ background: "rgba(0,0,0,0.55)" }}
        >
          {isPlaying ? (
            <Pause weight="fill" size={14} className="text-white" />
          ) : (
            <Play weight="fill" size={14} className="text-white" />
          )}
        </button>
      </div>

      {/* Title + meta */}
      <div className="flex w-28 shrink-0 flex-col gap-0.5 min-w-0">
        <span className="truncate text-[13px] font-medium text-fg">{item.title}</span>
        {meta && <span className="truncate text-[11px] text-fg-muted">{meta}{item.bpm ? ` · ${item.bpm} BPM` : ""}</span>}
      </div>

      {/* Waveform */}
      <div
        ref={waveformRef}
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-[1px] overflow-hidden"
        style={{ height: 36 }}
        onMouseDown={handleWaveformMouseDown}
      >
        {bars.map((h, i) => {
          const played = isPlaying && i / bars.length <= progress;
          return (
            <div
              key={i}
              className="flex-1 rounded-full"
              style={{
                height: `${h}%`,
                minWidth: 2,
                background: played
                  ? "var(--surface-foreground-0)"
                  : "var(--surface-border-alpha-1)",
                opacity: played ? 0.85 : 0.35,
              }}
            />
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-0.5">
        {[DotsThree, DownloadSimple, Heart].map((Icon, i) => (
          <div
            key={i}
            role="button"
            tabIndex={0}
            className="flex size-7 cursor-pointer items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-fg/10 hover:text-fg"
          >
            <Icon weight="bold" size={14} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StockPage() {
  const { surfaceColors: sc } = usePalette();
  const router = useRouter();
  const [activeCategory, setActiveCategoryRaw] = useState("mixed");
  const setActiveCategory = useCallback((cat: string) => {
    setActiveCategoryRaw(cat);
    router.replace(`/stock?category=${cat}`, { scroll: false });
  }, [router]);
  const [activeBrowseTab, setActiveBrowseTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FreepikResource[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [musicTag, setMusicTag] = useState("");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const categoryBtnRef = useRef<HTMLButtonElement>(null);
  const [categoryDropdownRect, setCategoryDropdownRect] = useState<DOMRect | null>(null);
  const [sfxCategory, setSfxCategory] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const filtersRef = useRef<SearchFilters>(defaultFilters);
  const isSearchModeRef = useRef(false);
  const musicTagRef = useRef("");
  const sfxCategoryRef = useRef("");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => { filtersRef.current = filters; }, [filters]);

  useEffect(() => {
    if (!categoryDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (categoryBtnRef.current?.contains(t) || categoryMenuRef.current?.contains(t)) return;
      setCategoryDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [categoryDropdownOpen]);
  useEffect(() => { isSearchModeRef.current = isSearchMode; }, [isSearchMode]);
  useEffect(() => { musicTagRef.current = musicTag; }, [musicTag]);
  useEffect(() => { sfxCategoryRef.current = sfxCategory; }, [sfxCategory]);

  const fetchResults = useCallback(async (term: string, category: string, activeFilters: SearchFilters = defaultFilters, audioExtra?: { musicTag?: string; sfxCategory?: string }) => {
    if (abortRef.current) abortRef.current.abort();
    if (!term.trim() && category === "featured") { setSubmittedQuery(""); return; }
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    // For mixed: show curated items immediately from localStorage before any API call
    let curatedItems: FreepikResource[] = [];
    if (category === "mixed") {
      try {
        const stored = localStorage.getItem("stock-curated-items");
        const parsed = stored ? JSON.parse(stored) : [];
        curatedItems = Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultCurated;
      } catch {
        curatedItems = defaultCurated;
      }
      if (curatedItems.length > 0) setSearchResults(curatedItems);
    }

    setIsLoading(true);
    try {
      if (category === "mixed" && !term.trim()) {
        // Mixed default view: curated items shuffled
        const shuffled = [...curatedItems].sort(() => Math.random() - 0.5);
        setSearchResults(shuffled);
      } else {
        let endpoint: string;
        if (category === "music") {
          const tag = audioExtra?.musicTag ?? musicTagRef.current;
          const mapping = tag ? musicTabMappings[tag] : undefined;
          const mp = new URLSearchParams({ limit: "30" });
          if (term.trim()) mp.set("q", term);
          if (mapping?.genre) mp.set("genre", mapping.genre);
          if (mapping?.mood)  mp.set("mood",  mapping.mood);
          endpoint = `/api/stock/music?${mp.toString()}`;
        } else if (category === "sfx") {
          const cat = audioExtra?.sfxCategory ?? sfxCategoryRef.current;
          const sp = new URLSearchParams({ limit: "30" });
          if (term.trim()) sp.set("q", term);
          if (cat) sp.set("category", cat);
          endpoint = `/api/stock/sfx?${sp.toString()}`;
        } else if (category === "videos") {
          endpoint = `/api/stock/video-search?term=${encodeURIComponent(term)}&page=1`;
        } else {
          const filterParams = new URLSearchParams({
            contentType: activeFilters.contentType,
            license: activeFilters.license,
            aiGenerated: activeFilters.aiGenerated,
            orientation: activeFilters.orientation,
            color: activeFilters.color,
            people: activeFilters.people,
          });
          endpoint = `/api/stock/search?term=${encodeURIComponent(term)}&category=${category}&${filterParams.toString()}`;
        }
        const res = await fetch(endpoint, { signal });
        const data = await res.json();
        setSearchResults(data.data ?? []);
      }
    } catch {
      // aborted or failed — leave previous results
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) return;
    setIsSearchMode(true);
    setSubmittedQuery(searchQuery);
    fetchResults(searchQuery, activeCategory, filtersRef.current);
  }, [searchQuery, activeCategory, fetchResults]);

  // Load mixed feed on initial mount
  useEffect(() => {
    fetchResults("", "mixed");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isSearchModeRef.current && submittedQuery) {
      fetchResults(submittedQuery, activeCategory, filtersRef.current);
    }
  }, [activeCategory]); // re-run search when category changes, only in search mode

  // Stop audio when switching away from audio categories
  useEffect(() => {
    if (activeCategory !== "music" && activeCategory !== "sfx") {
      audioRef.current?.pause();
      audioRef.current = null;
      setPlayingId(null);
    }
  }, [activeCategory]);

  const handleTogglePlay = useCallback(async (item: FreepikResource) => {
    if (playingId === item.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    audioRef.current?.pause();

    // Resolve audio URL on demand if not in search results
    let audioUrl = item.audioUrl ?? null;
    if (!audioUrl && item.type === "music") {
      try {
        const res = await fetch(`/api/stock/music/${item.id}`);
        const data = await res.json();
        audioUrl = data.audioUrl ?? null;
      } catch {
        // ignore
      }
    }

    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.play().catch(() => {});
    audio.onended = () => setPlayingId(null);
    audioRef.current = audio;
    setPlayingId(item.id);
  }, [playingId]);

  return (
    <main
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl"
      style={{ background: "var(--surface-modal)" }}
    >
      <header className="flex h-[60px] shrink-0 items-center justify-between px-6">
        <Breadcrumb />
        <div className="flex items-center gap-3">
          <FreepikButton />
          <AssistantButton />
          <AvatarWithProgress />
        </div>
      </header>

      <div className="flex min-h-0 flex-1 gap-1 px-1 pb-1">
        {/* Left panel (hidden for now) */}
        {/* <div
          className="flex w-[224px] shrink-0 flex-col overflow-y-auto rounded-2xl py-4"
          style={{ background: sc.panel }}
        >
          <div className="px-4 pb-1">
            <span className="text-[10px] font-medium uppercase tracking-wider text-fg-muted">
              Categories
            </span>
          </div>
          <ul className="space-y-0.5 px-2">
            {stockItems.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory(id);
                    setActiveBrowseTab("All");
                    setSearchQuery("");
                    setSubmittedQuery("");
                    setIsSearchMode(false);
                    setFilters(defaultFilters);
                    setMusicTag("");
                    musicTagRef.current = "";
                    setSfxCategory("");
                    sfxCategoryRef.current = "";
                    fetchResults("", id);
                  }}
                  className="flex h-8 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-left text-[13px] transition-colors hover:bg-fg/5"
                  style={{
                    color: activeCategory === id ? "var(--surface-foreground-0)" : "var(--surface-foreground-2)",
                    ...(activeCategory === id ? { background: "var(--selected)" } : {}),
                  }}
                >
                  <Icon weight="bold" size={14} className="shrink-0 opacity-60" />
                  <span className="truncate">{label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mx-4 mt-4 border-t" style={{ borderColor: "var(--surface-border-alpha-0)" }} />

          <div className="mt-4 flex items-center justify-between px-4 pb-1">
            <span className="text-[10px] font-medium uppercase tracking-wider text-fg-muted">
              My collections
            </span>
            <button
              type="button"
              className="flex size-5 cursor-pointer items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-fg/10 hover:text-fg"
              aria-label="New collection"
            >
              <Plus weight="bold" size={12} />
            </button>
          </div>
          <ul className="space-y-0.5 px-2">
            {myCollectionsItems.map(({ id, label, thumbnail }) => (
              <li key={id}>
                <button
                  type="button"
                  className="flex h-8 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-left text-[13px] text-fg-muted transition-colors hover:bg-fg/5 hover:text-fg"
                >
                  <span
                    className={`size-5 shrink-0 rounded-md opacity-80 ${thumbnail}`}
                    aria-hidden
                  />
                  <span className="truncate">{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div> */}

        {/* Right content area */}
        <div
          className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto rounded-2xl px-6 py-4"
          style={{ background: sc.panel }}
        >
          {/* Hero */}
          <div className="relative flex shrink-0 flex-col overflow-hidden rounded-2xl px-2 pb-1 pt-4" style={{ height: 120 }}>
              {/* <img src={activeCategory === "music" ? "/music-hero-bg.png" : activeCategory === "sfx" ? "/sfx-hero-bg.png" : activeCategory === "photos" ? "/photos-hero-bg.png" : "/stock-hero-bg.png"} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-0 bg-black/30" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--surface-modal)]/30 via-[var(--surface-modal)]/10 to-transparent" /> */}
              <h1 className="relative text-[48px] font-normal leading-tight text-fg" style={{ fontFamily: klarheit.style.fontFamily }}>
                {({
                  featured: "Premium stock for creators",
                  mixed: "Explore millions of stock assets",
                  photos: "Photos",
                  illustrations: "Illustrations",
                  vectors: "Vectors",
                  icons: "Icons",
                  mockups: "Mockups",
                  videos: "Videos",
                  psds: "PSD's",
                  designs: "Designs",
                  fonts: "Fonts",
                  music: "Music",
                  sfx: "Sound Effects",
                } as Record<string, string>)[activeCategory] ?? "Premium stock"}
              </h1>
              <p className="relative text-[14px] text-fg/70">
                {({
                  featured: "Your all-in-one library of images, vectors, illustrations, videos, and more.",
                  mixed: "AI-generated photos and videos, curated for you.",
                  photos: "Millions of high-quality photos for every project.",
                  illustrations: "Hand-crafted and digital illustrations for any style.",
                  vectors: "Scalable vector graphics, patterns, and icons.",
                  icons: "Thousands of icons in every style and format.",
                  mockups: "Showcase your designs with ready-to-use mockups.",
                  videos: "Cinematic stock footage for your productions.",
                  psds: "Layered Photoshop files ready to customize.",
                  designs: "Templates and UI kits to jumpstart your projects.",
                  fonts: "Premium typefaces for every brand and medium.",
                  music: "Royalty-free music tracks for every project.",
                  sfx: "Royalty-free sound effects across 42 categories.",
                } as Record<string, string>)[activeCategory] ?? ""}
              </p>
              {/* Filter tags */}
          </div>

          {/* Search bar with category dropdown */}
          <div className="relative -mt-4 w-full flex items-center rounded-xl border bg-fg/5" style={{ borderColor: "var(--surface-border-alpha-0)" }}>
            <div className="shrink-0 pl-3" ref={categoryDropdownRef}>
              {(() => {
                const active = stockItems.find((s) => s.id === activeCategory);
                const ActiveIcon = active?.icon ?? Compass;
                return (
                  <button
                    ref={categoryBtnRef}
                    type="button"
                    onClick={() => {
                      if (categoryBtnRef.current) setCategoryDropdownRect(categoryBtnRef.current.getBoundingClientRect());
                      setCategoryDropdownOpen(!categoryDropdownOpen);
                    }}
                    className="flex h-10 cursor-pointer items-center gap-2 rounded-lg px-6 text-base font-medium transition-colors hover:brightness-125"
                    style={{ color: "var(--surface-foreground-0)", background: "var(--selected)" }}
                  >
                    <ActiveIcon weight="bold" size={14} className="shrink-0 opacity-60" />
                    {active?.id === "mixed" ? "All categories" : active?.label ?? "All categories"}
                    <CaretDown weight="bold" size={10} className="opacity-40" />
                  </button>
                );
              })()}
              {categoryDropdownOpen && categoryDropdownRect && createPortal(
                <div
                  ref={categoryMenuRef}
                  className="fixed z-[9999] flex flex-col overflow-hidden rounded-xl border py-1 shadow-2xl animate-[popoverIn_150ms_ease-out]"
                  style={{
                    background: "#252525",
                    borderColor: "rgba(255,255,255,0.08)",
                    minWidth: 200,
                    top: categoryDropdownRect.bottom + 4,
                    left: categoryDropdownRect.left,
                  }}
                >
                  {stockItems.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setActiveCategory(id);
                        setActiveBrowseTab("All");
                        setSearchQuery("");
                        setSubmittedQuery("");
                        setIsSearchMode(false);
                        setFilters(defaultFilters);
                        setMusicTag("");
                        musicTagRef.current = "";
                        setSfxCategory("");
                        sfxCategoryRef.current = "";
                        fetchResults("", id);
                        setCategoryDropdownOpen(false);
                      }}
                      className="flex h-8 cursor-pointer items-center gap-3 px-3 text-left text-[13px] transition-colors hover:bg-fg/5"
                      style={{
                        color: activeCategory === id ? "var(--surface-foreground-0)" : "var(--surface-foreground-2)",
                        background: activeCategory === id ? "var(--selected)" : "transparent",
                      }}
                    >
                      <Icon weight="bold" size={14} className="shrink-0 opacity-60" />
                      {label}
                    </button>
                  ))}
                </div>,
                document.body
              )}
            </div>
            <div className="mx-1 h-4 w-px shrink-0" style={{ background: "var(--surface-border-alpha-0)" }} />
            <MagnifyingGlass
              weight="bold"
              size={16}
              className="mx-3 shrink-0 text-fg-muted"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search stock assets..."
              className="min-w-0 flex-1 bg-transparent py-4 pr-4 text-base text-fg outline-none placeholder:text-fg-muted"
            />
          </div>

          {/* Sub-category tabs */}
          <div className="flex shrink-0 items-center gap-1 overflow-x-auto scrollbar-hide -my-2">
            {isSearchMode ? (
              <>
                {filterDefs.map((fd) => (
                  <FilterPill
                    key={fd.id}
                    label={fd.label}
                    icon={fd.icon}
                    options={fd.options}
                    value={filters[fd.id]}
                    isColor={fd.isColor}
                    onChange={(v) => {
                      const newFilters = { ...filters, [fd.id]: v };
                      setFilters(newFilters);
                      fetchResults(submittedQuery, activeCategory, newFilters);
                    }}
                  />
                ))}
                {Object.entries(filters).some(([k, v]) => v !== defaultFilters[k as keyof SearchFilters]) && (
                  <button
                    type="button"
                    onClick={() => {
                      setFilters(defaultFilters);
                      fetchResults(submittedQuery, activeCategory, defaultFilters);
                    }}
                    className="flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-fg-muted transition-colors hover:bg-fg/10 hover:text-fg"
                  >
                    Clear filters
                  </button>
                )}
              </>
            ) : (categoryFilters[activeCategory] ?? []).length > 0 ? (
              <>
                {["All", ...(categoryFilters[activeCategory] ?? [])].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setActiveBrowseTab(cat);
                      if (cat === "All") {
                        setSearchQuery("");
                        setSubmittedQuery("");
                        setIsSearchMode(false);
                        setFilters(defaultFilters);
                        setMusicTag("");
                        musicTagRef.current = "";
                        setSfxCategory("");
                        sfxCategoryRef.current = "";
                        fetchResults("", activeCategory);
                      } else {
                        if (activeCategory === "sfx") {
                          const sfxSlug = sfxTabMappings[cat] ?? cat.toLowerCase();
                          setSfxCategory(sfxSlug);
                          sfxCategoryRef.current = sfxSlug;
                          fetchResults(submittedQuery, "sfx", defaultFilters, { sfxCategory: sfxSlug });
                        } else if (activeCategory === "music") {
                          setMusicTag(cat.toLowerCase());
                          musicTagRef.current = cat.toLowerCase();
                          fetchResults(cat, activeCategory, defaultFilters);
                        } else {
                          fetchResults(cat, activeCategory, defaultFilters);
                        }
                      }
                    }}
                    className="flex h-8 shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg px-4 text-xs font-medium transition-colors"
                    style={{
                      background: activeBrowseTab === cat ? "var(--selected)" : "transparent",
                      color: activeBrowseTab === cat ? "var(--surface-foreground-0)" : "var(--surface-foreground-2)",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </>
            ) : null}
          </div>

          {/* Search results */}
          {(searchResults !== null || isLoading) && (
              <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between" style={{ display: "none" }}>
                <h2 className="text-base font-medium text-fg">
                  {isLoading ? "Searching…" : submittedQuery ? `Results for "${submittedQuery}"` : "Browse"}
                </h2>
                {!isLoading && searchResults && (
                  <span className="text-xs text-fg/40">{searchResults.length} assets</span>
                )}
              </div>
              {isLoading ? (
                activeCategory === "music" || activeCategory === "sfx" ? (
                  <div className="flex flex-col gap-1">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-[80px] animate-pulse rounded-xl"
                        style={{ background: "var(--surface-border-alpha-0)" }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="columns-4 gap-3">
                    {[0.67, 1.33, 1, 0.75, 1.6, 0.67, 1, 1.33, 0.75, 1, 1.6, 0.67].map((ratio, i) => (
                      <div
                        key={i}
                        className="mb-3 animate-pulse rounded-xl"
                        style={{ aspectRatio: ratio, background: "var(--surface-border-alpha-0)" }}
                      />
                    ))}
                  </div>
                )
              ) : searchResults && searchResults.length > 0 ? (
                activeCategory === "music" || activeCategory === "sfx" ? (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                    {searchResults.map((item) => (
                      <AudioRow
                        key={item.id}
                        item={item}
                        isPlaying={playingId === item.id}
                        onTogglePlay={() => handleTogglePlay(item)}
                        audioRef={audioRef}
                      />
                    ))}
                  </div>
                ) : (
                <div className="columns-4 gap-3">
                  {searchResults.map((item) => {
                    const imgUrl = item.image?.source?.url ?? item.preview?.url;
                    if (!imgUrl) return null;
                    const ratio = parseAspectRatio(item.image?.source?.size);
                    return (
                      <button
                        key={`${item.type ?? "img"}-${item.id}`}
                        type="button"
                        className="group relative mb-3 block w-full cursor-pointer overflow-hidden rounded-xl"
                        style={ratio ? { aspectRatio: ratio } : undefined}
                        onMouseEnter={(e) => {
                          if (activeCategory === "mixed") return;
                          const v = e.currentTarget.querySelector("video");
                          v?.play();
                        }}
                        onMouseLeave={(e) => {
                          if (activeCategory === "mixed") return;
                          const v = e.currentTarget.querySelector("video");
                          if (v) { v.pause(); v.currentTime = 0; }
                        }}
                      >
                        <div
                          className="absolute inset-0"
                          style={{ background: "var(--surface-border-alpha-0)" }}
                        />
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
                            autoPlay={activeCategory === "mixed"}
                            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${activeCategory === "mixed" ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                          />
                        )}
                        <div className="absolute inset-0 rounded-xl bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

                        {/* Top row actions */}
                        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <div className="size-6 shrink-0 rounded-full border-2 border-white/15" />
                          <div className="flex items-center gap-1.5">
                            {[DotsThree, Trash, DownloadSimple, Heart].map((Icon, i) => (
                              <div key={i} role="button" tabIndex={0} className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20" onClick={(e) => e.stopPropagation()}>
                                <Icon weight="bold" size={15} />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bottom row actions */}
                        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          {item.duration && (
                            <span className="rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">{item.duration}</span>
                          )}
                          <div className="ml-auto flex items-center gap-1.5">
                            <div role="button" tabIndex={0} className="flex h-8 cursor-pointer items-center gap-0.5 rounded-full bg-white px-3 text-[12px] font-medium text-[#0d0d0d] transition-colors hover:bg-white/90" onClick={(e) => e.stopPropagation()}>
                              Use
                              <CaretDown weight="bold" size={10} />
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                )
              ) : (
                <p className="py-8 text-center text-sm text-fg/40">{submittedQuery ? `No results found for "${submittedQuery}"` : "No results found"}</p>
              )}
            </div>
          )}


        </div>
      </div>
    </main>
  );
}

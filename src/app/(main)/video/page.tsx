"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Tooltip } from "@/components/Tooltip";
import { AssetPanel } from "@/components/AssetPanel";
import { ProjectFolderBreadcrumb } from "@/components/ProjectFolderBreadcrumb";
import { useTool } from "@/contexts/ToolContext";
import { usePalette } from "@/contexts/PaletteContext";
import {
  VideoCamera,
  Sparkle,
  CaretDown,
  MagnifyingGlass,
  Layout,
  BookmarkSimple,
  Aperture,
  FrameCorners,
  X,
  Star,
  User,
  Images,
  Plus,
  SquaresFour,
  FilmStrip,
  ArrowsOut,
  PenNib,
  Headphones,
  Smiley,
  Microphone,
} from "@phosphor-icons/react";
import { AllToolsPanel } from "@/components/sidebar-panels/AllToolsPanel";
import { AssistantButton } from "@/components/AssistantButton";
import { AvatarWithProgress } from "@/components/AvatarWithProgress";
import { FreepikButton } from "@/components/FreepikButton";
import { GenerateSaveToast } from "@/components/GenerateSaveToast";

const referenceSlots = [
  { id: "add", label: "Add", icon: Plus },
  { id: "style", label: "Style", icon: Star },
  { id: "character", label: "Character", icon: User },
  { id: "stock", label: "Stock", icon: Images },
];

const videoTools = [
  { id: "video-generator", label: "Video Generator", icon: VideoCamera, desc: "Create videos from text prompts" },
  { id: "clip-editor", label: "Clip Editor", icon: FilmStrip, desc: "Trim, cut, and edit video clips" },
  { id: "video-upscaler", label: "Video Upscaler", icon: ArrowsOut, desc: "Enhance video resolution" },
  { id: "video-project-editor", label: "Video Project Editor", icon: PenNib, desc: "Edit multi-clip video projects" },
  { id: "lip-sync", label: "Lip Sync", icon: Headphones, desc: "Sync lip movements to audio" },
  { id: "video-face-swap", label: "Video Face Swap", icon: Smiley, desc: "Swap faces in video content" },
  { id: "speak", label: "Speak", icon: Microphone, desc: "Generate speech for video" },
];


export default function VideoPage() {
  const [promptText, setPromptText] = useState("");
  const { activeToolId, setActiveToolId, setActiveToolLabel, showToolsPanel, setShowToolsPanel } = useTool();
  const { colors: paletteColors, ctaColor, ctaTextColor, surfaceColors: sc } = usePalette();
  const videoToolIds = videoTools.map((t) => t.id);
  useEffect(() => {
    if (!videoToolIds.includes(activeToolId)) {
      setActiveToolId("video-generator");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [saveToast, setSaveToast] = useState(false);
  const [templateMenuOpen, setTemplateMenuOpen] = useState(false);
  const [templateMenuPos, setTemplateMenuPos] = useState<{ top: number; left: number } | null>(null);
  const templateBtnRef = useRef<HTMLButtonElement>(null);
  const templateMenuTimeout = useRef<NodeJS.Timeout | null>(null);

  const openTemplateMenu = useCallback(() => {
    if (templateMenuTimeout.current) clearTimeout(templateMenuTimeout.current);
    const el = templateBtnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setTemplateMenuPos({ top: rect.top, left: rect.right + 8 });
    setTemplateMenuOpen(true);
  }, []);

  const closeTemplateMenu = useCallback(() => {
    templateMenuTimeout.current = setTimeout(() => setTemplateMenuOpen(false), 150);
  }, []);

  const cancelCloseTemplateMenu = useCallback(() => {
    if (templateMenuTimeout.current) clearTimeout(templateMenuTimeout.current);
  }, []);

  const activeTool = videoTools.find((t) => t.id === activeToolId) ?? videoTools[0];

  useEffect(() => {
    setActiveToolLabel(activeTool.label);
  }, [activeTool.label, setActiveToolLabel]);

  return (
    <main
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl"
      style={{ background: "var(--surface-modal)" }}
    >
      <header className="flex h-[60px] shrink-0 items-center px-6">
        <div className="flex flex-1 items-center">
          <Breadcrumb />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <ProjectFolderBreadcrumb />
        </div>
        <div className="flex flex-1 items-center justify-end gap-3">
          <FreepikButton />
          <AssistantButton />
          <AvatarWithProgress />
        </div>
      </header>

      <div className="flex min-h-0 flex-1 gap-1 px-1 pb-1">
        <div
          className="flex w-[330px] shrink-0 flex-col gap-4 overflow-y-auto rounded-2xl py-4"
          style={{ background: sc.panel }}
        >
          {showToolsPanel ? (
            <AllToolsPanel initialTab="video" onClose={() => setShowToolsPanel(false)} />
          ) : (
          <div key="controls" className="flex flex-col gap-4 px-4">
            {/* Tool selector */}
            <div
              className="flex min-h-[72px] items-stretch gap-2 rounded-xl p-1.5"
              style={{
                background: paletteColors.video.bg,
              }}
            >
              <button
                type="button"
                onClick={() => setShowToolsPanel(true)}
                className="flex flex-1 cursor-pointer flex-col justify-center gap-0.5 rounded-lg px-3 pb-1 pt-2 text-left transition-colors hover:bg-fg/5"
              >
                <span className="flex items-center gap-1 text-xs font-medium text-fg/50"><SquaresFour weight="bold" size={14} />Tools</span>
                <span className="text-sm font-medium text-fg">{activeTool.label}</span>
              </button>
              <button
                ref={templateBtnRef}
                type="button"
                onMouseEnter={openTemplateMenu}
                onMouseLeave={closeTemplateMenu}
                className="flex w-[72px] cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg bg-fg/5 transition-colors hover:bg-fg/10"
              >
                <div className="relative size-[18px]">
                  <Layout
                    weight="regular"
                    size={18}
                    className="absolute inset-0 text-fg/50 transition-all duration-300 ease-in-out"
                    style={{
                      opacity: promptText.length > 0 ? 0 : 1,
                      transform: promptText.length > 0 ? "scale(0.5) rotate(-90deg)" : "scale(1) rotate(0deg)",
                    }}
                  />
                  <BookmarkSimple
                    weight="regular"
                    size={18}
                    className="absolute inset-0 text-fg/50 transition-all duration-300 ease-in-out"
                    style={{
                      opacity: promptText.length > 0 ? 1 : 0,
                      transform: promptText.length > 0 ? "scale(1) rotate(0deg)" : "scale(0.5) rotate(90deg)",
                    }}
                  />
                </div>
                <span className="relative h-[12px] overflow-hidden">
                  <span
                    className="block text-[10px] font-medium text-fg/50 transition-all duration-300 ease-in-out"
                    style={{
                      transform: promptText.length > 0 ? "translateY(-100%)" : "translateY(0)",
                      opacity: promptText.length > 0 ? 0 : 1,
                    }}
                  >
                    Templates
                  </span>
                  <span
                    className="block text-[10px] font-medium text-fg/50 transition-all duration-300 ease-in-out"
                    style={{
                      transform: promptText.length > 0 ? "translateY(-100%)" : "translateY(0)",
                      opacity: promptText.length > 0 ? 1 : 0,
                    }}
                  >
                    Save
                  </span>
                </span>
              </button>
            </div>

            {/* Model selector */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-medium tracking-[0.2px] text-fg/50 uppercase">
                Model
              </span>
              <button
                type="button"
                className="flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg px-4 text-sm font-medium text-fg transition-all hover:brightness-110"
                style={{ background: sc.button }}
              >
                <VideoCamera weight="bold" size={20} className="shrink-0" />
                <span className="flex-1 text-left">Kling v2</span>
                <CaretDown weight="bold" size={14} className="opacity-50" />
              </button>
            </div>

            {/* References */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-medium tracking-[0.2px] text-fg/50 uppercase">
                References
              </span>
              <div className="flex gap-2.5">
                {referenceSlots.map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    type="button"
                    className="flex aspect-square flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg transition-all hover:brightness-110"
                    style={{ background: sc.button }}
                  >
                    <Icon weight="regular" size={17} className="text-fg-muted" />
                    <span className="text-[10px] text-fg-muted">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-medium tracking-[0.2px] text-fg/50 uppercase">
                Prompt
              </span>
              <div
                className="flex flex-col gap-2.5 rounded-lg border px-3 py-2"
                style={{
                  background: sc.card,
                  borderColor: "var(--surface-border-alpha-1)",
                }}
              >
                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Describe your video and reference by using @"
                  className="min-h-[140px] w-full resize-none bg-transparent text-sm text-fg outline-none placeholder:text-fg/50"
                />
                <div className="flex items-center justify-end">
                  <div className="flex items-center gap-2 opacity-50">
                    <button type="button" className="flex size-6 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-fg/10">
                      <Aperture weight="bold" size={16} className="text-fg" />
                    </button>
                    <button type="button" className="flex size-6 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-fg/10">
                      <FrameCorners weight="bold" size={16} className="text-fg" />
                    </button>
                    <button type="button" className="flex size-6 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-fg/10">
                      <X weight="bold" size={14} className="text-fg" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings row */}
            <div className="flex gap-[7px]">
              {[
                { icon: VideoCamera, label: "1x" },
                { icon: FrameCorners, label: "16:9" },
                { icon: Sparkle, label: "1080p" },
              ].map(({ icon: Icon, label }, i) => (
                <button
                  key={i}
                  type="button"
                  className="flex h-8 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg text-xs font-medium text-fg transition-all hover:brightness-110"
                  style={{ background: sc.button }}
                >
                  <Icon weight="bold" size={16} />
                  {label}
                </button>
              ))}
            </div>

            {/* Generate button */}
            <button
              type="button"
              onClick={() => { setSaveToast(true); setTimeout(() => setSaveToast(false), 3000); }}
              className="flex h-10 w-full cursor-pointer items-center justify-between rounded-[8px] px-4 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: ctaColor, color: ctaTextColor }}
            >
              Generate
              <Sparkle weight="fill" size={20} />
            </button>
            <GenerateSaveToast visible={saveToast} />
          </div>
          )}
        </div>

        <AssetPanel />
      </div>

      {templateMenuOpen && createPortal(
        <div
          className="fixed z-[9999]"
          style={{
            top: templateMenuPos?.top,
            left: templateMenuPos?.left,
          }}
          onMouseEnter={cancelCloseTemplateMenu}
          onMouseLeave={closeTemplateMenu}
        >
          <div className="rounded-lg border border-white/10 bg-[#1a1a1a] p-1 shadow-xl">
            <button type="button" className="flex w-full cursor-pointer items-center gap-2 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs text-fg/80 transition-colors hover:bg-white/10 hover:text-fg">
              <Layout weight="regular" size={14} className="shrink-0" />
              Browse templates
            </button>
            <button type="button" className="flex w-full cursor-pointer items-center gap-2 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs text-fg/80 transition-colors hover:bg-white/10 hover:text-fg">
              <BookmarkSimple weight="regular" size={14} className="shrink-0" />
              Save template
            </button>
            <button type="button" className="flex w-full cursor-pointer items-center gap-2 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs text-fg/80 transition-colors hover:bg-white/10 hover:text-fg">
              <X weight="regular" size={14} className="shrink-0" />
              Reset
            </button>
          </div>
        </div>,
        document.body,
      )}
    </main>
  );
}

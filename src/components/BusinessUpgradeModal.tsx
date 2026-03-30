"use client";

import { useEffect } from "react";
import { X, Users, FolderSimple, ChartBar, ArrowRight } from "@phosphor-icons/react";

interface BusinessUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const benefits = [
  {
    icon: Users,
    title: "Collaborate in real time",
    desc: "Invite your team and work together on shared projects and spaces.",
  },
  {
    icon: FolderSimple,
    title: "Shared assets & folders",
    desc: "Keep everything organized in one place your whole team can access.",
  },
  {
    icon: ChartBar,
    title: "Usage & activity tracking",
    desc: "See who's doing what and how resources are being used.",
  },
];

export function BusinessUpgradeModal({ isOpen, onClose }: BusinessUpgradeModalProps) {
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
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative flex w-full flex-col overflow-hidden"
        style={{
          maxWidth: 520,
          background: "#171717",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          className="absolute right-4 top-4 z-10 flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/10"
          onClick={onClose}
          aria-label="Close"
        >
          <X weight="regular" size={16} style={{ color: "#999" }} />
        </button>

        {/* Hero gradient strip */}
        <div className="relative flex h-[140px] items-center justify-center overflow-hidden" style={{ background: "linear-gradient(135deg, #1e293b 0%, #312e81 40%, #4c1d95 70%, #1e1b4b 100%)" }}>
          <svg className="absolute inset-0 size-full opacity-20" viewBox="0 0 520 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="260" cy="70" r="200" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
            <circle cx="260" cy="70" r="140" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <circle cx="260" cy="70" r="80" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          </svg>
          {/* Floating avatars */}
          <div className="relative flex items-center">
            {[
              { letter: "A", bg: "#4F69F2", x: -52, y: -8 },
              { letter: "M", bg: "#8566DC", x: -20, y: 12 },
              { letter: "J", bg: "#FF58AE", x: 12, y: -14 },
              { letter: "S", bg: "#17CB8D", x: 44, y: 6 },
            ].map((a, i) => (
              <div
                key={i}
                className="absolute flex size-10 items-center justify-center rounded-full text-sm font-semibold text-white ring-2 ring-black/20"
                style={{ background: a.bg, left: a.x, top: a.y, boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
              >
                {a.letter}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6 px-8 pt-7 pb-8">
          {/* Badge + Title */}
          <div className="flex flex-col gap-3">
            <span className="inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider" style={{ background: "rgba(139,92,246,0.15)", color: "#a78bfa" }}>
              Business
            </span>
            <h2 className="text-[22px] font-semibold leading-[1.3] tracking-[-0.3px]" style={{ color: "#f5f5f5" }}>
              Unlock team collaboration
            </h2>
            <p className="text-[14px] leading-[1.6]" style={{ color: "#888" }}>
              Shared projects require a Business plan. Upgrade to work together with your team.
            </p>
          </div>

          {/* Benefits */}
          <div className="flex flex-col gap-4">
            {benefits.map((b) => (
              <div key={b.title} className="flex items-start gap-3.5">
                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <b.icon weight="regular" size={18} style={{ color: "#a78bfa" }} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] font-medium" style={{ color: "#e5e5e5" }}>{b.title}</span>
                  <span className="text-[12px] leading-[1.5]" style={{ color: "#777" }}>{b.desc}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col gap-3 pt-1">
            <button
              type="button"
              className="group flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg text-[14px] font-semibold transition-all hover:brightness-110"
              style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)", color: "#fff" }}
              onClick={onClose}
            >
              Upgrade to Business
              <ArrowRight weight="bold" size={14} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              type="button"
              className="flex h-9 w-full cursor-pointer items-center justify-center rounded-lg text-[13px] font-medium transition-colors hover:bg-white/5"
              style={{ color: "#777" }}
              onClick={onClose}
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

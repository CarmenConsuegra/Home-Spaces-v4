"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Users, Lock } from "@phosphor-icons/react";
import { useFolder } from "@/contexts/FolderContext";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_COLORS = [
  "#f59e0b",
  "#8b5cf6",
  "#3b82f6",
  "#ec4899",
  "#f97316",
  "#22c55e",
  "#14b8a6",
  "#e11d48",
  "#6366f1",
  "#84cc16",
];

function randomColor() {
  return PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];
}

export function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
  const [name, setName] = useState("");
  const [access, setAccess] = useState<"shared" | "private">("shared");
  const [namingConvention, setNamingConvention] = useState(false);
  const { addProject } = useFolder();
  const router = useRouter();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setName("");
      setAccess("shared");
      setNamingConvention(false);
    }
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll
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

  const handleCreate = useCallback(() => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const color = randomColor();
    addProject(trimmed, color);
    const slug = trimmed.toLowerCase().replace(/\s+/g, "-");
    onClose();
    router.push(`/projects/${slug}`);
  }, [name, addProject, onClose, router]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0, 0, 0, 0.7)" }}
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-[480px] flex-col overflow-hidden"
        style={{
          background: "var(--surface-modal)",
          borderRadius: "16px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <div className="flex items-center justify-center px-6 pt-6 pb-5">
          <h2
            className="text-[24px] font-semibold"
            style={{ color: "#f5f5f5" }}
          >
            New Project
          </h2>
        </div>

        {/* Project name section */}
        <div className="flex items-start gap-4 px-6 pb-5">
          {/* Cover image placeholder */}
          <div
            className="size-16 shrink-0 overflow-hidden rounded-lg"
            style={{
              background:
                "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
            }}
          />
          {/* Name input */}
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <label
              className="text-[14px] font-semibold"
              style={{ color: "#f5f5f5" }}
            >
              Project name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
              }}
              placeholder="Enter a name for your project"
              className="h-10 w-full rounded-lg border bg-transparent px-3 text-[14px] outline-none transition-colors focus:border-[#336aea]"
              style={{
                borderColor: "rgba(255,255,255,0.15)",
                color: "#f5f5f5",
              }}
              autoFocus
            />
          </div>
        </div>

        {/* Access section */}
        <div className="flex flex-col gap-3 px-6 pb-5">
          <span
            className="text-[16px] font-semibold"
            style={{ color: "#f5f5f5" }}
          >
            Access
          </span>

          {/* Shared option */}
          <button
            type="button"
            onClick={() => setAccess("shared")}
            className="flex items-center gap-3 rounded-lg border-2 p-3 text-left transition-colors"
            style={{
              borderColor:
                access === "shared" ? "#336aea" : "rgba(255,255,255,0.1)",
              background: "transparent",
            }}
          >
            <div
              className="flex size-8 shrink-0 items-center justify-center rounded-full"
              style={{
                background:
                  access === "shared"
                    ? "rgba(51,106,234,0.15)"
                    : "rgba(255,255,255,0.08)",
              }}
            >
              <Users
                weight="fill"
                size={16}
                style={{
                  color: access === "shared" ? "#336aea" : "#737373",
                }}
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <span
                className="text-[12px] font-semibold"
                style={{ color: "#f5f5f5" }}
              >
                Shared
              </span>
              <span className="text-[12px]" style={{ color: "#aaa" }}>
                Only users from your organization can access
              </span>
            </div>
          </button>

          {/* Private option */}
          <button
            type="button"
            onClick={() => setAccess("private")}
            className="flex items-center gap-3 rounded-lg border-2 p-3 text-left transition-colors"
            style={{
              borderColor:
                access === "private" ? "#336aea" : "rgba(255,255,255,0.1)",
              background: "transparent",
            }}
          >
            <div
              className="flex size-8 shrink-0 items-center justify-center rounded-full"
              style={{
                background:
                  access === "private"
                    ? "rgba(51,106,234,0.15)"
                    : "rgba(255,255,255,0.08)",
              }}
            >
              <Lock
                weight="fill"
                size={16}
                style={{
                  color: access === "private" ? "#336aea" : "#737373",
                }}
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <span
                className="text-[12px] font-semibold"
                style={{ color: "#f5f5f5" }}
              >
                Private
              </span>
              <span className="text-[12px]" style={{ color: "#aaa" }}>
                Only you will have access
              </span>
            </div>
          </button>
        </div>

        {/* Custom naming convention toggle */}
        <div className="flex items-center justify-between px-6 pb-6">
          <span
            className="text-[14px] font-medium"
            style={{ color: "#f5f5f5" }}
          >
            Custom Naming convention
          </span>
          <button
            type="button"
            onClick={() => setNamingConvention((v) => !v)}
            className="relative h-5 w-9 shrink-0 rounded-full transition-colors"
            style={{
              background: namingConvention ? "#336aea" : "rgba(255,255,255,0.15)",
            }}
          >
            <span
              className="absolute top-0.5 size-4 rounded-full bg-white transition-transform"
              style={{
                left: namingConvention ? "18px" : "2px",
              }}
            />
          </button>
        </div>

        {/* Bottom buttons */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg border px-5 text-[14px] font-medium transition-colors hover:bg-white/5"
            style={{
              borderColor: "rgba(255,255,255,0.2)",
              color: "#f5f5f5",
              background: "transparent",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={!name.trim()}
            className="h-10 rounded-lg px-5 text-[14px] font-medium text-white transition-colors hover:opacity-90 disabled:opacity-40"
            style={{
              background: "#336aea",
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

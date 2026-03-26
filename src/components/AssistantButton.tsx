"use client";

import { Sparkle } from "@phosphor-icons/react";
import { useAssistantPanel } from "@/contexts/AssistantPanelContext";

export function AssistantButton() {
  const { toggle, isOpen } = useAssistantPanel();
  return (
    <button
      type="button"
      onClick={toggle}
      className="flex size-8 items-center justify-center rounded-full transition-all duration-300 hover:bg-white/90"
      style={{
        background: isOpen ? "rgba(255,255,255,0.15)" : "white",
        color: isOpen ? "white" : "black",
        opacity: isOpen ? 0.15 : 1,
      }}
    >
      <Sparkle weight="fill" size={20} />
    </button>
  );
}

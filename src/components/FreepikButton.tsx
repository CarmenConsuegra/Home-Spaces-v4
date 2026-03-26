"use client";

import { UsersThree } from "@phosphor-icons/react";
import { usePalette } from "@/contexts/PaletteContext";

export function FreepikButton() {
  const { ctaColor } = usePalette();
  return (
    <button
      type="button"
      className="hidden flex h-8 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm font-medium text-fg/70 transition-colors hover:bg-fg/5 hover:text-fg"
    >
      <UsersThree size={15} />
      Freepik Team
      <span className="overflow-hidden [animation:badgeExpand_1.4s_cubic-bezier(0.34,1.56,0.64,1)_1.5s_both]" style={{ display: "flex" }}>
        <span className="flex h-4 min-w-4 items-center justify-center rounded-sm px-1 text-[9px] font-bold text-white" style={{ background: ctaColor }}>3</span>
      </span>
    </button>
  );
}

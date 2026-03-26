"use client";

import { useSpotlight } from "@/contexts/SpotlightContext";
import { useAssistantPanel } from "@/contexts/AssistantPanelContext";
import { SidebarWrapper } from "@/components/SidebarWrapper";
import { PageContentTransition } from "@/components/PageContentTransition";
import { AssistantPanel } from "@/components/AssistantPanel";

export function ContentWrapper({ children }: { children: React.ReactNode }) {
  const spotlight = useSpotlight();
  const { isOpen, isExpanded } = useAssistantPanel();

  return (
    <div className="flex min-h-0 flex-1 gap-2 overflow-hidden">
      <SidebarWrapper />
      <div
        className="relative min-h-0 flex-1 overflow-hidden"
        style={{
          paddingRight: isOpen && !isExpanded ? 508 : 0,
          transition: "padding-right 300ms ease-in-out",
        }}
      >
        <PageContentTransition className="flex min-h-0 min-w-0 h-full w-full overflow-hidden">
          {children}
        </PageContentTransition>
        <AssistantPanel />
      </div>
    </div>
  );
}

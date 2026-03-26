"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ToolContextType = {
  activeToolLabel: string;
  setActiveToolLabel: (label: string) => void;
  activeToolId: string;
  setActiveToolId: (id: string) => void;
  showToolsPanel: boolean;
  setShowToolsPanel: (show: boolean) => void;
  toggleToolsPanel: () => void;
  pinnedTools: Set<string>;
  togglePinTool: (id: string) => void;
  showAllToolsPanel: boolean;
  allToolsTab: string;
  openAllToolsPanel: (tab: string) => void;
  closeAllToolsPanel: () => void;
};

const ToolContext = createContext<ToolContextType | undefined>(undefined);

export function ToolProvider({ children }: { children: ReactNode }) {
  const [activeToolLabel, setActiveToolLabel] = useState("Image generator");
  const [activeToolId, setActiveToolId] = useState("image-generator");
  const [showToolsPanel, setShowToolsPanel] = useState(false);
  const toggleToolsPanel = useCallback(() => setShowToolsPanel((v) => !v), []);
  const [pinnedTools, setPinnedTools] = useState<Set<string>>(new Set(["image-generator"]));
  const [showAllToolsPanel, setShowAllToolsPanel] = useState(false);
  const [allToolsTab, setAllToolsTab] = useState("image");

  const togglePinTool = useCallback((id: string) => {
    setPinnedTools((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const openAllToolsPanel = useCallback((tab: string) => {
    setAllToolsTab(tab);
    setShowAllToolsPanel(true);
  }, []);

  const closeAllToolsPanel = useCallback(() => {
    setShowAllToolsPanel(false);
  }, []);

  return (
    <ToolContext.Provider value={{
      activeToolLabel, setActiveToolLabel,
      activeToolId, setActiveToolId,
      showToolsPanel, setShowToolsPanel, toggleToolsPanel,
      pinnedTools, togglePinTool,
      showAllToolsPanel, allToolsTab, openAllToolsPanel, closeAllToolsPanel,
    }}>
      {children}
    </ToolContext.Provider>
  );
}

export function useTool() {
  const context = useContext(ToolContext);
  if (context === undefined) {
    throw new Error("useTool must be used within a ToolProvider");
  }
  return context;
}

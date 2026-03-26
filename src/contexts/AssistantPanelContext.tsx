"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type AssistantPanelContextValue = {
  isOpen: boolean;
  isExpanded: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  toggleExpanded: () => void;
};

const AssistantPanelContext = createContext<AssistantPanelContextValue | null>(null);

export function AssistantPanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => { setIsOpen(false); setIsExpanded(false); }, []);
  const toggle = useCallback(() => setIsOpen((prev) => { if (prev) setIsExpanded(false); return !prev; }), []);
  const toggleExpanded = useCallback(() => setIsExpanded((prev) => !prev), []);

  return (
    <AssistantPanelContext.Provider value={{ isOpen, isExpanded, open, close, toggle, toggleExpanded }}>
      {children}
    </AssistantPanelContext.Provider>
  );
}

export function useAssistantPanel() {
  const ctx = useContext(AssistantPanelContext);
  if (!ctx) throw new Error("useAssistantPanel must be used within AssistantPanelProvider");
  return ctx;
}

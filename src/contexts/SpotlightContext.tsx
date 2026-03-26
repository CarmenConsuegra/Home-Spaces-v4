"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { SpotlightSearch } from "@/components/SpotlightSearch";

type SpotlightContextValue = {
  isOpen: boolean;
  open: (initialQuery?: string) => void;
  close: () => void;
  toggle: () => void;
  initialQuery: string;
};

const SpotlightContext = createContext<SpotlightContextValue | null>(null);

export function SpotlightProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState("");

  const open = useCallback((query?: string) => {
    setInitialQuery(query ?? "");
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        open();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <SpotlightContext.Provider value={{ isOpen, open, close, toggle, initialQuery }}>
      {children}
      <SpotlightSearch isOpen={isOpen} onClose={close} initialQuery={initialQuery} />
    </SpotlightContext.Provider>
  );
}

export function useSpotlight(): SpotlightContextValue | null {
  return useContext(SpotlightContext);
}

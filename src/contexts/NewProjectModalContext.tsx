"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { NewProjectModal } from "@/components/NewProjectModal";

type NewProjectModalContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const NewProjectModalContext = createContext<NewProjectModalContextValue | null>(null);

export function NewProjectModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <NewProjectModalContext.Provider value={{ isOpen, open, close }}>
      {children}
      <NewProjectModal isOpen={isOpen} onClose={close} />
    </NewProjectModalContext.Provider>
  );
}

export function useNewProjectModal(): NewProjectModalContextValue | null {
  return useContext(NewProjectModalContext);
}

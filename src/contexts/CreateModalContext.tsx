"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { CreateModal } from "@/components/CreateModal";

type CreateModalContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const CreateModalContext = createContext<CreateModalContextValue | null>(null);

export function CreateModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <CreateModalContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
      <CreateModal isOpen={isOpen} onClose={close} />
    </CreateModalContext.Provider>
  );
}

export function useCreateModal(): CreateModalContextValue | null {
  return useContext(CreateModalContext);
}

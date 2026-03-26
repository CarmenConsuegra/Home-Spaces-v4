"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AssetsFilterContextType {
  selectedProject: string;
  setSelectedProject: (project: string) => void;
  selectedOwner: string;
  setSelectedOwner: (owner: string) => void;
  favoritesOnly: boolean;
  setFavoritesOnly: (favoritesOnly: boolean) => void;
  activeContentType: string | null;
  setActiveContentType: (type: string | null) => void;
}

const AssetsFilterContext = createContext<AssetsFilterContextType | null>(null);

export function AssetsFilterProvider({ children }: { children: ReactNode }) {
  const [selectedProject, setSelectedProject] = useState("All");
  const [selectedOwner, setSelectedOwner] = useState("Anyone");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [activeContentType, setActiveContentType] = useState<string | null>(null);

  return (
    <AssetsFilterContext.Provider
      value={{
        selectedProject,
        setSelectedProject,
        selectedOwner,
        setSelectedOwner,
        favoritesOnly,
        setFavoritesOnly,
        activeContentType,
        setActiveContentType,
      }}
    >
      {children}
    </AssetsFilterContext.Provider>
  );
}

export function useAssetsFilter() {
  const context = useContext(AssetsFilterContext);
  if (!context) {
    throw new Error("useAssetsFilter must be used within an AssetsFilterProvider");
  }
  return context;
}

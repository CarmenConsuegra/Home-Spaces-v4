"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Folder = { name: string; assetCount?: number; children?: Folder[] };

export type TeamMember = {
  initials: string;
  color: string;
};

export type Project = {
  name: string;
  color: string;
  cover?: string;
  folders: Folder[];
  isTeam?: boolean;
  isPrivate?: boolean;
  teamMembers?: TeamMember[];
  owner?: string;
};

const initialProjects: Project[] = [
  {
    name: "Personal",
    color: "#f59e0b",
    cover: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
    isPrivate: true,
    owner: "Alvaro Castañeda",
    folders: [
      { name: "Scenes", assetCount: 2, children: [
        { name: "Photos", assetCount: 2 },
        { name: "Videos", assetCount: 1 },
        { name: "Social ads", assetCount: 1 },
      ]},
      { name: "Documents", assetCount: 2 },
    ],
  },
  {
    name: "Product Shots",
    color: "#8b5cf6",
    cover: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop",
    isPrivate: true,
    owner: "Martin LeBlanc",
    folders: [
      { name: "Hero images", assetCount: 3 },
      { name: "Lifestyle", assetCount: 2 },
      { name: "Packshots", assetCount: 3 },
    ],
  },
  {
    name: "Nike Campaign",
    color: "#3b82f6",
    cover: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=200&h=200&fit=crop",
    isPrivate: false,
    isTeam: true,
    owner: "Adrián Fernández",
    teamMembers: [
      { initials: "J", color: "#22c55e" },
      { initials: "M", color: "#22c55e" },
    ],
    folders: [
      { name: "Retouched", assetCount: 3 },
      { name: "Finals", assetCount: 2 },
      { name: "Characters", assetCount: 2 },
      { name: "Backgrounds", assetCount: 2 },
    ],
  },
  {
    name: "Lifestyle",
    color: "#ec4899",
    cover: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=200&h=200&fit=crop",
    isPrivate: true,
    owner: "Leandro Bos",
    folders: [
      { name: "Interior", assetCount: 3 },
      { name: "Exterior", assetCount: 2 },
      { name: "Products", assetCount: 3 },
    ],
  },
  {
    name: "Road Trip",
    color: "#f97316",
    cover: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200&h=200&fit=crop",
    isPrivate: false,
    isTeam: true,
    owner: "Alvaro Castañeda",
    teamMembers: [
      { initials: "S", color: "#ec4899" },
      { initials: "T", color: "#3b82f6" },
    ],
    folders: [
      { name: "Day 1", assetCount: 2 },
      { name: "Day 2", assetCount: 3 },
      { name: "Day 3", assetCount: 2 },
      { name: "Favorites", assetCount: 2 },
    ],
  },
];

// Export for components that need to read the list
export const getInitialProjects = () => initialProjects;

type FolderContextType = {
  projects: Project[];
  highlightedFolderKey: string | null;
  setHighlightedFolderKey: (key: string | null) => void;
  activeProject: Project;
  activeFolder: string;
  selectProject: (project: Project, folder?: string) => void;
  selectFolder: (name: string) => void;
  addFolder: (projectName: string, parentPath: string | null, folderName: string) => void;
  renameFolder: (projectName: string, folderPath: string, newName: string) => void;
  addProject: (name: string, color: string, cover?: string) => void;
};

const FolderContext = createContext<FolderContextType | undefined>(undefined);

// Helper to deep clone projects
const cloneProjects = (projects: Project[]): Project[] => 
  JSON.parse(JSON.stringify(projects));

// Helper to find and modify a folder at a given path
const addFolderAtPath = (
  folders: Folder[],
  pathParts: string[],
  newFolder: Folder
): Folder[] => {
  if (pathParts.length === 0) {
    return [...folders, newFolder];
  }

  const [current, ...rest] = pathParts;
  return folders.map(folder => {
    if (folder.name === current) {
      if (rest.length === 0) {
        return {
          ...folder,
          children: folder.children ? [...folder.children, newFolder] : [newFolder],
        };
      } else {
        return {
          ...folder,
          children: folder.children 
            ? addFolderAtPath(folder.children, rest, newFolder) 
            : [],
        };
      }
    }
    return folder;
  });
};

// Helper to rename a folder at a given path
const renameFolderAtPath = (
  folders: Folder[],
  pathParts: string[],
  newName: string
): Folder[] => {
  if (pathParts.length === 0) return folders;

  const [current, ...rest] = pathParts;
  return folders.map(folder => {
    if (folder.name === current) {
      if (rest.length === 0) {
        return { ...folder, name: newName };
      } else {
        return {
          ...folder,
          children: folder.children ? renameFolderAtPath(folder.children, rest, newName) : folder.children,
        };
      }
    }
    return folder;
  });
};

export function FolderProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [highlightedFolderKey, setHighlightedFolderKey] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<Project>(initialProjects[0]);
  const [activeFolder, setActiveFolder] = useState(initialProjects[0].folders[0]?.name ?? "");

  const selectProject = useCallback((project: Project, folder?: string) => {
    setActiveProject(project);
    // If folder is explicitly provided (including empty string), use it
    // Otherwise keep the current folder if it exists in the new project, or default to empty (project root)
    if (folder !== undefined) {
      setActiveFolder(folder);
    } else {
      setActiveFolder("");
    }
  }, []);

  const selectFolder = useCallback((name: string) => {
    setActiveFolder(name);
  }, []);

  const addFolder = useCallback((projectName: string, parentPath: string | null, folderName: string) => {
    setProjects(prev => {
      const newProjects = cloneProjects(prev);
      const projectIndex = newProjects.findIndex(p => p.name === projectName);
      if (projectIndex === -1) return prev;

      const newFolder: Folder = { name: folderName, assetCount: 0 };
      
      if (parentPath === null) {
        newProjects[projectIndex].folders = [...newProjects[projectIndex].folders, newFolder];
      } else {
        const pathParts = parentPath.split("/").filter(Boolean);
        newProjects[projectIndex].folders = addFolderAtPath(
          newProjects[projectIndex].folders,
          pathParts,
          newFolder
        );
      }

      return newProjects;
    });
  }, []);

  const renameFolder = useCallback((projectName: string, folderPath: string, newName: string) => {
    setProjects(prev => {
      const newProjects = cloneProjects(prev);
      const projectIndex = newProjects.findIndex(p => p.name === projectName);
      if (projectIndex === -1) return prev;

      const pathParts = folderPath.split("/").filter(Boolean);
      newProjects[projectIndex].folders = renameFolderAtPath(
        newProjects[projectIndex].folders,
        pathParts,
        newName
      );

      return newProjects;
    });

    setActiveFolder(prev => {
      const pathParts = folderPath.split("/").filter(Boolean);
      const oldName = pathParts[pathParts.length - 1];
      if (prev === oldName) return newName;
      return prev;
    });
  }, []);

  const addProject = useCallback((name: string, color: string, cover?: string) => {
    const newProject: Project = {
      name,
      color,
      cover,
      folders: [],
    };
    setProjects(prev => [...prev, newProject]);
  }, []);

  const syncedActiveProject = projects.find(p => p.name === activeProject.name) || activeProject;

  return (
    <FolderContext.Provider value={{
      projects,
      highlightedFolderKey,
      setHighlightedFolderKey,
      activeProject: syncedActiveProject,
      activeFolder,
      selectProject,
      selectFolder,
      addFolder,
      renameFolder,
      addProject,
    }}>
      {children}
    </FolderContext.Provider>
  );
}

export function useFolder() {
  const context = useContext(FolderContext);
  if (context === undefined) {
    throw new Error("useFolder must be used within a FolderProvider");
  }
  return context;
}

// Legacy export for backward compatibility
export const projects = initialProjects;

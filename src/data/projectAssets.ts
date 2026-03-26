// Shared project assets data - used across the app for consistency
// This maps projects and their folders to specific asset numbers

export const projectPathMap: Record<string, string> = {
  "Personal": "personal",
  "Product Shots": "product-shots",
  "Nike Campaign": "nike-campaign",
  "Lifestyle": "lifestyle",
  "Road Trip": "road-trip",
};

// Asset distribution per project folder
// Each project has assets distributed across its folders
// Empty string key ("") represents the project root level
export const projectFolderAssets: Record<string, Record<string, number[]>> = {
  "Personal": {
    "": [1, 2], // Root level assets
    "Scenes": [3, 4],
    "Photos": [5, 6], // Child of Scenes
    "Videos": [7], // Child of Scenes
    "Social ads": [8], // Child of Scenes
    "Documents": [9, 10],
  },
  "Product Shots": {
    "": [1, 2], // Root level
    "Hero images": [3, 4, 5],
    "Lifestyle": [6, 7],
    "Packshots": [8, 9, 10],
  },
  "Nike Campaign": {
    "": [1], // Root level
    "Retouched": [2, 3, 4],
    "Finals": [5, 6],
    "Characters": [7, 8],
    "Backgrounds": [9, 10],
  },
  "Lifestyle": {
    "": [1, 2], // Root level
    "Interior": [3, 4, 5],
    "Exterior": [6, 7],
    "Products": [8, 9, 10],
  },
  "Road Trip": {
    "": [1], // Root level
    "Day 1": [2, 3],
    "Day 2": [4, 5, 6],
    "Day 3": [7, 8],
    "Favorites": [9, 10],
  },
};

// Favorite asset IDs per project (for visual indicators)
export const favoriteAssetIndices: Record<string, number[]> = {
  "personal": [1, 6],      // assets 2 and 7 (0-indexed: 1, 6)
  "product-shots": [2, 7], // assets 3 and 8
  "nike-campaign": [0, 5], // assets 1 and 6
  "lifestyle": [3, 8],     // assets 4 and 9
  "road-trip": [1, 4],     // assets 2 and 5
};

// Uploaded asset indices per project (user-uploaded originals)
export const uploadedAssetIndices: Record<string, number[]> = {
  "personal": [2, 7],      // assets 3 and 8
  "product-shots": [0, 4], // assets 1 and 5
  "nike-campaign": [3, 8], // assets 4 and 9
  "lifestyle": [1, 5],     // assets 2 and 6
  "road-trip": [0, 6],     // assets 1 and 7
};

// Generate assets based on selected project and folder
export function getProjectAssets(projectName: string, folderName?: string) {
  const projectPath = projectPathMap[projectName];
  
  if (!projectPath) {
    // Return all projects' assets if no specific project selected
    return Object.entries(projectPathMap).flatMap(([name, path]) => {
      const folderAssets = projectFolderAssets[name];
      if (folderAssets) {
        const allAssetNums = Object.values(folderAssets).flat();
        const uniqueAssetNums = [...new Set(allAssetNums)].sort((a, b) => a - b);
        return uniqueAssetNums.map((assetNum) => ({
          id: `${path}-${assetNum}`,
          src: `/projects/${path}/asset-${String(assetNum).padStart(2, "0")}.jpg`,
          folder: "",
          projectName: name,
          projectPath: path,
        }));
      }
      return [];
    });
  }
  
  const folderAssets = projectFolderAssets[projectName];
  
  // If a specific folder is selected (non-empty string), return only assets from that folder
  if (folderName !== undefined && folderName !== "" && folderAssets) {
    const assetsForFolder = folderAssets[folderName];
    
    if (assetsForFolder) {
      return assetsForFolder.map((assetNum) => ({
        id: `${projectPath}-${assetNum}`,
        src: `/projects/${projectPath}/asset-${String(assetNum).padStart(2, "0")}.jpg`,
        folder: folderName,
        projectName,
        projectPath,
      }));
    }
    // Folder requested but not found - return empty array
    return [];
  }
  
  // If no folder selected (project root or empty string), return all assets from the project
  if (folderAssets) {
    const allAssetNums = Object.values(folderAssets).flat();
    const uniqueAssetNums = [...new Set(allAssetNums)].sort((a, b) => a - b);
    return uniqueAssetNums.map((assetNum) => ({
      id: `${projectPath}-${assetNum}`,
      src: `/projects/${projectPath}/asset-${String(assetNum).padStart(2, "0")}.jpg`,
      folder: "",
      projectName,
      projectPath,
    }));
  }
  
  // Fallback to all 10 assets
  return Array.from({ length: 10 }, (_, i) => ({
    id: `${projectPath}-${i}`,
    src: `/projects/${projectPath}/asset-${String(i + 1).padStart(2, "0")}.jpg`,
    folder: "",
    projectName,
    projectPath,
  }));
}

// Get folder thumbnails (first 4 assets from a folder)
export function getFolderThumbnails(projectName: string, folderName: string): string[] {
  const projectPath = projectPathMap[projectName];
  const folderAssets = projectFolderAssets[projectName];
  
  if (!projectPath || !folderAssets || !folderAssets[folderName]) {
    return [];
  }
  
  return folderAssets[folderName].slice(0, 4).map(
    (assetNum) => `/projects/${projectPath}/asset-${String(assetNum).padStart(2, "0")}.jpg`
  );
}

// Get asset count for a folder
export function getFolderAssetCount(projectName: string, folderName: string): number {
  const folderAssets = projectFolderAssets[projectName];
  if (!folderAssets || !folderAssets[folderName]) {
    return 0;
  }
  return folderAssets[folderName].length;
}

// Check if an asset is a favorite
export function isAssetFavorite(projectPath: string, assetIndex: number): boolean {
  const favorites = favoriteAssetIndices[projectPath];
  return favorites ? favorites.includes(assetIndex) : false;
}

// Check if an asset is an upload
export function isAssetUploaded(projectPath: string, assetIndex: number): boolean {
  const uploads = uploadedAssetIndices[projectPath];
  return uploads ? uploads.includes(assetIndex) : false;
}

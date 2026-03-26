// Shared spaces data used across all-assets and spaces pages

export type Space = {
  id: string;
  projectId: string;
  projectName: string;
  owner: string;
  name: string;
  editedAt: string;
  thumbnails: string[];
  isFavorite?: boolean;
};

// All spaces from all 5 projects
export const allSpaces: Space[] = [
  // Personal project spaces
  { id: "personal-space1", projectId: "personal", projectName: "Personal", owner: "Alvaro Castañeda", name: "Portrait Series", editedAt: "12 days ago", isFavorite: true, thumbnails: ["/projects/personal/asset-01.jpg", "/projects/personal/asset-02.jpg", "/projects/personal/asset-03.jpg"] },
  { id: "personal-space2", projectId: "personal", projectName: "Personal", owner: "Alvaro Castañeda", name: "Artistic Shots", editedAt: "12 days ago", thumbnails: ["/projects/personal/asset-04.jpg"] },
  // Product Shots project spaces
  { id: "product-space1", projectId: "product-shots", projectName: "Product Shots", owner: "Martin LeBlanc", name: "Product Gallery", editedAt: "5 days ago", thumbnails: ["/projects/product-shots/asset-01.jpg", "/projects/product-shots/asset-02.jpg", "/projects/product-shots/asset-03.jpg"] },
  // Nike Campaign project spaces
  { id: "nike-space1", projectId: "nike-campaign", projectName: "Nike Campaign", owner: "Adrián Fernández", name: "Sneaker Hero", editedAt: "12 days ago", thumbnails: ["/projects/nike-campaign/asset-01.jpg", "/projects/nike-campaign/asset-02.jpg", "/projects/nike-campaign/asset-03.jpg"] },
  { id: "nike-space2", projectId: "nike-campaign", projectName: "Nike Campaign", owner: "Martin LeBlanc", name: "Action Shots", editedAt: "12 days ago", thumbnails: ["/projects/nike-campaign/asset-04.jpg"] },
  { id: "nike-space3", projectId: "nike-campaign", projectName: "Nike Campaign", owner: "Adrián Fernández", name: "Lifestyle", editedAt: "23 days ago", thumbnails: ["/projects/nike-campaign/asset-05.jpg", "/projects/nike-campaign/asset-06.jpg", "/projects/nike-campaign/asset-07.jpg"] },
  // Lifestyle project spaces
  { id: "lifestyle-space1", projectId: "lifestyle", projectName: "Lifestyle", owner: "Leandro Bos", name: "Interior Mood", editedAt: "8 days ago", thumbnails: ["/projects/lifestyle/asset-01.jpg", "/projects/lifestyle/asset-02.jpg"] },
  // Road Trip project spaces
  { id: "roadtrip-space1", projectId: "road-trip", projectName: "Road Trip", owner: "Alvaro Castañeda", name: "Best Shots", editedAt: "3 days ago", isFavorite: true, thumbnails: ["/projects/road-trip/asset-01.jpg", "/projects/road-trip/asset-02.jpg", "/projects/road-trip/asset-03.jpg"] },
  { id: "roadtrip-space2", projectId: "road-trip", projectName: "Road Trip", owner: "Leandro Bos", name: "Landscapes", editedAt: "3 days ago", thumbnails: ["/projects/road-trip/asset-04.jpg", "/projects/road-trip/asset-05.jpg"] },
];

import { Wish } from "@/components/WishGallery";

const STORAGE_KEY = "digital-wishbook-wishes";

/**
 * Converts a File to a base64 data URL
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Converts a base64 data URL back to a Blob URL for display
 */
export function base64ToBlobUrl(dataUrl: string): string {
  // If it's already a blob URL, return as is
  if (dataUrl.startsWith("blob:")) {
    return dataUrl;
  }
  // For base64 data URLs, we can use them directly
  return dataUrl;
}

/**
 * Saves wishes to localStorage
 */
export function saveWishesToStorage(wishes: Wish[]): void {
  try {
    const serialized = JSON.stringify(wishes);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error("Failed to save wishes to localStorage:", error);
    // localStorage might be full or unavailable
  }
}

/**
 * Loads wishes from localStorage
 */
export function loadWishesFromStorage(): Wish[] {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) {
      return [];
    }
    const wishes = JSON.parse(serialized) as Wish[];
    // Validate that we got an array
    if (!Array.isArray(wishes)) {
      return [];
    }
    return wishes;
  } catch (error) {
    console.error("Failed to load wishes from localStorage:", error);
    return [];
  }
}

/**
 * Clears all wishes from localStorage
 */
export function clearWishesFromStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear wishes from localStorage:", error);
  }
}

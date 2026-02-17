import { useEffect } from "react";
import ItemsData, { PrizeImages } from "@/data/itemData";

/**
 * Preloads an array of image URLs into the browser cache.
 * Uses the Image() constructor which fetches and caches
 * images without adding them to the DOM.
 */
function preloadImages(urls: string[]) {
  urls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
}

export function useImagePreloader(spriteName: string = "link") {
  // Item images
  useEffect(() => {
    const itemUrls: string[] = [];
    for (const item of Object.values(ItemsData)) {
      itemUrls.push(...item.images);
    }
    itemUrls.push(...Object.values(PrizeImages));
    preloadImages(itemUrls);
  }, []);

  // Sprite variants
  useEffect(() => {
    const spriteUrls: string[] = [];
    for (const bunny of ["", "bunny"]) {
      for (const tunic of [1, 2, 3]) {
        spriteUrls.push(`/sprites/${spriteName}_tunic${bunny}${tunic}.png`);
      }
    }
    preloadImages(spriteUrls);
  }, [spriteName]);
}

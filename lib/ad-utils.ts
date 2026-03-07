import type { Ad } from "@/lib/supabase/ad-types";

/**
 * Selects up to 3 ads for a given context (category or post).
 * Priority: category-specific ads first, then 'all' ads to fill remaining slots.
 * Distributed evenly so all ads get exposure.
 */
export function selectAdsForContext(ads: Ad[], category?: string): Ad[] {
  const categoryAds = category
    ? ads.filter((a) => a.category.toLowerCase() === category.toLowerCase())
    : [];
  const globalAds = ads.filter((a) => a.category === "all");

  // Shuffle for even distribution
  const shuffled = (arr: Ad[]) => [...arr].sort(() => Math.random() - 0.5);

  const picked: Ad[] = [];

  // Fill with category-specific first
  for (const ad of shuffled(categoryAds)) {
    if (picked.length >= 3) break;
    picked.push(ad);
  }

  // Fill remaining slots with global ads
  for (const ad of shuffled(globalAds)) {
    if (picked.length >= 3) break;
    if (!picked.find((p) => p.id === ad.id)) picked.push(ad);
  }

  return picked;
}
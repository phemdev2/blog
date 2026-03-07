"use client";

import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Ad } from "@/lib/supabase/ad-types";

interface AdBannerProps {
  ads: Ad[];
}

export function AdBanner({ ads }: AdBannerProps) {
  const supabase = createClient();

  async function handleClick(ad: Ad) {
    await supabase.rpc("increment_ad_clicks", { ad_id: ad.id });
    window.open(ad.target_url, "_blank", "noopener,noreferrer");
  }

  const slots = [0, 1, 2].map((i) => ads[i] ?? null);

  return (
    <div className="mb-8">
      <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Advertisement</p>
      <div className="grid grid-cols-3 gap-3">
        {slots.map((ad, i) =>
          ad ? (
            <button
              key={ad.id}
              onClick={() => handleClick(ad)}
              className="relative w-full aspect-4/1 rounded-lg overflow-hidden border border-gray-200 hover:opacity-90 hover:shadow-md transition-all cursor-pointer"
              aria-label="Advertisement"
            >
              <Image
                src={ad.image_url}
                alt="Advertisement"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </button>
          ) : (
            <a
              key={`placeholder-${i}`}
              href="/advertise"
              className="relative w-full aspect-4/1 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-1 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <p className="text-xs font-medium text-gray-400">Your Ad Here</p>
              <p className="text-xs text-gray-300">Advertise with us</p>
            </a>
          )
        )}
      </div>
    </div>
  );
}
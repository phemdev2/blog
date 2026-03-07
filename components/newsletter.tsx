"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const supabase = createClient();

  async function handleSubscribe() {
    if (!email.trim()) return;
    setStatus("loading");

    const { error } = await supabase
      .from("subscribers")
      .insert({ email });

    if (error) {
      setStatus(error.code === "23505" ? "success" : "error");
    } else {
      setStatus("success");
      setEmail("");
    }
  }

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center">
      <h3 className="text-xl font-bold text-gray-900 mb-2">Stay in the loop</h3>
      <p className="text-gray-600 text-sm mb-6">
        Get the latest articles delivered straight to your inbox.
      </p>

      {status === "success" ? (
        <p className="text-green-600 font-medium text-sm">
          ✓ You're subscribed! Thanks for joining.
        </p>
      ) : (
        <div className="flex gap-2 max-w-sm mx-auto">
          <input
            id="newsletter-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSubscribe}
            disabled={status === "loading" || !email.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {status === "loading" ? "..." : "Subscribe"}
          </button>
        </div>
      )}

      {status === "error" && (
        <p className="text-red-500 text-xs mt-2">Something went wrong. Try again.</p>
      )}
    </div>
  );
}
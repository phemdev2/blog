import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Publishes any scheduled posts whose scheduled_at time has passed.
 * Call this from dashboard or public pages as a free-tier alternative to pg_cron.
 */
export async function publishScheduledPosts() {
  try {
    const supabase = await createServerSupabaseClient();
    await supabase
      .from("posts")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
      })
      .eq("status", "scheduled")
      .lte("scheduled_at", new Date().toISOString());
  } catch {
    // Silent fail — non-critical background task
  }
}
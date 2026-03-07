import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function SubscribersPage() {
  const supabase = await createServerSupabaseClient();
  const { data: subscribers } = await supabase
    .from("subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-8">
        Subscribers <span className="text-gray-500 text-lg font-normal">({subscribers?.length ?? 0})</span>
      </h1>

      <div className="border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900">
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Email</th>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {(subscribers ?? []).map((sub) => (
              <tr key={sub.id} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                <td className="px-6 py-4 text-white">{sub.email}</td>
                <td className="px-6 py-4 text-gray-400">
                  {new Date(sub.subscribed_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {(!subscribers || subscribers.length === 0) && (
              <tr>
                <td colSpan={2} className="px-6 py-12 text-center text-gray-500">
                  No subscribers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
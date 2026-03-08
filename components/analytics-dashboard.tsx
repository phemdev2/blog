"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Link from "next/link";
import { Eye, FileText, Users, MessageSquare } from "lucide-react";

interface Post {
  id: string;
  title: string;
  views: number;
  category?: string;
  published_at: string;
}

interface Props {
  stats: {
    posts: number;
    subscribers: number;
    comments: number;
    totalViews: number;
  };
  topPosts: Post[];
  recentPosts: Post[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
  });
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white shadow-lg">
        <p className="text-gray-400 mb-1">{label}</p>
        <p className="font-semibold">{payload[0].value} views</p>
      </div>
    );
  }
  return null;
};

export function AnalyticsDashboard({ stats, topPosts, recentPosts }: Props) {
  const statCards = [
    { label: "Total Posts", value: stats.posts, icon: FileText, color: "text-blue-400" },
    { label: "Total Views", value: stats.totalViews, icon: Eye, color: "text-emerald-400" },
    { label: "Subscribers", value: stats.subscribers, icon: Users, color: "text-purple-400" },
    { label: "Comments", value: stats.comments, icon: MessageSquare, color: "text-amber-400" },
  ];

  // Chart data: recent 10 posts by published date
  const chartData = [...recentPosts]
    .reverse()
    .slice(-10)
    .map((p) => ({
      name: formatDate(p.published_at),
      views: p.views ?? 0,
      title: p.title,
    }));

  const maxViews = Math.max(...topPosts.map((p) => p.views ?? 0), 1);

  return (
    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
      <h1 className="text-xl sm:text-2xl font-bold text-white">Overview</h1>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-5 flex flex-col gap-3"
          >
            <div className={`${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white">{value.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Views chart ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
        <h2 className="text-sm font-semibold text-white mb-1">Views by Post</h2>
        <p className="text-xs text-gray-500 mb-5">Last 10 published posts</p>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "#6b7280", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#1f2937" }} />
              <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-gray-600 text-sm">
            No data yet
          </div>
        )}
      </div>

      {/* ── Top posts ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-white">Top Posts</h2>
            <p className="text-xs text-gray-500 mt-0.5">By total views</p>
          </div>
          <Link
            href="/dashboard/posts"
            className="text-xs text-blue-500 hover:text-blue-400 transition-colors"
          >
            View all →
          </Link>
        </div>

        {topPosts.length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-8">No posts yet.</p>
        ) : (
          <div className="space-y-4">
            {topPosts.map((post, i) => {
              const pct = Math.round(((post.views ?? 0) / maxViews) * 100);
              return (
                <div key={post.id}>
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-start gap-2 min-w-0">
                      <span className="text-xs text-gray-600 w-4 flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm text-white font-medium truncate leading-snug">
                          {post.title}
                        </p>
                        {post.category && (
                          <span className="text-xs text-gray-500">{post.category}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 text-xs text-gray-400">
                      <Eye className="h-3 w-3" />
                      <span>{(post.views ?? 0).toLocaleString()}</span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="ml-6 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
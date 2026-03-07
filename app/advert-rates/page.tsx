import { Layout } from "@/components/Layout";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { siteConfig } from "@/content/config";
import type { Post } from "@/types/types";
import Link from "next/link";

export const metadata = {
  title: "Estimated Advert Rates",
  description: "Campaign advertising rates for each section.",
};

const CPM_RATES: Record<string, number> = {
  "home page": 5000,
  business: 4000,
  technology: 4000,
  politics: 3500,
  design: 3000,
  lifestyle: 2500,
  default: 2000,
};

function getCPM(category: string): number {
  return CPM_RATES[category.toLowerCase()] ?? CPM_RATES.default;
}

function calcRates(totalViews: number, cpm: number) {
  const day = Math.round((totalViews / 1000) * cpm);
  const week = day * 7;
  const month = day * 30;
  return { day, week, month };
}

function fmt(n: number) {
  return `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function AdvertRatesPage() {
  const supabase = await createServerSupabaseClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("category, views")
    .returns<Pick<Post, "category" | "views">[]>();

  const allPosts = posts ?? [];
  const categories = Array.from(new Set(allPosts.map((p) => p.category)));

  const categoryStats = categories.map((cat) => {
    const catPosts = allPosts.filter((p) => p.category === cat);
    const totalViews = catPosts.reduce((sum, p) => sum + (p.views ?? 0), 0);
    const postCount = catPosts.length;
    const cpm = getCPM(cat);
    return { category: cat, totalViews, postCount, cpm };
  }).sort((a, b) => b.totalViews - a.totalViews);

  const totalViews = allPosts.reduce((sum, p) => sum + (p.views ?? 0), 0);
  const homeCPM = getCPM("home page");
  const homeRates = calcRates(totalViews, homeCPM);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">

        {/* Hero Header */}
        <div className="bg-gray-900 rounded-2xl px-8 py-10 mb-10 text-white">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Advertising</p>
          <h1 className="text-4xl font-bold mb-3">Estimated Advert Rates</h1>
          <p className="text-gray-400 text-sm max-w-lg">
            Reach your target audience on {siteConfig.title}. Rates are based on CPM
            (Cost Per 1,000 Views) and update automatically with traffic.
          </p>
          <div className="flex items-center gap-6 mt-6 text-sm">
            <Link href="/advertise" className="bg-white text-gray-900 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              How To Advertise
            </Link>
            <span className="text-gray-400">Minimum spend: ₦5,000</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total Views", value: totalViews.toLocaleString() },
            { label: "Total Posts", value: allPosts.length.toLocaleString() },
            { label: "Categories", value: categories.length.toLocaleString() },
          ].map((stat) => (
            <div key={stat.label} className="border border-gray-200 rounded-xl px-6 py-5 text-center">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Home Page Highlight */}
        <div className="border-2 border-gray-900 rounded-2xl p-6 mb-6 bg-gray-50">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-900 bg-yellow-300 px-2 py-0.5 rounded">
                  Most Popular
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Home Page</h2>
              <p className="text-sm text-gray-500 mt-1">
                {totalViews.toLocaleString()} total views · CPM: {fmt(homeCPM)}
              </p>
            </div>
            <div className="flex items-center gap-6 text-right">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Daily</p>
                <p className="text-lg font-bold text-gray-900">{fmt(homeRates.day)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Weekly</p>
                <p className="text-lg font-bold text-gray-900">{fmt(homeRates.week)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Monthly</p>
                <p className="text-lg font-bold text-gray-900">{fmt(homeRates.month)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Rates Table */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden mb-10">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Section Rates</h2>
            <span className="text-xs text-gray-400 uppercase tracking-widest">By Popularity</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-white">
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Section</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">CPM Rate</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Views</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Daily Est.</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Weekly Est.</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Monthly Est.</th>
              </tr>
            </thead>
            <tbody>
              {categoryStats.map(({ category, totalViews: views, postCount, cpm }, index) => {
                const r = calcRates(views, cpm);
                return (
                  <tr
                    key={category}
                    className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/blog?category=${category.toLowerCase()}`}
                        className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {category}
                      </Link>
                      <span className="ml-2 text-xs text-gray-400">{postCount} posts</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-700 font-semibold text-xs px-2 py-1 rounded-full">
                        {fmt(cpm)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{views.toLocaleString()}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{fmt(r.day)}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{fmt(r.week)}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{fmt(r.month)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Notes */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          {[
            { title: "How Billing Works", body: "Billing takes place after payment. You get detailed reports on unique clicks, views, and charges for each ad and section over various time periods." },
            { title: "Approval Process", body: "Ads are reviewed before going live. Deceptive, illegal, or morally questionable ads will not be approved. Most ads are reviewed within 24 hours." },
            { title: "CPM Explained", body: "CPM means you pay per 1,000 impressions. As traffic grows, your ad reaches more people at the same rate — making it a great long-term investment." },
            { title: "Minimum Spend", body: "We accept a minimum payment of ₦5,000. Credits can be used across any section including the home page, giving you full flexibility." },
          ].map((item) => (
            <div key={item.title} className="border border-gray-200 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center border border-gray-200 rounded-2xl py-10 px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to advertise?</h2>
          <p className="text-gray-500 text-sm mb-6">
            Contact us to get started. We'll walk you through the process.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/advertise"
              className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Get Started
            </Link>
            <a
              href={`mailto:ads@${siteConfig.url.replace("https://", "")}`}
              className="border border-gray-200 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>

      </div>
    </Layout>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, PlusCircle, Users, Mail, Megaphone } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/posts", label: "Posts", icon: FileText },
  { href: "/dashboard/posts/new", label: "New Post", icon: PlusCircle },
  { href: "/dashboard/ads", label: "Ads", icon: Megaphone },
  { href: "/dashboard/subscribers", label: "Subscribers", icon: Mail },
  { href: "/dashboard/comments", label: "Comments", icon: Users },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <>
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              active
                ? "bg-white text-gray-950 font-medium"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </>
  );
}
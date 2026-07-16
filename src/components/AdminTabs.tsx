// FILE LOCATION: src/components/AdminTabs.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "Questions" },
  { href: "/admin/users", label: "Users" },
];

export default function AdminTabs() {
  const pathname = usePathname();

  return (
    <nav className="mt-5 flex gap-6 text-sm font-medium">
      {TABS.map((tab) => {
        const active = tab.href === "/admin" ? pathname === "/admin" || pathname.startsWith("/admin/questions") : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`border-b-2 pb-3 transition-colors ${
              active
                ? "border-accent text-foreground"
                : "border-transparent text-muted hover:border-line hover:text-foreground"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
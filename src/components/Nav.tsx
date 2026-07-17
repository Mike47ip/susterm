// FILE LOCATION: src/components/Nav.tsx (replaces existing file)

import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import NavLinks from "@/components/NavLinks";

export default async function Nav() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/90 backdrop-blur-sm">
      <div className="relative mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="tabnum rounded bg-foreground px-1.5 py-0.5 text-[10px] font-semibold text-white">
            Q&amp;A
          </span>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Susterm
          </span>
        </Link>
        <NavLinks user={user} />
      </div>
    </header>
  );
}
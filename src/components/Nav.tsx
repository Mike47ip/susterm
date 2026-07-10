import Link from "next/link";

export default function Nav() {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="tabnum rounded bg-foreground px-1.5 py-0.5 text-[10px] font-semibold text-white">
            Q&amp;A
          </span>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Sustained
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-muted">
          <Link href="/quiz" className="hover:text-accent transition-colors">
            Take Quiz
          </Link>
          <Link href="/admin" className="hover:text-accent transition-colors">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}

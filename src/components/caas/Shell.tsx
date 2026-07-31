"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_CUSTOMER = [
  { href: "/caas", label: "依頼" },
  { href: "/caas/project", label: "マイ工事" },
  { href: "/caas/sites", label: "拠点" },
];
const NAV_CRAFTSMAN = [
  { href: "/caas/craftsman", label: "スケジュール" },
  { href: "/caas/academy", label: "アカデミー" },
];

const isActive = (href: string, pathname: string) =>
  href === "/caas" ? pathname === "/caas" : pathname.startsWith(href);

const roleOf = (pathname: string): "customer" | "craftsman" =>
  pathname.startsWith("/caas/craftsman") || pathname.startsWith("/caas/academy")
    ? "craftsman"
    : "customer";

function RoleSwitch({ role }: { role: "customer" | "craftsman" }) {
  const router = useRouter();
  return (
    <div
      className="inline-flex rounded-[var(--radius-control)] bg-line-2 p-0.5"
      role="tablist"
      aria-label="表示モード"
    >
      {(
        [
          ["customer", "顧客", "/caas"],
          ["craftsman", "職人", "/caas/craftsman"],
        ] as const
      ).map(([key, label, href]) => (
        <button
          key={key}
          role="tab"
          aria-selected={role === key}
          onClick={() => router.push(href)}
          className={cn(
            "rounded-[6px] px-3 py-1.5 text-[12px] font-medium transition-colors",
            role === key
              ? "bg-surface text-ink shadow-[var(--shadow-e1)]"
              : "text-muted hover:text-ink",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Wordmark({ href }: { href: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5">
      <span className="grid size-7 place-items-center rounded-[7px] bg-brand text-[13px] font-bold text-brand-fg">
        S
      </span>
      <span className="leading-tight">
        <span className="block text-[14px] font-semibold tracking-tight text-ink">
          Safie Field Works
        </span>
        <span className="block text-[10px] tracking-wide text-subtle">
          Construction as a Service
        </span>
      </span>
    </Link>
  );
}

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const role = roleOf(pathname);
  const nav = role === "craftsman" ? NAV_CRAFTSMAN : NAV_CUSTOMER;
  const home = role === "craftsman" ? "/caas/craftsman" : "/caas";

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[240px_1fr]">
      {/* ── Desktop sidebar ── */}
      <aside className="sticky top-0 hidden h-dvh flex-col justify-between border-r border-line bg-surface px-5 py-6 lg:flex">
        <div>
          <Wordmark href={home} />
          <div className="mt-7">
            <RoleSwitch role={role} />
          </div>
          <nav className="mt-7 flex flex-col gap-0.5">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={isActive(n.href, pathname) ? "page" : undefined}
                className={cn(
                  "rounded-[var(--radius-control)] px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(n.href, pathname)
                    ? "bg-line-2 text-ink"
                    : "text-muted hover:bg-line-2/60 hover:text-ink",
                )}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="text-[11px] leading-relaxed text-subtle">
          セーフィーフィールドワークス
        </p>
      </aside>

      {/* ── Mobile top bar ── */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-canvas/85 px-4 py-3 backdrop-blur-md lg:hidden">
        <Wordmark href={home} />
        <RoleSwitch role={role} />
      </header>

      <main className="pb-20 lg:pb-0">{children}</main>

      {/* ── Mobile bottom tabs ── */}
      <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-surface/95 backdrop-blur-md lg:hidden">
        {nav.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            aria-current={isActive(n.href, pathname) ? "page" : undefined}
            className={cn(
              "tap flex flex-1 items-center justify-center text-[13px] transition-colors",
              isActive(n.href, pathname)
                ? "font-semibold text-ink"
                : "font-medium text-subtle",
            )}
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

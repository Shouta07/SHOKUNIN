"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "ホーム", icon: "🎬" },
  { href: "/diagnosis", label: "診断", icon: "⚔️" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-[var(--color-dq-border)] bg-[#0d1b3e]">
      <div className="mx-auto flex max-w-lg">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`touch-target flex flex-1 flex-col items-center justify-center py-2 text-xs transition-colors ${
                isActive
                  ? "text-[var(--color-accent)] font-bold"
                  : "text-[var(--color-text-muted)]"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

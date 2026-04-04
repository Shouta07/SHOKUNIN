"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "ホーム", icon: "🏠" },
  { href: "/estimates/new", label: "見積作成", icon: "📝" },
  { href: "/estimates", label: "見積一覧", icon: "📋" },
  { href: "/master", label: "単価", icon: "💰" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-lg">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`touch-target flex flex-1 flex-col items-center justify-center py-2 text-xs transition-colors ${
                isActive
                  ? "text-[var(--color-primary)] font-bold"
                  : "text-gray-500"
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

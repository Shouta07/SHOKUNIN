"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { C } from "@/lib/caas";

const NAV_CUSTOMER = [
  { href: "/caas", label: "依頼", icon: "🧰" },
  { href: "/caas/project", label: "マイ工事", icon: "📋" },
  { href: "/caas/sites", label: "拠点", icon: "🏢" },
];
const NAV_CRAFTSMAN = [
  { href: "/caas/craftsman", label: "スケジュール", icon: "🗺" },
  { href: "/caas/academy", label: "アカデミー", icon: "🎓" },
];

function isActive(href: string, pathname: string) {
  return href === "/caas" ? pathname === "/caas" : pathname.startsWith(href);
}
function roleOf(pathname: string): "customer" | "craftsman" {
  return pathname.startsWith("/caas/craftsman") || pathname.startsWith("/caas/academy") ? "craftsman" : "customer";
}

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const role = roleOf(pathname);
  const nav = role === "craftsman" ? NAV_CRAFTSMAN : NAV_CUSTOMER;

  const RoleToggle = () => (
    <div className="caas-role">
      <button className={role === "customer" ? "active" : ""} onClick={() => router.push("/caas")}>顧客</button>
      <button className={role === "craftsman" ? "active" : ""} onClick={() => router.push("/caas/craftsman")}>職人</button>
    </div>
  );

  return (
    <div className="caas-shell">
      {/* Desktop sidebar */}
      <aside className="caas-sidebar">
        <div>
          <Link href={role === "craftsman" ? "/caas/craftsman" : "/caas"} className="caas-logo">
            <span className="caas-logo-mark">C</span>
            <div>
              <div className="caas-logo-name">CaaS</div>
              <div className="caas-logo-sub">{role === "craftsman" ? "職人ポータル" : "Construction as a Service"}</div>
            </div>
          </Link>
          <div style={{ marginTop: "18px" }}><RoleToggle /></div>
          <nav className="caas-nav">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className={`caas-nav-link${isActive(n.href, pathname) ? " active" : ""}`}>
                <span className="caas-nav-icon">{n.icon}</span>
                <span>{n.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="caas-side-foot">工事を、頼みたくなる体験に。</div>
      </aside>

      {/* Mobile top bar */}
      <header className="caas-topbar">
        <Link href={role === "craftsman" ? "/caas/craftsman" : "/caas"} className="caas-topbar-brand">
          <span className="caas-logo-mark sm">C</span>
          <span>CaaS</span>
        </Link>
        <RoleToggle />
      </header>

      {/* Content */}
      <main className="caas-main">{children}</main>

      {/* Mobile bottom tabs */}
      <nav className="caas-tabbar">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className={`caas-tab${isActive(n.href, pathname) ? " active" : ""}`}>
            <span className="caas-tab-icon">{n.icon}</span>
            <span className="caas-tab-label">{n.label}</span>
          </Link>
        ))}
      </nav>

      <style>{`
        .caas-shell { min-height: 100dvh; background: ${C.bg}; font-family: ${SANS_CSS}; }

        .caas-main button { transition: transform 120ms ease, filter 120ms ease, background 200ms ease, border-color 200ms ease; }
        .caas-main button:not(:disabled):hover { filter: brightness(0.98); }
        .caas-main button:not(:disabled):active { transform: scale(0.985); }
        .caas-main a { transition: transform 120ms ease; }
        @media (hover: hover) { .caas-main a:hover { transform: translateY(-1px); } }

        .caas-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; color: ${C.ink}; padding: 4px; }
        .caas-logo-mark { width: 38px; height: 38px; border-radius: 11px; background: ${C.accent}; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 20px; flex-shrink: 0; }
        .caas-logo-mark.sm { width: 30px; height: 30px; border-radius: 9px; font-size: 16px; }
        .caas-logo-name { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; }
        .caas-logo-sub { font-size: 10px; color: ${C.faint}; margin-top: 1px; }

        /* role toggle */
        .caas-role { display: inline-flex; background: ${C.bg}; border: 1px solid ${C.line}; border-radius: 100px; padding: 3px; }
        .caas-role button { border: none; background: none; cursor: pointer; font-size: 12px; font-weight: 700; color: ${C.sub}; padding: 7px 16px; border-radius: 100px; font-family: ${SANS_CSS}; }
        .caas-role button.active { background: ${C.accent}; color: #fff; }

        .caas-nav { display: flex; flex-direction: column; gap: 4px; margin-top: 22px; }
        .caas-nav-link { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 12px; text-decoration: none; color: ${C.sub}; font-size: 14px; font-weight: 600; transition: all 160ms; }
        .caas-nav-link:hover { background: ${C.bg}; color: ${C.ink}; }
        .caas-nav-link.active { background: ${C.accentSoft}; color: ${C.accent}; }
        .caas-nav-icon { font-size: 18px; width: 22px; text-align: center; }
        .caas-side-foot { font-size: 11px; color: ${C.faint}; line-height: 1.7; }

        .caas-topbar { display: none; }
        .caas-topbar-brand { display: flex; align-items: center; gap: 9px; text-decoration: none; color: ${C.ink}; font-weight: 800; font-size: 16px; }

        .caas-tabbar { display: none; }
        .caas-tab { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 9px 0; text-decoration: none; color: ${C.faint}; transition: color 160ms; }
        .caas-tab.active { color: ${C.accent}; }
        .caas-tab-icon { font-size: 19px; }
        .caas-tab-label { font-size: 10px; font-weight: 600; }

        @media (min-width: 900px) {
          .caas-shell { display: grid; grid-template-columns: 252px 1fr; }
          .caas-sidebar { position: sticky; top: 0; height: 100dvh; display: flex; flex-direction: column; justify-content: space-between; padding: 26px 20px; border-right: 1px solid ${C.line}; background: ${C.surface}; }
          .caas-main { min-height: 100dvh; }
        }
        @media (max-width: 899px) {
          .caas-sidebar { display: none; }
          .caas-topbar { display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 40; padding: 11px 16px; background: rgba(245,247,250,0.85); backdrop-filter: blur(12px); border-bottom: 1px solid ${C.line}; }
          .caas-tabbar { display: flex; position: fixed; bottom: 0; left: 0; right: 0; z-index: 40; background: rgba(255,255,255,0.92); backdrop-filter: blur(12px); border-top: 1px solid ${C.line}; padding-bottom: env(safe-area-inset-bottom); }
          .caas-main { padding-bottom: 76px; }
        }
      `}</style>
    </div>
  );
}

const SANS_CSS = "'Inter','Hiragino Sans','Noto Sans JP',sans-serif";

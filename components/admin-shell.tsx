"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Upload, Images, BookImage, Settings, Menu } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/upload", label: "Upload", icon: Upload },
  { href: "/admin/photos", label: "Photos", icon: Images },
  { href: "/admin/albums", label: "Albums", icon: BookImage },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm"
        >
          <Menu className="h-4 w-4" />
          Menu
        </button>
      </div>
      <aside className={`${open ? "block" : "hidden"} rounded-2xl border border-white/10 bg-white/5 p-3 lg:block`}>
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-gradient-to-r from-[#ff0084] to-[#ff4fa8] text-white shadow-lg shadow-pink-500/20"
                    : "text-muted hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}

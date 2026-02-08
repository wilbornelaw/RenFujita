"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { logoutAction } from "@/app/auth-actions";
import { SearchModal } from "@/components/search-modal";

type Props = {
  isAuthenticated: boolean;
};

const navItems = [
  { href: "/features", label: "Features" },
  { href: "/groups", label: "Group" },
  { href: "/events", label: "Events" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About Us" },
  { href: "/albums", label: "Albums" },
];

export function Header({ isAuthenticated }: Props) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0d11]/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1400px] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Ren Fujita
        </Link>
        <nav className="hidden items-center gap-2 text-sm text-muted lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} className="relative rounded-lg px-3 py-2 transition hover:text-white">
                <span>{item.label}</span>
                {active && (
                  <motion.span
                    layoutId="header-underline"
                    className="absolute inset-x-2 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-[#ff0084] to-[#ff4fa8]"
                    transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 35 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <SearchModal isAdmin={isAuthenticated} />
          {isAuthenticated ? (
            <>
              <Link href="/admin" className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold hover:bg-white/10">
                Profile
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#ff0084] to-[#ff4fa8] px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition hover:brightness-110 active:scale-[0.98]"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-gradient-to-r from-[#ff0084] to-[#ff4fa8] px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition hover:brightness-110 active:scale-[0.98]"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

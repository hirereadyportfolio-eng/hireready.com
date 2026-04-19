"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/colleges", label: "For Colleges" },
  { href: "/companies", label: "For Companies" },
  { href: "/hackathons", label: "Hackathons" },
  { href: "/contact", label: "Contact" },
] as const;

import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 to-black/10 backdrop-blur-xl" />
        <div className="relative hr-container">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-white/5 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
                <div className="h-4 w-4 rounded bg-gradient-to-br from-[color:var(--color-accent-3)] to-[color:var(--color-accent)]" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-semibold tracking-tight">
                  HireReady
                </span>
                <span className="text-xs text-[color:var(--color-muted)]">
                  hackathons → hiring
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {links.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      "relative rounded-full px-4 py-2 text-sm transition-colors",
                      "text-white/80 hover:text-white",
                      active && "text-white"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-white/8 border border-white/10"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative">{l.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="hidden md:flex items-center gap-2">
              {!loading && (
                <>
                  {user ? (
                    <Link
                      href={user.role === "admin" ? "/admin" : "/dashboard"}
                      className="rounded-full px-4 py-2 text-sm font-medium border border-white/12 bg-white/6 hover:bg-white/10 transition-colors"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className="rounded-full px-4 py-2 text-sm font-medium border border-white/12 bg-white/6 hover:bg-white/10 transition-colors"
                    >
                      Log in
                    </Link>
                  )}
                  <Link
                    href={user ? "/dashboard/hackathons" : "/register"}
                    className="rounded-full px-4 py-2 text-sm font-semibold bg-gradient-to-r from-[color:var(--color-accent-2)] to-[color:var(--color-accent)] text-white shadow-[0_16px_55px_rgba(29,78,216,0.20)] hover:opacity-95 transition-opacity"
                  >
                    {user ? "Join Hackathon" : "Sign up free"}
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              className="md:hidden rounded-xl p-2 border border-white/12 bg-white/6"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {open && (
            <div className="md:hidden pb-4">
              <div className="hr-glass rounded-2xl p-2">
                {links.map((l) => {
                  const active = pathname === l.href;
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                    onClick={() => setOpen(false)}
                      className={cn(
                        "block rounded-xl px-4 py-3 text-sm transition-colors",
                        active
                          ? "bg-white/10 text-white"
                          : "text-white/80 hover:bg-white/8 hover:text-white"
                      )}
                    >
                      {l.label}
                    </Link>
                  );
                })}
                <div className="grid grid-cols-1 gap-2 p-2 pt-3">
                  {!loading && (
                    <>
                      {user ? (
                        <Link
                          href={user.role === "admin" ? "/admin" : "/dashboard"}
                          onClick={() => setOpen(false)}
                          className="rounded-xl px-4 py-3 text-sm font-medium border border-white/12 bg-white/6 hover:bg-white/10 transition-colors text-center"
                        >
                          Dashboard
                        </Link>
                      ) : (
                        <Link
                          href="/login"
                          onClick={() => setOpen(false)}
                          className="rounded-xl px-4 py-3 text-sm font-medium border border-white/12 bg-white/6 hover:bg-white/10 transition-colors text-center"
                        >
                          Log in
                        </Link>
                      )}
                      <Link
                        href={user ? "/dashboard/hackathons" : "/register"}
                        onClick={() => setOpen(false)}
                        className="rounded-xl px-4 py-3 text-sm font-semibold bg-gradient-to-r from-[color:var(--color-accent-2)] to-[color:var(--color-accent)] text-white text-center"
                      >
                        {user ? "Join Hackathon" : "Sign up free"}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


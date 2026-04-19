import Link from "next/link";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24">
      <div className="hr-container py-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2">
              <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-white/5 border border-white/10">
                <div className="h-4 w-4 rounded bg-gradient-to-br from-[color:var(--color-accent-3)] to-[color:var(--color-accent)]" />
              </div>
              <div className="font-semibold tracking-tight">HireReady</div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-6 text-[color:var(--color-muted)]">
              Hackathons that build careers. We help colleges run high-impact
              competitions and help companies discover top talent through real
              skill challenges.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                aria-label="Twitter"
                className="rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className="rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <Link
                href="/contact"
                aria-label="Email"
                className="rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition-colors"
              >
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
               <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Company</div>
               <div className="mt-4 grid gap-2 text-sm text-white/80">
                <Link className="hover:text-blue-400 transition-colors" href="/about">
                   About Us
                </Link>
                <Link className="hover:text-blue-400 transition-colors" href="/pricing">
                   Pricing
                </Link>
                <Link className="hover:text-blue-400 transition-colors" href="/contact">
                   Contact
                </Link>
               </div>
            </div>
            <div>
               <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Segments</div>
               <div className="mt-4 grid gap-2 text-sm text-white/80">
                <Link className="hover:text-blue-400 transition-colors" href="/colleges">
                   For Colleges
                </Link>
                <Link className="hover:text-blue-400 transition-colors" href="/companies">
                   For Companies
                </Link>
                <Link className="hover:text-blue-400 transition-colors" href="/hackathons">
                   All Tracks
                </Link>
               </div>
            </div>
            <div>
               <div className="text-[10px] font-black uppercase tracking-widest text-white/30">Legal</div>
               <div className="mt-4 grid gap-2 text-sm text-white/80">
                <Link className="hover:text-blue-400 transition-colors" href="/privacy">
                   Privacy
                </Link>
                <Link className="hover:text-blue-400 transition-colors" href="/terms">
                   Terms
                </Link>
                <button className="text-left hover:text-blue-400 transition-colors">
                   Cookie Policy
                </button>
               </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} HireReady. All rights reserved.</div>
          <div className="text-white/60">
            Built for Vercel deployment • Next.js + Tailwind + Framer Motion
          </div>
        </div>
      </div>
    </footer>
  );
}


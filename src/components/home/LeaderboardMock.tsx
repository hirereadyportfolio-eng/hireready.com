"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Trophy } from "lucide-react";

const people = [
  { name: "Aarav", score: 98, tag: "Full-stack" },
  { name: "Meera", score: 95, tag: "ML" },
  { name: "Ishaan", score: 92, tag: "Backend" },
  { name: "Zoya", score: 89, tag: "Frontend" },
] as const;

export function LeaderboardMock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="relative"
    >
      <div className="absolute -inset-6 rounded-[28px] bg-gradient-to-r from-[color:var(--color-accent-2)]/20 via-[color:var(--color-accent)]/18 to-[color:var(--color-accent-3)]/18 blur-2xl" />
      <Card className="relative overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-white">
              Live Leaderboard
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
              <Trophy className="h-3.5 w-3.5" />
              Finals
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {people.map((p, idx) => (
              <div
                key={p.name}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/8 border border-white/10 text-sm font-semibold">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {p.name}
                    </div>
                    <div className="text-xs text-[color:var(--color-muted)]">
                      {p.tag}
                    </div>
                  </div>
                </div>
                <div className="text-sm font-semibold text-white/90">
                  {p.score}
                  <span className="text-white/50">/100</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-gradient-to-r from-white/6 to-white/4 p-4">
            <div className="text-xs text-white/60">Recruiter view</div>
            <div className="mt-1 text-sm font-semibold text-white">
              Skill reports + project links auto-generated for top performers.
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_380px_at_18%_12%,rgba(34,211,238,0.18),transparent_50%),radial-gradient(900px_380px_at_82%_14%,rgba(124,58,237,0.18),transparent_50%)]" />
      </Card>
    </motion.div>
  );
}


"use client";

import { ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const DEFAULT_FAQS = [
  { q: "How do I register for a hackathon?", a: "Simply click the 'Join Hackathon' button on any active track. You'll need to create a profile and link your GitHub repository to be eligible for scoring." },
  { q: "Can I participate as a lone developer?", a: "Yes! While teamwork is encouraged, many of our top winners are individual builders. You can also use our Squad Center to find teammates." },
  { q: "What is the HireReady verification score?", a: "It's a proprietary metric that evaluates code quality, collaboration signal, and implementation speed. Top scores are shared with our hiring partners." },
  { q: "Is there a cost to participate?", a: "Participation is 100% free for students and developers. We partner with colleges and companies to sponsor the prize pools." }
];

export function FaqAccordion({
  items: userItems,
  className,
}: {
  items?: { q: string; a: string }[];
  className?: string;
}) {
  const items = useMemo(() => {
    return userItems && userItems.length > 0 ? userItems : DEFAULT_FAQS;
  }, [userItems]);

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (!items || items.length === 0) return null;

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((it, idx) => {
        const open = openIdx === idx;
        const question = it?.q || "FAQ Question";
        const answer = it?.a || "Information currently being updated. Please check back soon.";
        
        return (
          <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-all">
            <button
              type="button"
              className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left transition-colors"
              onClick={() => setOpenIdx(open ? null : idx)}
              aria-expanded={open}
            >
              <div className="text-sm md:text-base font-bold italic tracking-tight text-white/90">{question}</div>
              <motion.div
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0"
              >
                <ChevronDown className={cn("h-4 w-4 transition-colors", open ? "text-blue-400" : "text-white/30")} />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 text-sm leading-relaxed text-white/50 border-t border-white/5 pt-4 mt-1">
                    {answer}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

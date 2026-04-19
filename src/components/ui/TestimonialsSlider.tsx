"use client";

import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star, User } from "lucide-react";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { cn } from "@/lib/utils";

const DEFAULT_TESTIMONIALS = [
  {
    quote: "HireReady transformed our campus hackathon into a professional-grade engineering showcase. The automated scoring is a game changer.",
    name: "Dr. Aris Thorne",
    title: "Dean of Engineering, Stanford Tech",
    role: "Admin"
  },
  {
    quote: "I skipped the entire HR screening process because of my HireReady verified score. Currently building at Vercel thanks to the AI track.",
    name: "Leo Zhang",
    title: "Full Stack Engineer",
    role: "Participant"
  },
  {
    quote: "Sponsoring a challenge on HireReady gave us access to verified talent who could actually ship code. High signal, zero noise.",
    name: "Sarah Jenkins",
    title: "Talent Acquisition, Stripe",
    role: "Company"
  }
];

interface TestimonialItem {
  quote?: string;
  name?: string;
  title?: string;
  role?: string;
}

export function TestimonialsSlider({
  items: userItems,
}: {
  items?: TestimonialItem[];
}) {
  const items = useMemo(() => {
    const raw = userItems && userItems.length > 0 ? userItems : DEFAULT_TESTIMONIALS;
    return raw.map(item => ({
      quote: item.quote || "Amazing experience on HireReady. Highly recommended for all builders.",
      name: item.name || "Anonymous Builder",
      title: item.title || "Platform Participant",
      role: item.role || "Builder"
    }));
  }, [userItems]);

  const [idx, setIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Safety: Reset index if items change
  useEffect(() => {
    if (idx >= items.length) {
      setIdx(0);
    }
  }, [items.length, idx]);

  // Autoplay functionality
  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    
    const interval = setInterval(() => {
      setIdx((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, items.length]);

  const next = () => setIdx((i) => (i + 1) % items.length);
  const prev = () => setIdx((i) => (i - 1 + items.length) % items.length);

  const current = items[idx] || items[0];

  return (
    <Card 
      className="p-8 md:p-12 relative overflow-hidden group/slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute -top-10 -right-10 h-64 w-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="flex items-start justify-between gap-4 relative z-10 mb-10">
        <div className="flex items-center gap-4">
           <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/10">
              <Quote className="h-5 w-5 fill-current" />
           </div>
           <div>
              <h3 className="text-xl font-bold italic tracking-tight">Loved by Builders</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Trusted around the globe</p>
           </div>
        </div>
        
        {items.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="h-10 w-10 rounded-xl border border-white/5 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all active:scale-95"
              onClick={prev}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="h-10 w-10 rounded-xl border border-white/5 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all active:scale-95"
              onClick={next}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="relative z-10 min-h-[120px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="flex gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
            
            <p className="text-xl md:text-2xl font-bold italic leading-tight text-white mb-8">
              “{current?.quote}”
            </p>
            
            <div className="flex items-center justify-between gap-4 pt-8 border-t border-white/5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-purple-600/20 flex items-center justify-center border border-white/10">
                   <User className="h-6 w-6 text-white/40" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                     <span className="font-black italic tracking-tight">{current?.name}</span>
                     <Badge variant="secondary" className="h-4 px-1.5 text-[8px] uppercase tracking-widest">{current?.role}</Badge>
                  </div>
                  <div className="text-xs font-bold text-white/30 uppercase tracking-widest mt-0.5">
                    {current?.title}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-1">
                 {items.map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "h-1 rounded-full transition-all duration-500",
                        i === idx ? "w-6 bg-blue-500 shadow-[0_0_10px_#3b82f6]" : "w-2 bg-white/10"
                      )} 
                    />
                 ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  );
}

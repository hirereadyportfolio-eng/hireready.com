"use client";

import React, { useState } from "react";
import { ChevronDown, FileText, Clock, HelpCircle, Mail, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

export default function GuideAndRules() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const rules = [
    { title: "Original Work Only", desc: "All code must be written during the competition timeframe. Utilizing open-source libraries is permitted, but pre-built proprietary scaffolding is strictly forbidden." },
    { title: "Team Constraints", desc: "Teams must consist of 1 to 4 members. Cross-college teams are fully permitted and encouraged." },
    { title: "Submission Requirements", desc: "A submission is only valid if it contains: A public Github Repository link, a live demo URL (Vercel/Netlify/Firebase), and a 2-minute Loom presentation." },
    { title: "Code of Conduct", desc: "HireReady enforces a zero-tolerance policy for harassment, sabotage, or malicious attacks against platform infrastructure or other participants." }
  ];

  const timeline = [
    { date: "Hackathon Launch", time: "Friday, 6:00 PM EST", desc: "Theme unlocking and team formation finalized.", status: "upcoming" },
    { date: "Midpoint Check-in", time: "Saturday, 12:00 PM EST", desc: "Optional mentorship and technical blockers session.", status: "upcoming" },
    { date: "Coding Freeze", time: "Sunday, 12:00 PM EST", desc: "All repository commits must halt. Submission portal opens.", status: "upcoming" },
    { date: "Final Deadline", time: "Sunday, 2:00 PM EST", desc: "Absolute cutoff for submitting links and pitch decks.", status: "upcoming" },
    { date: "Leaderboard Publish", time: "Wednesday, 10:00 AM EST", desc: "Global ranking revealed and top teams connected with hiring partners.", status: "upcoming" }
  ];

  const faqs = [
    { q: "Is this completely free?", a: "Yes. HireReady hackathons and talent signaling are entirely free for students and solo builders." },
    { q: "Do I retain IP rights to my code?", a: "100%. You own everything you build. We simply act as the grading and signaling pipeline to connect you with employers." },
    { q: "What if I miss the submission deadline by 1 minute?", a: "The submission portal utilizes server-timestamps. Unfortunately, late submissions receive a hard penalty or are blocked automatically to ensure fairness." },
    { q: "How does the scoring rubric work?", a: "Submissions are audited by Senior Engineers across 5 pillars: Innovation, Technical Quality, UI/UX, Completion, and Presentation." }
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 bg-black text-white selection:bg-purple-500/30">
      <div className="max-w-4xl mx-auto space-y-24">
        
        {/* Header */}
        <div className="text-center space-y-6">
          <Badge variant="secondary" className="px-4 py-1.5 text-[10px]">OFFICIAL DOCUMENTATION</Badge>
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">Operations Guide</h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
            Everything you need to know to compete, survive, and dominate our technical challenges.
          </p>
        </div>

        {/* Rules */}
        <section className="space-y-8 relative">
          <div className="absolute -left-10 top-0 h-full w-px bg-gradient-to-b from-blue-500/0 via-blue-500/20 to-blue-500/0 hidden md:block" />
          <div className="flex items-center gap-4">
             <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <FileText className="h-5 w-5 text-blue-400" />
             </div>
             <h2 className="text-3xl font-bold italic tracking-tight">Rules of Engagement</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
             {rules.map((rule, idx) => (
               <Card key={idx} className="p-6 bg-white/[0.01] hover:bg-white/[0.02] border-white/5 transition-colors">
                  <h3 className="font-bold mb-3 flex items-center gap-3">
                     <span className="text-[10px] text-blue-400 font-black">0{idx+1}</span>
                     {rule.title}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed">{rule.desc}</p>
               </Card>
             ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="space-y-8 relative">
          <div className="flex items-center gap-4">
             <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <Clock className="h-5 w-5 text-purple-400" />
             </div>
             <h2 className="text-3xl font-bold italic tracking-tight">Standard Timeline</h2>
          </div>

          <div className="space-y-4">
             {timeline.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-6 p-6 rounded-[2rem] bg-white/[0.01] border border-white/5 relative overflow-hidden group">
                   <div className="absolute left-0 top-0 w-1 h-full bg-purple-500/20 group-hover:bg-purple-500 transition-colors" />
                   <div className="sm:w-1/3 space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-purple-400">{item.time}</div>
                      <h4 className="font-bold text-lg">{item.date}</h4>
                   </div>
                   <div className="sm:w-2/3">
                      <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
                   </div>
                </div>
             ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
             <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <HelpCircle className="h-5 w-5 text-emerald-400" />
             </div>
             <h2 className="text-3xl font-bold italic tracking-tight">Common Protocol (FAQ)</h2>
          </div>

          <div className="space-y-2">
             {faqs.map((faq, idx) => (
                <div 
                  key={idx} 
                  className="rounded-2xl border border-white/5 bg-white/[0.01] overflow-hidden transition-all"
                >
                   <button 
                     onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                     className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/[0.02]"
                   >
                     <span className="font-bold text-sm select-none">{faq.q}</span>
                     <ChevronDown className={cn("h-4 w-4 text-white/30 transition-transform duration-300", openFaq === idx ? "rotate-180" : "rotate-0")} />
                   </button>
                   <div className={cn("px-6 overflow-hidden transition-all duration-300", openFaq === idx ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0")}>
                      <p className="text-sm text-white/40 leading-relaxed max-w-2xl">{faq.a}</p>
                   </div>
                </div>
             ))}
          </div>
        </section>

        {/* Global Support Notice */}
        <Card className="p-8 md:p-12 text-center bg-gradient-to-t from-blue-900/10 to-transparent border-blue-500/10 relative overflow-hidden">
           <AlertTriangle className="absolute -right-10 -bottom-10 h-64 w-64 text-blue-500/5 rotate-12" />
           <Mail className="h-8 w-8 text-blue-400 mx-auto mb-6" />
           <h3 className="text-2xl font-bold italic tracking-tight mb-2">Need direct intervention?</h3>
           <p className="text-white/40 text-sm max-w-md mx-auto mb-8">
              If your query isn't resolved by standard protocols or you are facing severe technical blockers, reach out to HQ.
           </p>
           <a 
             href="mailto:admin@hireready.com" 
             className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-sm font-black italic transition-all shadow-xl shadow-blue-500/20"
           >
              CONTACT SUPPORT TEAM
           </a>
        </Card>

      </div>
    </div>
  );
}

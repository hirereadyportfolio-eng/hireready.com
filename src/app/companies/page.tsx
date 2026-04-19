"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ShieldCheck, Target, Zap, TrendingUp, Users, Award } from "lucide-react";

export default function ForCompaniesPage() {
  return (
    <div className="relative py-20 pb-32">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="hr-container mb-24 grid lg:grid-cols-2 gap-16 items-center">
         <div className="space-y-8">
            <Badge variant="accent">For Talent Acquisition Teams</Badge>
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.9]">
               Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Verified</span> Talent <br/> At Scale
            </h1>
            <p className="text-lg text-white/50 leading-relaxed max-w-lg">
               Stop filtering resumes. Start evaluating real skills through real-world challenges. Access the top 1% of campus engineering talent globally.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
               <Button onClick={() => window.location.href='/contact'} className="h-14 px-8 rounded-2xl text-lg font-black italic tracking-tight shadow-xl shadow-blue-500/20">Become a Partner</Button>
               <Button variant="secondary" className="h-14 px-8 rounded-2xl border-white/10">Request Talent Insights</Button>
            </div>
         </div>
         
         <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent blur-[100px] pointer-events-none" />
            <Card className="p-8 bg-white/[0.04] border-white/10 relative z-10 backdrop-blur-2xl">
               <div className="flex items-center gap-4 mb-8">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                     <Target className="h-5 w-5" />
                  </div>
                  <div className="font-bold italic text-lg">Talent Insight Report</div>
               </div>
               <div className="space-y-6">
                  <div className="space-y-2">
                     <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/40">
                        <span>Technical Craft</span>
                        <span className="text-blue-400">92% Signal</span>
                     </div>
                     <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[92%]" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/40">
                        <span>Innovation Index</span>
                        <span className="text-purple-400">88% Signal</span>
                     </div>
                     <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 w-[88%]" />
                     </div>
                  </div>
                  <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 flex items-center gap-4">
                     <TrendingUp className="h-8 w-8 text-blue-400" />
                     <div className="text-sm font-bold leading-tight uppercase italic">
                        Access <span className="text-blue-400">500k+</span> Verified <br/> Engineering Profiles
                     </div>
                  </div>
               </div>
            </Card>
            {/* Floating Stats */}
            <Card className="absolute -bottom-6 -right-6 p-4 px-6 bg-white/[0.08] border-white/10 backdrop-blur-xl hidden md:block">
               <div className="text-[10px] font-black tracking-widest text-white/30 uppercase mb-1">Success Metric</div>
               <div className="text-xl font-black italic tracking-tighter uppercase">98% Hired Success</div>
            </Card>
         </div>
      </div>

      <div className="hr-container grid md:grid-cols-3 gap-8 mb-32">
         {[
            { icon: Users, title: "Curated Talent", desc: "Access students who have proven their grit in live competitions." },
            { icon: Zap, title: "Speed-to-Hire", desc: "Reduce your time-to-hire by skipping the screening rounds." },
            { icon: Award, title: "Employer Branding", desc: "Sponsor a challenge and build your brand among students." }
         ].map(f => (
            <Card key={f.title} className="p-8 bg-white/[0.02] border-white/5 text-center flex flex-col items-center">
               <div className="h-14 w-14 rounded-3xl bg-white/5 flex items-center justify-center text-blue-400 mb-6 border border-white/10">
                  <f.icon className="h-6 w-6" />
               </div>
               <h3 className="text-lg font-bold italic mb-3 tracking-tight">{f.title}</h3>
               <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
            </Card>
         ))}
      </div>

      <section className="hr-container text-center bg-gradient-to-tr from-blue-600/10 to-purple-600/10 rounded-[4rem] p-16 border border-white/5">
         <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tight uppercase">Ready to Hire the Best?</h2>
            <p className="text-lg text-white/40 leading-relaxed">
               Work with HireReady to launch sponsored challenges and gain exclusive access to our talent engineering database.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
               <Button onClick={() => window.location.href='/contact'} className="h-14 px-10 rounded-2xl shadow-2xl shadow-blue-600/20">Talk to Partnerships</Button>
               <Button variant="secondary" className="h-14 px-10 rounded-2xl border-white/10 backdrop-blur-3xl">View Case Studies</Button>
            </div>
         </div>
      </section>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

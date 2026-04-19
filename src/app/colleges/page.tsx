"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GraduationCap, Trophy, Users, ShieldCheck, Zap, Globe } from "lucide-react";

export default function ForCollegesPage() {
  return (
    <div className="relative py-20 pb-32">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="hr-container mb-24 grid lg:grid-cols-2 gap-16 items-center">
         <div className="space-y-8">
            <Badge variant="accent">For Educational Institutions</Badge>
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.9]">
               Empower Your <br/> Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Builders</span>
            </h1>
            <p className="text-lg text-white/50 leading-relaxed max-w-lg">
               HireReady provides colleges with a complete infrastructure to host professional hackathons, track student growth, and attract top-tier hiring partners.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
               <Button onClick={() => window.location.href='/contact'} className="h-14 px-8 rounded-2xl text-lg font-black italic tracking-tight">Host Your Hackathon</Button>
               <Button variant="secondary" className="h-14 px-8 rounded-2xl border-white/10">Download Brochure</Button>
            </div>
         </div>
         
         <div className="grid grid-cols-2 gap-4">
            <FeatureCard 
              icon={Trophy} 
              title="Automated Scoring" 
              desc="Use our integrated rubric system to score hundreds of projects in minutes." 
            />
            <FeatureCard 
              icon={Users} 
              title="Talent Tracking" 
              desc="Build a long-term database of student skills and project history." 
              className="translate-y-8"
            />
            <FeatureCard 
              icon={ShieldCheck} 
              title="Verified Results" 
              desc="Ensure fairness with plagiarism checks and verified time-stamped submissions." 
            />
            <FeatureCard 
              icon={Globe} 
              title="Corporate Connect" 
              desc="Connect directly with companies looking to sponsor and hire from your events." 
              className="translate-y-8"
            />
         </div>
      </div>

      <section className="hr-container mb-24">
         <div className="grid lg:grid-cols-12 gap-12 items-center bg-white/[0.02] border border-white/10 rounded-[3rem] p-8 md:p-16 overflow-hidden relative">
            <div className="lg:col-span-12 relative z-10 text-center mb-12">
               <h2 className="text-3xl font-bold italic tracking-tight">Trusted by 50+ Top-Tier Engineering Colleges</h2>
            </div>
            {/* Logos Placeholder */}
            <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-5 gap-8 opacity-40 grayscale group hover:grayscale-0 transition-all duration-500">
               {[1,2,3,4,5].map(i => (
                  <div key={i} className="h-12 flex items-center justify-center border border-white/5 bg-white/5 rounded-2xl font-black italic text-xs">COLLEGE_{i}_LOGO</div>
               ))}
            </div>
         </div>
      </section>

      <section className="hr-container text-center">
         <div className="max-w-xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold italic tracking-tight uppercase">Ready to elevate your campus?</h2>
            <p className="text-white/40">Join the movement of colleges that build careers, not just resumes.</p>
            <Button onClick={() => window.location.href='/contact'} className="rounded-2xl h-14 px-10">Start for Free Today</Button>
         </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, className }: any) {
  return (
    <Card className={cn("p-8 bg-white/[0.03] border-white/5", className)}>
       <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
          <Icon className="h-6 w-6" />
       </div>
       <h3 className="font-bold italic mb-2 tracking-tight">{title}</h3>
       <p className="text-[11px] text-white/40 leading-relaxed">{desc}</p>
    </Card>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { TestimonialsSlider } from "@/components/ui/TestimonialsSlider";
import { 
  Trophy, 
  Users, 
  Rocket, 
  Zap, 
  Shield, 
  Globe, 
  ChevronRight, 
  Star,
  ArrowDown,
  Building2,
  GraduationCap
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-48">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-blue-600/5 blur-[120px] rounded-full -mt-96 pointer-events-none" />
        
        <div className="hr-container relative z-10 text-center space-y-10">
          <Badge variant="accent" className="animate-fade-in opacity-0 [animation-fill-mode:forwards] [animation-delay:200ms]">
             The Ultimate Talent Forge
          </Badge>
          
          <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8] animate-fade-in opacity-0 [animation-fill-mode:forwards] [animation-delay:400ms]">
            Hackathons That <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 bg-[length:200%_auto] animate-gradient-flow">Build Careers</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed animate-fade-in opacity-0 [animation-fill-mode:forwards] [animation-delay:600ms]">
            HireReady bridges the gap between students, colleges, and global companies through high-fidelity skill challenges and verified project signals.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 pt-4 animate-fade-in opacity-0 [animation-fill-mode:forwards] [animation-delay:800ms]">
            <ButtonLink href="/hackathons" size="lg" className="h-16 px-10 rounded-2xl shadow-2xl shadow-blue-500/20 text-lg">
               Join Hackathon
            </ButtonLink>
            <ButtonLink href="/colleges" variant="secondary" size="lg" className="h-16 px-10 rounded-2xl border-white/10 backdrop-blur-3xl text-lg">
               Host for College
            </ButtonLink>
            <ButtonLink href="/companies" variant="ghost" size="lg" className="h-16 px-10 rounded-2xl text-lg hover:bg-white/5">
                Hire Talent
            </ButtonLink>
          </div>

          <div className="pt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto opacity-0 animate-fade-in [animation-fill-mode:forwards] [animation-delay:1000ms]">
            <StatBox label="Active Participants" value="50k+" />
            <StatBox label="Completed Tracks" value="200+" />
            <StatBox label="Winners Hired" value="1.2k+" />
            <StatBox label="Partner Colleges" value="60+" />
          </div>
        </div>
      </section>

      {/* Urgency / Active Hackathons */}
      <section className="hr-container py-24 relative z-10">
         <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <SectionHeading 
               eyebrow="Active Tracks"
               title="Live Opportunities"
               description="Join the most competitive tracks and get verified by industry leaders."
            />
            <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-6 py-4">
               <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
               <span className="text-xs font-bold uppercase tracking-widest text-white/60">Next registration window closes in: 14h 22m</span>
            </div>
         </div>

         <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <HackathonPreviewCard 
               title="HireReady Global Summit"
               prize="$25,000 + Internship"
               tag="Ongoing"
               variant="accent"
               seatsLeft={14}
            />
            <HackathonPreviewCard 
               title="AI Innovation Sprint"
               prize="$10,000 + Vercel Credits"
               tag="Upcoming"
               variant="secondary"
               seatsLeft={45}
            />
            <HackathonPreviewCard 
               title="Campus Coding Clash"
               prize="Jobs @ Hiring Partners"
               tag="Registration Open"
               variant="success"
               seatsLeft={8}
            />
         </div>
      </section>

      {/* Trust / Partners */}
      <section className="hr-container py-24 border-t border-white/5">
         <div className="text-center opacity-40 mb-16 uppercase tracking-[0.3em] font-black text-[10px]">Trusted by elite organizations</div>
         <div className="grid grid-cols-2 md:grid-cols-5 gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
            {[1,2,3,4,5].map(i => (
               <div key={i} className="flex items-center justify-center font-black italic text-sm border border-white/5 bg-white/5 rounded-3xl h-16 transform hover:scale-105 transition-transform cursor-pointer">
                  PARTNER_LOGO_{i}
               </div>
            ))}
         </div>
      </section>

      {/* Value Proposition */}
      <section className="bg-white/[0.01] border-y border-white/5 py-32">
         <div className="hr-container grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
               <div className="absolute inset-0 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
               <Card className="p-0 overflow-hidden bg-white/5 border-white/10 group">
                  <div className="p-10 border-b border-white/5">
                     <div className="flex items-center gap-4 mb-8">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                           <Shield className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold italic tracking-tight uppercase">Skill Verification Engine</h3>
                     </div>
                     <p className="text-white/50 leading-relaxed text-sm">
                        Our proprietary scoring logic evaluates code quality, repository velocity, and collaboration signal to provide a credible "HireReady" score for every participant.
                     </p>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-white/5 bg-white/[0.02]">
                     <div className="p-8 space-y-2">
                        <div className="text-[10px] font-black tracking-widest text-white/30 uppercase">Accuracy</div>
                        <div className="text-3xl font-black italic">99.2%</div>
                     </div>
                     <div className="p-8 space-y-2 text-right">
                        <div className="text-[10px] font-black tracking-widest text-white/30 uppercase">Signal</div>
                        <div className="text-3xl font-black italic text-blue-400">HIGH</div>
                     </div>
                  </div>
               </Card>
            </div>
            
            <div className="space-y-12">
               <SectionHeading 
                  eyebrow="The Ecosystem"
                  title="A flywheel of talent, opportunity, and results."
                  description="We don't just host hackathons. We engineer a scalable path for your career or your campus recruitment."
                  align="left"
               />
               <div className="space-y-6">
                  <ValueItem icon={GraduationCap} title="For Colleges" desc="Automate hackathon management and provide jobs for your students." />
                  <ValueItem icon={Building2} title="For Companies" desc="Source verified talent without the resume-filtering overhead." />
                  <ValueItem icon={Rocket} title="For Students" desc="Build real projects, get verified, and skip the HR cold call." />
               </div>
               <ButtonLink href="/pricing" variant="secondary" className="rounded-2xl px-10 h-14">Explore Pricing Models</ButtonLink>
            </div>
         </div>
      </section>

      {/* Testimonials */}
      <section className="hr-container py-32">
         <SectionHeading 
            eyebrow="Wall of Love"
            title="Voices of the Future"
            description="From students who got hired to deans who scaled their campus impact."
         />
         <div className="mt-16">
            <TestimonialsSlider />
         </div>
      </section>

      {/* FAQ */}
      <section className="hr-container py-32 border-t border-white/5">
         <div className="max-w-3xl mx-auto">
            <SectionHeading 
               eyebrow="FAQ"
               title="Common Questions"
               description="Everything you need to know about the HireReady platform."
            />
            <div className="mt-12">
               <FaqAccordion />
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="hr-container py-32">
         <Card className="p-16 text-center bg-gradient-to-tr from-blue-600/10 via-purple-600/10 to-transparent border-white/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-6 relative z-10">Start Your Track <br/> Today.</h2>
            <p className="text-white/40 max-w-xl mx-auto mb-10 relative z-10">
               Join 50,000+ engineers building the future on HireReady. Your next career-defining project starts here.
            </p>
            <div className="flex flex-wrap justify-center gap-4 relative z-10">
               <ButtonLink href="/register" size="lg" className="rounded-2xl h-16 px-12 text-lg font-black italic">Sign Up Free</ButtonLink>
               <ButtonLink href="/contact" variant="secondary" size="lg" className="rounded-2xl h-16 px-12 text-lg border-white/10 bg-white/5 backdrop-blur-xl">Contact Support</ButtonLink>
            </div>
         </Card>
      </section>
    </div>
  );
}

function StatBox({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-1">
      <div className="text-2xl md:text-4xl font-black italic tracking-tighter">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 truncate">{label}</div>
    </div>
  );
}

function ValueItem({ icon: Icon, title, desc }: any) {
  return (
    <div className="flex gap-6 group">
       <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform flex-shrink-0">
          <Icon className="h-6 w-6" />
       </div>
       <div className="space-y-1">
          <h4 className="font-bold italic text-white/90">{title}</h4>
          <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
       </div>
    </div>
  );
}

function HackathonPreviewCard({ title, prize, tag, variant, seatsLeft }: any) {
  return (
    <Card className="p-8 group hover:border-blue-500/30 transition-all duration-500">
       <div className="flex justify-between items-start mb-10">
          <Badge variant={variant}>{tag}</Badge>
          <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-blue-400 transition-colors">
             <Trophy className="h-5 w-5" />
          </div>
       </div>
       <h3 className="text-xl font-bold italic tracking-tight mb-2 group-hover:underline underline-offset-4 decoration-white/20">
          {title}
       </h3>
       <div className="flex items-center gap-3 mb-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Prize Pool</span>
          <span className="text-xs font-black italic text-blue-400">{prize}</span>
       </div>
       
       <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <div className="flex flex-col">
             <span className="text-[9px] font-bold uppercase tracking-widest text-red-400">Ending Soon</span>
             <span className="text-xs font-black italic mt-0.5">{seatsLeft} Seats Left</span>
          </div>
          <ButtonLink href="/register" className="h-10 px-6 rounded-xl text-xs font-bold gap-2">
             Join Now <ChevronRight className="h-3.5 w-3.5" />
          </ButtonLink>
       </div>
    </Card>
  );
}

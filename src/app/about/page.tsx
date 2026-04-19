"use client";

import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Users, Building2, GraduationCap, Target, Award, Rocket } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description: "Bridging the gap between students, colleges, and companies through real-world competitions."
  },
  {
    icon: Users,
    title: "Community First",
    description: "Building a vibrant community of builders, designers, and innovators."
  },
  {
    icon: Award,
    title: "Skill Verification",
    description: "Providing credible signals that recruiters can trust, beyond just resumes."
  }
];

export default function AboutPage() {
  return (
    <div className="relative">
      <section className="hr-container pt-16 pb-12 sm:pt-20 sm:pb-16">
        <div className="max-w-3xl">
          <SectionHeading
            eyebrow="Our Mission"
            title="Bridge students, colleges, and companies through real competitions."
            description="HireReady was born from a simple observation: traditional hiring is broken. We believe skills should be proven, not just stated."
          />
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {values.map((v) => (
            <Card key={v.title} className="p-8">
              <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-blue-400">
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{v.title}</h3>
              <p className="text-white/60 leading-relaxed">
                {v.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="hr-container mt-10">
        <div className="hr-glass rounded-[2rem] p-8 md:p-12 overflow-hidden relative">
           <div className="absolute top-0 right-0 h-64 w-64 bg-purple-600/10 blur-[100px] -mr-32 -mt-32" />
           <div className="absolute bottom-0 left-0 h-64 w-64 bg-blue-600/10 blur-[100px] -ml-32 -mb-32" />
           
           <div className="relative grid gap-12 lg:grid-cols-2 items-center">
              <div>
                 <h2 className="text-3xl font-bold mb-6 italic tracking-tight">The HireReady Story</h2>
                 <div className="space-y-4 text-white/70 leading-relaxed">
                    <p>
                       We realized that some of the best engineering talent in colleges goes unnoticed because they lack the "right" keywords on their LinkedIn or don't come from top-tier universities.
                    </p>
                    <p>
                       Hackathons are the ultimate proving ground. They show how someone thinks, how they build under pressure, and how they collaborate.
                    </p>
                    <p>
                       HireReady provides the infrastructure for colleges to host professional-grade hackathons and for companies to discover talent through those very events.
                    </p>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center text-center">
                    <Building2 className="h-8 w-8 text-purple-400 mb-4" />
                    <div className="text-2xl font-bold italic">50+</div>
                    <div className="text-xs text-white/40 uppercase font-bold mt-1">Partner Colleges</div>
                 </div>
                 <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center text-center">
                    <Rocket className="h-8 w-8 text-blue-400 mb-4" />
                    <div className="text-2xl font-bold italic">200+</div>
                    <div className="text-xs text-white/40 uppercase font-bold mt-1">Hackathons Hosted</div>
                 </div>
                 <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center text-center">
                    <GraduationCap className="h-8 w-8 text-green-400 mb-4" />
                    <div className="text-2xl font-bold italic">50k+</div>
                    <div className="text-xs text-white/40 uppercase font-bold mt-1">Students Reached</div>
                 </div>
                 <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center text-center">
                    <Users className="h-8 w-8 text-orange-400 mb-4" />
                    <div className="text-2xl font-bold italic">1k+</div>
                    <div className="text-xs text-white/40 uppercase font-bold mt-1">Success Stories</div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      <section className="hr-container mt-20 pb-20">
         <div className="max-w-xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Join the revolution in recruitment.</h2>
            <p className="text-white/60">
               Whether you're a student building the future, a college wanting the best for its students, or a company seeking true talent.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
               <ButtonLink href="/register" size="lg">Get Started</ButtonLink>
               <ButtonLink href="/contact" variant="secondary" size="lg">Partner with Us</ButtonLink>
            </div>
         </div>
      </section>
    </div>
  );
}

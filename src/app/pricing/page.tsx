"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Check, Zap, Globe, Shield, Rocket, Building2 } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="relative py-20 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/5 blur-[120px] rounded-full -mt-40 pointer-events-none" />
      
      <div className="hr-container text-center mb-20 relative z-10">
        <Badge variant="accent" className="mb-6">Transparent Pricing</Badge>
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-6 uppercase">
           Scalable Plans for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Every Scale</span>
        </h1>
        <p className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed">
           Whether you're a single college campus or a global hiring partner, HireReady provides the infrastructure to discover elite talent.
        </p>
      </div>

      <div className="hr-container grid gap-8 lg:grid-cols-2 mb-20">
         {/* Academic Tracks */}
         <div className="space-y-8">
            <div className="flex items-center gap-3 ml-2">
               <Building2 className="text-blue-400 h-5 w-5" />
               <h2 className="text-xl font-bold italic tracking-tight">For Colleges & Universities</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
               <PricingCard 
                 name="Basic"
                 price="Free"
                 desc="Perfect for single student club competitions."
                 features={["1 Active Hackathon", "Up to 100 Users", "Standard Dashboard", "Community Support"]}
                 cta="Start for Free"
               />
               <PricingCard 
                 name="Premium"
                 price="$299"
                 period="/event"
                 popular
                 desc="Power your flagship annual campus hackathon."
                 features={["Unlimited Users", "Custom Branding", "Bulk CSV Export", "Winner Certificates", "Priority Review Panel"]}
                 cta="Get Started"
               />
            </div>
         </div>

         {/* Corporate Tracks */}
         <div className="space-y-8">
            <div className="flex items-center gap-3 ml-2">
               <Zap className="text-purple-400 h-5 w-5" />
               <h2 className="text-xl font-bold italic tracking-tight">For Companies & Talent Partners</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
               <PricingCard 
                 name="Hiring"
                 price="$999"
                 period="/mo"
                 desc="Access the full database of verified talent."
                 features={["Verified Skill Data", "Direct Recruit Invites", "Filtered Talent Search", "College Outreach"]}
                 cta="Contact Sales"
               />
               <PricingCard 
                 name="Enterprise"
                 price="Custom"
                 desc="Global white-label challenges for massive scale."
                 features={["White-label Platform", "Dedicated Success Manager", "Custom Scoring API", "Advanced Analytics Hub"]}
                 cta="Request Demo"
               />
            </div>
         </div>
      </div>

      <section className="hr-container">
         <Card className="p-12 bg-gradient-to-br from-white/[0.03] to-transparent text-center">
            <h3 className="text-2xl font-bold mb-4">Dedicated to Diversity & Excellence</h3>
            <p className="text-white/40 max-w-xl mx-auto mb-8">
               Are you a non-profit organization or a student-led community? We offer discounted and free licenses for initiatives driving diversity in tech.
            </p>
            <Button variant="secondary" onClick={() => window.location.href='/contact'}>Inquire About Grants</Button>
         </Card>
      </section>
    </div>
  );
}

function PricingCard({ name, price, period, desc, features, cta, popular }: any) {
  return (
    <Card className={cn(
      "p-8 flex flex-col h-full transition-all duration-500 hover:scale-[1.02]",
      popular ? "border-blue-500/30 bg-blue-500/[0.03] shadow-2xl shadow-blue-500/5" : "bg-white/[0.02] border-white/5"
    )}>
      <div className="flex justify-between items-start mb-6">
         <div>
            <h3 className="text-lg font-bold italic tracking-tight">{name}</h3>
            <p className="text-xs text-white/30 mt-1">{desc}</p>
         </div>
         {popular && <Badge variant="accent">Most Popular</Badge>}
      </div>
      
      <div className="mb-8">
         <span className="text-3xl font-black italic tracking-tighter">{price}</span>
         {period && <span className="text-sm text-white/20 font-bold uppercase ml-1 tracking-widest">{period}</span>}
      </div>

      <div className="space-y-3 mb-10 flex-1">
         {features.map((f: string) => (
            <div key={f} className="flex items-start gap-3 text-xs text-white/60 font-medium">
               <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
               {f}
            </div>
         ))}
      </div>

      <Button variant={popular ? "primary" : "secondary"} className="w-full h-12 rounded-2xl font-bold tracking-tight italic">
         {cta}
      </Button>
    </Card>
  );
}



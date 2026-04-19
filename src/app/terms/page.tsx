"use client";

import React from "react";

export default function TermsPage() {
  return (
    <div className="hr-container py-20 max-w-4xl">
      <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-10">Terms of Service</h1>
      <div className="prose prose-invert prose-blue max-w-none space-y-8 text-white/60">
         <section className="space-y-4">
            <h2 className="text-xl font-bold text-white italic">1. Agreement to Terms</h2>
            <p>By accessing or using HireReady, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.</p>
         </section>
         <section className="space-y-4">
            <h2 className="text-xl font-bold text-white italic">2. User Accounts</h2>
            <p>To use certain features of the platform, you must register for an account. You are responsible for maintaining the confidentiality of your account and password.</p>
         </section>
         <section className="space-y-4">
            <h2 className="text-xl font-bold text-white italic">3. Hackathon Participation</h2>
            <p>Participation in hackathons is subject to specific rules provided for each event. Plagiarism is strictly prohibited and may result in immediate disqualification and account suspension.</p>
         </section>
         <section className="space-y-4">
            <h2 className="text-xl font-bold text-white italic">4. Intellectual Property</h2>
            <p>Projects built during hackathons remain the intellectual property of the creators unless specified otherwise in the specific hackathon rules (e.g., for sponsored challenges).</p>
         </section>
      </div>
    </div>
  );
}

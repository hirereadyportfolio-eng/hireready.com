"use client";

import React from "react";

export default function PrivacyPage() {
  return (
    <div className="hr-container py-20 max-w-4xl">
      <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-10">Privacy Policy</h1>
      <div className="prose prose-invert prose-blue max-w-none space-y-8 text-white/60">
         <section className="space-y-4">
            <h2 className="text-xl font-bold text-white italic">1. Introduction</h2>
            <p>Welcome to HireReady. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you how we look after your personal data when you visit our website.</p>
         </section>
         <section className="space-y-4">
            <h2 className="text-xl font-bold text-white italic">2. Data We Collect</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul className="list-disc pl-6 space-y-2">
               <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
               <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
               <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
               <li><strong>Profile Data</strong> includes your skills, github handle, college details and hackathon history.</li>
            </ul>
         </section>
         <section className="space-y-4">
            <h2 className="text-xl font-bold text-white italic">3. How We Use Your Data</h2>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to provide our services, manage your registration, and connect you with hiring partners.</p>
         </section>
      </div>
    </div>
  );
}

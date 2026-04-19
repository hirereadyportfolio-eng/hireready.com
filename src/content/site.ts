export const stats = [
  { label: "Students", value: 10000, suffix: "+" },
  { label: "Hackathons", value: 25, suffix: "+" },
  { label: "Hiring Partners", value: 50, suffix: "+" },
] as const;

export const testimonials = [
  {
    quote:
      "HireReady made it surprisingly easy to run a campus-wide hackathon with real hiring outcomes. The student energy was incredible.",
    name: "Placement Officer",
    title: "Tier-2 Engineering College",
  },
  {
    quote:
      "We screened candidates with actual skills instead of resumes. The leaderboard and reports helped us move fast and hire confidently.",
    name: "Recruiting Lead",
    title: "Product Startup",
  },
  {
    quote:
      "The challenge format felt like a real interview loop—fun, intense, and fair. I got noticed for what I can build.",
    name: "Hackathon Winner",
    title: "Final-year Student",
  },
] as const;

export const faqs = [
  {
    q: "Is HireReady online, offline, or hybrid?",
    a: "All three. We run fully online events, on-campus hackathons, and hybrid formats with on-site finals and online qualifiers.",
  },
  {
    q: "How do companies evaluate candidates?",
    a: "Through real challenges with anti-cheat safeguards, scoring rubrics, project submissions, and skill reports. You can interview top performers directly.",
  },
  {
    q: "What does HireReady handle for colleges?",
    a: "End-to-end: problem statements, registrations, communication, evaluation, certificates, sponsor coordination, and post-event reports.",
  },
  {
    q: "Do students need prior experience to participate?",
    a: "No. We design challenge tracks for beginners through advanced participants, with mentorship and clear evaluation criteria.",
  },
] as const;

export type Role = "Student" | "College" | "Company";

export const hackathons = [
  {
    title: "HireReady Online Hackathon 2026",
    date: "June 18–20, 2026",
    mode: "Online",
    prize: "₹2,00,000",
  },
  {
    title: "AI Innovation Challenge",
    date: "July 9–11, 2026",
    mode: "Hybrid",
    prize: "₹1,50,000",
  },
  {
    title: "Campus Talent Sprint",
    date: "Aug 2, 2026",
    mode: "On-campus",
    prize: "Goodies + Fast-track interviews",
  },
] as const;


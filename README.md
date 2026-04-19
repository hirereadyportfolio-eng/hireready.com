# HireReady — Professional Hackathon Platform

HireReady is a premium, startup-grade platform designed for hosting professional online hackathons. It bridges the gap between students, colleges, and companies through high-impact, skill-based competitions.

---

## ✨ Key Features

### 🌐 Public Website
- **Home**: Dynamic landing page showcasing the mission and impact.
- **About**: Clear presentation of values and the HireReady story.
- **Join Hackathons**: Discovery portal for upcoming events.
- **Contact**: Action-oriented lead generation for colleges and companies.

### 👤 Student Dashboard
- **Overview**: Real-time stats (Registrations, Projects, Ranking).
- **Leaderboard**: Live global rankings across all tracks.
- **Registration**: One-click entry into ongoing and upcoming events.
- **Project Submissions**: Unified interface for managing GitHub, Demo, and PPT links.
- **Profile**: Academic and skill-based profile builder for recruiters.

### 🛡️ Admin Panel
- **Analytics Dashboard**: Real-time metrics overview including total users and conversion rates (using Recharts).
- **Hackathon Management**: Create, edit, and monitor hackathons with specific rules and prize pools.
- **Participant Management**: Full view of users and their registrations.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **UI & Logic**: [React 19](https://react.dev/)
- **Authentication**: [Firebase Auth](https://firebase.google.com/products/auth) (Email/Password & Google)
- **Database**: [Firebase Firestore](https://firebase.google.com/products/firestore) (Real-time NoSQL)
- **Storage**: [Firebase Storage](https://firebase.google.com/products/storage)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Icons**: [Lucide React 0.334.0](https://lucide.dev/) (Fixed for brand icon support)

---

## 📂 Project Structure

```text
src/
├── app/                  # Next.js App Router Pages
│   ├── (auth)/           # Authentication (Login/Register)
│   ├── admin/            # Admin Panel Pages
│   ├── dashboard/        # User Dashboard Pages
│   ├── api/              # Serverless API routes
│   └── ...               # Public marketing pages
├── components/           # Reusable Components
│   ├── ui/               # Primary UI Kit (Premium Aesthetic)
│   ├── site/             # Public site shared components (Navbar, Footer)
│   └── ...               # View-specific components
├── context/              # Global Context (Auth, etc.)
├── lib/                  # Utilities, Firebase Init, Logic
└── content/              # Static content & Mock data
```

---

## 🗃️ Database Structure (Firestore)

- **`users`**: `uid, name, email, role, college, skills, github, bio`
- **`hackathons`**: `title, description, prize, startDate, endDate, status, registrations`
- **`registrations`**: `userId, hackathonId, status, registeredAt`
- **`submissions`**: `userId, hackathonId, repoLink, demoLink, pptLink, description`
- **`scores`**: `userId, userName, score, ranking_data`

---

## 🚀 Getting Started

1. **Clone & Install**
   ```bash
   npm install
   ```

2. **Configure Environment**
   Create a `.env.local` file and add your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

---

## ⚖️ License
Built for personal/professional deployment. All rights reserved.

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PageTransition, Providers } from "./providers";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FirebaseConfigAlert } from "@/components/FirebaseConfigAlert";
import { NetworkStatus } from "@/components/NetworkStatus";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "HireReady | Professional Hackathon Platform for Colleges & Companies",
    template: "%s | HireReady",
  },
  description:
    "Bridge students, colleges, and companies through real competitions. Discover verified talent and build high-fidelity skills on the ultimate hackathon forge.",
  metadataBase: new URL("https://hireready.io"),
  openGraph: {
    title: "HireReady | Hackathons That Build Careers",
    description: "The ultimate platform for student skill verification and corporate talent discovery.",
    url: "https://hireready.io",
    siteName: "HireReady",
    images: [{ url: "/og-image.png" }],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <NetworkStatus />
          <FirebaseConfigAlert />
          <Navbar />

          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

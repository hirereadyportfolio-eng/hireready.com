"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  BarChart3, 
  Trophy, 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Bell,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  Mail,
  Medal,
  LineChart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

const menuItems = [
  { icon: BarChart3, label: "Admin Metrics", href: "/admin" },
  { icon: LineChart, label: "Analytics", href: "/admin/analytics" },
  { icon: Mail, label: "Capture Leads", href: "/admin/leads" },
  { icon: Trophy, label: "Manage Tracks", href: "/admin/hackathons" },
  { icon: Users, label: "Participants", href: "/admin/registrations" },
  { icon: Users, label: "Community", href: "/admin/users" },
  { icon: FileText, label: "Submissions", href: "/admin/submissions" },
  { icon: Medal, label: "Leaderboard", href: "/admin/leaderboard" },
  { icon: Bell, label: "Announcements", href: "/admin/announcements" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

import { AdminGuard } from "@/components/auth/AuthGuards";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-black text-white selection:bg-purple-500/30">
        {/* Sidebar */}
        <aside className={cn(
          "fixed left-0 top-0 z-40 h-full w-72 flex-col border-r border-white/10 bg-black/50 backdrop-blur-3xl transition-transform md:flex",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          {/* ... existing sidebar content ... */}
          <div className="flex h-20 items-center px-8">
             <Link href="/" className="flex items-center gap-3 group">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-600/20 group-hover:rotate-12 transition-transform">
                   <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-black italic tracking-tighter">HIREREADY <span className="text-[10px] font-bold text-purple-500 not-italic tracking-widest ml-1 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">ADMIN</span></span>
             </Link>
          </div>
          
          <nav className="flex-1 space-y-1 px-5 py-6">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300 group",
                    isActive
                      ? "bg-white/[0.08] text-white shadow-xl shadow-black/50 border border-white/5"
                      : "text-white/40 hover:bg-white/[0.03] hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("h-4.5 w-4.5 transition-colors", isActive ? "text-purple-400" : "text-white/20 group-hover:text-white/40")} />
                    <span className="tracking-tight italic">{item.label}</span>
                  </div>
                  {isActive && <div className="h-1.5 w-1.5 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7]" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t border-white/5">
             <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 mb-6">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center font-bold italic border border-white/10 shadow-lg">
                      {user?.displayName?.[0] || "A"}
                   </div>
                   <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-bold truncate italic tracking-tight">{user?.displayName}</span>
                      <span className="text-[10px] font-bold text-white/30 truncate uppercase tracking-widest">Master Admin</span>
                   </div>
                </div>
             </div>
             
             <button
               onClick={logout}
               className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-xs font-bold text-white/40 hover:bg-red-500/5 hover:text-red-400 transition-all border border-transparent hover:border-red-500/10 group"
             >
               <LogOut className="h-4 w-4 text-white/10 group-hover:text-red-400" />
               SIGN OUT SESSION
             </button>
          </div>
        </aside>

        {/* Mobile Control */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-purple-600 shadow-2xl shadow-purple-600/40 flex items-center justify-center md:hidden"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Main Content */}
        <main className="flex-1 md:pl-72 overflow-x-hidden">
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between px-8 bg-black/60 backdrop-blur-3xl border-b border-white/5">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-[0.2em] text-white/20 uppercase">Core Management</span>
                <ChevronRight className="h-3 w-3 text-white/10" />
                <span className="text-xs font-bold italic tracking-tight text-white/60">
                  {menuItems.find(m => m.href === pathname)?.label || "Dashboard"}
                </span>
             </div>
             
             <div className="flex items-center gap-4">
                <button className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors relative">
                   <Bell className="h-4 w-4" />
                   <div className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-blue-500" />
                </button>
                <div className="h-10 px-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full bg-green-500" />
                   <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Node Active</span>
                </div>
             </div>
          </header>

          <div className="p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Overlay for mobile */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </AdminGuard>
  );
}


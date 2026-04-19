"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy, limit, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  Trophy, 
  Users, 
  Calendar, 
  FileCheck, 
  ArrowRight,
  Zap,
  Star,
  Clock,
  ArrowUpRight
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

interface UserStats {
  joinedCount: number;
  submissionCount: number;
  rank: number | string;
}

export default function DashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserDashboard();
    }
  }, [user]);

  const fetchUserDashboard = async () => {
    try {
      const [regSnap, subSnap, hackSnap, scoreSnap] = await Promise.all([
        getDocs(collection(db, "users", user!.uid, "registrations")),
        getDocs(query(collection(db, "submissions"), where("userId", "==", user!.uid))),
        getDocs(query(collection(db, "hackathons"), where("status", "in", ["upcoming", "ongoing"]), limit(2))),
        getDocs(query(collection(db, "scores"), orderBy("score", "desc")))
      ]);

      // Calculate rank
      let rank: number | string = "--";
      scoreSnap.docs.forEach((doc, idx) => {
        if (doc.data().userId === user!.uid) {
          rank = idx + 1;
        }
      });

      setStats({
        joinedCount: regSnap.size,
        submissionCount: subSnap.size,
        rank: rank
      });

      const hackData = hackSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUpcoming(hackData);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Joined tracks", value: stats?.joinedCount || 0, icon: Trophy, color: "text-blue-400" },
    { label: "Global Ranking", value: stats?.rank === "--" ? "--" : `#${stats?.rank}`, icon: Star, color: "text-purple-400" },
    { label: "Final Submissions", value: stats?.submissionCount || 0, icon: FileCheck, color: "text-emerald-400" },
  ];

  if (loading) return (
    <div className="space-y-8">
       <div className="grid gap-6 sm:grid-cols-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-40" />)}
       </div>
       <Skeleton className="h-64 h-w-full" />
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold italic tracking-tighter">Welcome back, {user?.displayName?.split(" ")[0] || "Builder"}</h2>
          <p className="text-white/40 text-sm">Your engineering signal is looking sharp today.</p>
        </div>
        <Button onClick={() => window.location.href='/dashboard/hackathons'} className="rounded-2xl h-12 px-6 shadow-xl shadow-blue-600/10 gap-2 font-bold italic">
           Launch Next Build <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {statCards.map((s) => (
          <Card key={s.label} className="p-8 group">
            <div className="flex items-center justify-between mb-6">
              <div className={cn("rounded-2xl p-3 bg-white/5 border border-white/5", s.color)}>
                <s.icon className="h-6 w-6" />
              </div>
              <Badge variant="secondary" className="h-5">Live</Badge>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">{s.label}</p>
            <p className="mt-2 text-4xl font-black italic tracking-tighter text-white">
               {s.value}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 flex flex-col gap-6">
           <Card className="p-10 bg-gradient-to-tr from-white/[0.02] to-transparent">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-4">
                    <Zap className="h-6 w-6 text-yellow-400" />
                    <h3 className="text-xl font-bold italic tracking-tight">Active Opportunities</h3>
                 </div>
                 <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white">View All</Button>
              </div>

              <div className="grid gap-4">
                 {upcoming.length === 0 ? (
                    <div className="p-10 text-center border border-dashed border-white/10 rounded-3xl">
                       <p className="text-sm text-white/30 italic">No new tracks discovered yet.</p>
                    </div>
                 ) : upcoming.map((hack) => (
                    <div key={hack.id} className="group p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex items-center justify-between">
                       <div className="flex items-center gap-5">
                          <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                             <Trophy className="h-6 w-6 text-purple-400" />
                          </div>
                          <div>
                             <h4 className="font-bold italic tracking-tight">{hack.title}</h4>
                             <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                   <Clock className="h-3 w-3" /> Ends on {new Date(hack.endDate).toLocaleDateString()}
                                </span>
                                <Badge variant="accent" className="h-4 px-1.5 text-[8px] font-black">{hack.prize}</Badge>
                             </div>
                          </div>
                       </div>
                       <Button size="sm" onClick={() => window.location.href='/dashboard/hackathons'} className="h-9 w-9 p-0 rounded-xl bg-white/5 hover:bg-white/10 border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowUpRight className="h-4 w-4" />
                       </Button>
                    </div>
                 ))}
              </div>
           </Card>

           <Card className="p-10 border-blue-500/10 bg-gradient-to-br from-blue-500/5 to-transparent">
              <h3 className="text-xl font-bold italic tracking-tight mb-2">Upgrade to Pro Skillset?</h3>
              <p className="text-sm text-white/40 max-w-sm leading-relaxed mb-6">
                 Complete your profile and link your GitHub to increase your visibility to partner companies by <span className="text-blue-400 font-bold italic">2.4x</span>.
              </p>
              <Button variant="secondary" onClick={() => window.location.href='/dashboard/profile'} className="rounded-2xl px-6 h-11 text-xs border-white/10">Complete Profile</Button>
           </Card>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
           <Card className="p-8">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-6">Activity Feed</h4>
              <div className="space-y-6">
                 {[1,2,3].map(i => (
                    <div key={i} className="flex gap-4 relative">
                       {i < 3 && <div className="absolute left-[13px] top-8 bottom-0 w-px bg-white/5" />}
                       <div className="h-7 w-7 rounded-full bg-blue-500/10 border border-blue-500/10 flex items-center justify-center text-[10px] font-bold text-blue-400 relative z-10 bg-black">
                          {i}
                       </div>
                       <div className="flex-1">
                          <p className="text-xs font-bold italic text-white/80">
                             {i === 1 ? "Profile Indexed" : i === 2 ? "Skill Verified" : "New Track Launched"}
                          </p>
                          <p className="text-[10px] text-white/30 mt-1 uppercase font-bold tracking-tighter">
                             {i * 2} hours ago
                          </p>
                       </div>
                    </div>
                 ))}
              </div>
           </Card>

           <Card className="p-8 h-full bg-gradient-to-b from-purple-600/10 to-transparent border-purple-500/10">
              <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6">
                 <Trophy className="h-6 w-6" />
              </div>
              <h4 className="font-bold italic mb-2">Leaderboard Elite</h4>
              <p className="text-xs text-white/40 leading-relaxed mb-6">
                 The top 5% of participants are invited to private recruiter sessions. Currently you are in the top <span className="text-purple-400 font-bold italic">15%</span>.
              </p>
              <Button variant="ghost" onClick={() => window.location.href='/dashboard/leaderboard'} className="w-full text-[10px] font-black uppercase tracking-widest text-purple-400 hover:bg-purple-500/5">View Leaderboard</Button>
           </Card>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

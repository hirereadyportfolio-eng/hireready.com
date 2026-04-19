"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { 
  Trophy, 
  Medal, 
  Crown, 
  Search, 
  ArrowUp,
  Zap,
  Globe,
  Users
} from "lucide-react";

interface LeaderboardEntry {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  score: number;
  hackathonTitle: string;
}

export default function GlobalLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const q = query(collection(db, "scores"), orderBy("score", "desc"), limit(50));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LeaderboardEntry[];
      setEntries(data);
    } catch (error) {
      console.error("Error fetching leaderboard", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="h-6 w-6 text-yellow-400 group-hover:scale-125 transition-transform" />;
    if (index === 1) return <Medal className="h-6 w-6 text-slate-300 group-hover:scale-125 transition-transform" />;
    if (index === 2) return <Medal className="h-6 w-6 text-amber-600 group-hover:scale-125 transition-transform" />;
    return <span className="text-sm font-black italic text-white/20 group-hover:text-white/40 transition-colors">#{index + 1}</span>;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-tr from-white to-white/40">Global Hall of Fame</h2>
          <p className="text-white/40 text-sm mt-1 max-w-sm">
            Recognizing the top engineering minds across all tracks and seasons.
          </p>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Total Builders</span>
              <span className="text-xl font-black italic tracking-tight flex items-center gap-2">
                 <Users className="h-4 w-4 text-blue-400" />
                 {loading ? "..." : entries.length * 12 + 150} {/* Weighted mock for effect */}
              </span>
           </div>
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Active Tracks</span>
              <span className="text-xl font-black italic tracking-tight flex items-center gap-2">
                 <Globe className="h-4 w-4 text-purple-400" />
                 24
              </span>
           </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         {loading ? (
           [0,1,2].map(i => <Skeleton key={i} className="h-48" />)
         ) : entries.slice(0, 3).map((entry, index) => (
           <Card key={entry.id} className={cn(
             "p-8 relative overflow-hidden group",
             index === 0 ? "border-yellow-500/20 bg-yellow-500/5" : 
             index === 1 ? "border-slate-500/20 bg-slate-500/5" :
             "border-amber-600/20 bg-amber-600/5"
           )}>
              <div className="absolute -top-10 -right-10 opacity-10 blur-2xl transition-opacity group-hover:opacity-20 animate-pulse">
                 {index === 0 ? <Crown className="h-40 w-40" /> : <Medal className="h-40 w-40" />}
              </div>
              
              <div className="flex justify-between items-start relative z-10">
                 <div className="h-14 w-14 rounded-full bg-black/40 border border-white/5 flex items-center justify-center">
                    {getRankIcon(index)}
                 </div>
                 <Badge variant="secondary" className="h-6 font-black uppercase tracking-widest text-[9px]">Level {10 - index}</Badge>
              </div>
              
              <div className="mt-8 relative z-10">
                 <h3 className="text-xl font-black italic tracking-tight text-white group-hover:underline underline-offset-4 decoration-white/20">{entry.userName}</h3>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">{entry.hackathonTitle}</p>
              </div>

              <div className="mt-6 flex items-end justify-between relative z-10 border-t border-white/5 pt-6">
                 <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/30 block mb-1">Elite Signal</span>
                    <div className="flex items-center gap-1.5 text-2xl font-black italic tracking-tighter">
                       <Zap className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                       {entry.score}
                    </div>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-1">Trend</span>
                    <div className="flex items-center gap-1 text-green-400 font-bold text-xs italic">
                       <ArrowUp className="h-3 w-3" />
                       NEW PR
                    </div>
                 </div>
              </div>
           </Card>
         ))}
      </div>

      <Card className="overflow-hidden p-0 border-white/5 bg-white/[0.01]">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40">
                     <th className="px-8 py-5">Rank & Builder</th>
                     <th className="px-8 py-5">Mastered Track</th>
                     <th className="px-8 py-5 text-center">Technical Score</th>
                     <th className="px-8 py-5 text-right">Badges</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/[0.03]">
                  {loading ? (
                    [1,2,3,4,5].map(i => (
                       <tr key={i} className="animate-pulse">
                          <td colSpan={4} className="px-8 py-8"><div className="h-4 bg-white/5 rounded-full w-full"></div></td>
                       </tr>
                    ))
                  ) : entries.slice(3).map((entry, index) => (
                    <tr key={entry.id} className="hover:bg-white/[0.02] transition-colors group">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-6">
                             <div className="w-8 text-sm font-black italic text-white/10 group-hover:text-white/40 transition-colors">
                                #{index + 4}
                             </div>
                             <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-xs font-bold transition-all group-hover:bg-white/10">
                                   {entry.userName[0]}
                                </div>
                                <div className="flex flex-col">
                                   <span className="font-bold text-sm tracking-tight">{entry.userName}</span>
                                   <span className="text-[10px] text-white/30 font-bold uppercase">{entry.userEmail.split('@')[0]}</span>
                                </div>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <span className="text-sm font-medium italic text-white/60 group-hover:text-white transition-colors">{entry.hackathonTitle}</span>
                       </td>
                       <td className="px-8 py-6 text-center">
                          <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                             <Zap className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                             <span className="font-mono text-lg font-black italic tracking-tighter text-white">
                                {entry.score}
                             </span>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                             <div className="h-6 w-6 rounded-full bg-blue-500/10 border border-blue-500/10 flex items-center justify-center" title="Project Master">
                                <Trophy className="h-3 w-3 text-blue-400" />
                             </div>
                             <div className="h-6 w-6 rounded-full bg-emerald-500/10 border border-emerald-500/10 flex items-center justify-center" title="Early Adopter">
                                <Medal className="h-3 w-3 text-emerald-400" />
                             </div>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
         {!loading && entries.length === 0 && (
           <div className="py-32 text-center text-white/10 italic font-bold uppercase tracking-widest">
              Awaiting first verified entries...
           </div>
         )}
      </Card>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

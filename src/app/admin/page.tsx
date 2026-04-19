"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  Users, 
  Trophy, 
  FileText, 
  MousePointer2,
  TrendingUp,
  ArrowUpRight,
  TrendingDown,
  Activity,
  Zap
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

interface Stats {
  users: number;
  hackathons: number;
  submissions: number;
  registrations: number;
}

export default function AdminMetrics() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [userSnap, hackSnap, subSnap, regSnap] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(collection(db, "hackathons")),
        getDocs(collection(db, "submissions")),
        getDocs(collection(db, "registrations"))
      ]);

      setStats({
        users: userSnap.size,
        hackathons: hackSnap.size,
        submissions: subSnap.size,
        registrations: regSnap.size
      });
    } catch (error) {
      console.error("Error fetching admin stats", error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: "Mon", active: 24, growth: 12 },
    { name: "Tue", active: 32, growth: 18 },
    { name: "Wed", active: 45, growth: 22 },
    { name: "Thu", active: 58, growth: 30 },
    { name: "Fri", active: 75, growth: 42 },
    { name: "Sat", active: 82, growth: 38 },
    { name: "Sun", active: 95, growth: 45 },
  ];

  const metrics = [
    { label: "Elite Talent", value: stats?.users || 0, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Active Tracks", value: stats?.hackathons || 0, icon: Trophy, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Submissions", value: stats?.submissions || 0, icon: FileText, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Total Signal", value: stats?.registrations || 0, icon: Activity, color: "text-orange-400", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold italic tracking-tighter">Insights & Signal</h2>
          <p className="text-white/40 text-sm">Real-time platform performance and talent conversion.</p>
        </div>
        <div className="flex items-center gap-3">
           <Card className="px-4 py-2 rounded-2xl flex items-center gap-3 border-white/5" glass={false}>
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 text-nowrap">Live Monitoring Active</span>
           </Card>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label} className="p-8 group hover:border-white/20 transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className={cn("rounded-3xl p-4 transition-all duration-500 group-hover:scale-110", m.bg, m.color)}>
                <m.icon className="h-6 w-6" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-white/20 group-hover:text-white/60 transition-colors" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">{m.label}</p>
              <p className="text-3xl font-black italic tracking-tighter text-white">
                 {loading ? "..." : m.value.toLocaleString()}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <Card className="p-10 lg:col-span-8 bg-gradient-to-br from-white/[0.02] to-transparent">
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
               </div>
               <div>
                  <h3 className="text-lg font-bold italic tracking-tight">Traffic & Engagement</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">User activity over time</p>
               </div>
            </div>
            <div className="flex gap-2">
               <button className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-all">Export JSON</button>
            </div>
          </div>
          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  fontWeight={700}
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  fontWeight={700}
                  tickLine={false} 
                  axisLine={false} 
                  dx={-10}
                />
                <Tooltip 
                  cursor={{ stroke: '#ffffff10', strokeWidth: 1 }}
                  contentStyle={{ 
                    backgroundColor: "rgba(0,0,0,0.8)", 
                    backdropFilter: "blur(12px)", 
                    border: "1px solid rgba(255,255,255,0.1)", 
                    borderRadius: "20px",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
                   }}
                  itemStyle={{ color: "#fff", fontWeight: 700, fontSize: "12px" }}
                  labelStyle={{ color: "rgba(255,255,255,0.4)", fontWeight: 700, fontSize: "10px", marginBottom: "4px" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="active" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorActive)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-10 lg:col-span-4 flex flex-col items-center justify-center text-center overflow-hidden relative">
           <Zap className="h-40 w-40 absolute -top-10 -right-10 text-purple-500/5 rotate-12" />
           <div className="h-20 w-20 rounded-[2.5rem] bg-purple-500/10 flex items-center justify-center text-purple-400 mb-8 border border-purple-500/10">
              <Zap className="h-10 w-10 fill-purple-500/20" />
           </div>
           <h3 className="text-xl font-bold italic tracking-tight">Platform Vitals</h3>
           <p className="text-sm text-white/40 mt-3 leading-relaxed max-w-[200px]">
              Platform scalability is at <span className="text-white font-bold italic">99.9%</span> with zero reported latency.
           </p>
           
           <div className="mt-10 grid grid-cols-2 w-full gap-4">
              <div className="p-4 rounded-3xl bg-white/5 border border-white/5">
                 <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Uptime</div>
                 <div className="text-lg font-black italic">100%</div>
              </div>
              <div className="p-4 rounded-3xl bg-white/5 border border-white/5">
                 <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Latency</div>
                 <div className="text-lg font-black italic">14ms</div>
              </div>
           </div>
           
           <Button variant="secondary" className="w-full mt-8 rounded-2xl h-12 text-xs font-bold leading-none border-white/5">
              Run System Diagnostics
           </Button>
        </Card>
      </div>
    </div>
  );
}



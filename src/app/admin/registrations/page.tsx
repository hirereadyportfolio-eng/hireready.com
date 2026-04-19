"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, where, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  XCircle, 
  UserPlus,
  Mail,
  GraduationCap,
  Calendar,
  MoreVertical,
  ChevronDown
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Registration {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  hackathonId: string;
  hackathonTitle: string;
  status: "pending" | "confirmed" | "checked-in" | "cancelled";
  registeredAt: any;
  college?: string;
}

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const q = query(collection(db, "registrations"), orderBy("registeredAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Registration[];
      setRegistrations(data);
    } catch (error) {
      console.error("Error fetching registrations", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "registrations", id), { status });
      setRegistrations(registrations.map(r => r.id === id ? { ...r, status: status as any } : r));
      toast.success(`Participant ${status}`);
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Hackathon", "College", "Status", "Date"];
    const rows = registrations.map(r => [
      r.userName,
      r.userEmail,
      r.hackathonTitle,
      r.college || "N/A",
      r.status,
      new Date(r.registeredAt?.seconds * 1000).toLocaleDateString()
    ]);

    let csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HireReady_Participants_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = registrations.filter(r => 
    r.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.hackathonTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold italic tracking-tight">Participant Roster</h2>
          <p className="text-white/60 text-sm">Control attendance and confirm registrations across all tracks.</p>
        </div>
        <Button onClick={exportToCSV} variant="secondary" className="gap-2 h-12 px-6 rounded-2xl border-white/10 font-bold italic">
           <Download className="h-4 w-4" />
           Export CSV
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <Input 
            className="pl-12 h-12 rounded-2xl bg-white/5" 
            placeholder="Search by name, email, or track..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="secondary" className="gap-2 h-12 rounded-2xl px-5 border-white/5">
          <Filter className="h-4 w-4" />
          All Tracks
          <ChevronDown className="h-4 w-4 text-white/20" />
        </Button>
      </div>

      <Card className="overflow-hidden p-0 bg-white/[0.01] border-white/5">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40">
                     <th className="px-6 py-5">Participant Details</th>
                     <th className="px-6 py-5">Competition Track</th>
                     <th className="px-6 py-5">Academic Tag</th>
                     <th className="px-6 py-5">Registration</th>
                     <th className="px-6 py-5 text-right">Operations</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/[0.03]">
                  {loading ? (
                    [1,2,3,4,5].map(i => <tr key={i} className="animate-pulse"><td colSpan={5} className="px-6 py-8"><div className="h-4 bg-white/5 rounded-full w-full"></div></td></tr>)
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-20 text-center text-white/10 italic font-bold">No registrations found.</td></tr>
                  ) : filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-white/[0.02] transition-colors group">
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold italic text-white/20 group-hover:text-blue-400 group-hover:border-blue-500/20 transition-all">
                                {r.userName[0]}
                             </div>
                             <div className="flex flex-col">
                                <span className="font-bold text-sm tracking-tight italic">{r.userName}</span>
                                <span className="text-[10px] text-white/30 font-bold uppercase flex items-center gap-1.5">
                                   <Mail className="h-2.5 w-2.5" />
                                   {r.userEmail}
                                </span>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <Badge variant="accent" className="h-5 italic">{r.hackathonTitle}</Badge>
                       </td>
                       <td className="px-6 py-4 text-xs text-white/50 font-medium italic">
                          {r.college || "N/A"}
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex flex-col">
                             <span className="text-[10px] font-black italic tracking-tighter text-white/60">{r.status || "CONFIRMED"}</span>
                             <span className="text-[9px] text-white/20 uppercase font-black tracking-widest mt-0.5">
                                {r.registeredAt ? new Date(r.registeredAt.seconds * 1000).toLocaleDateString() : "Historical"}
                             </span>
                          </div>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                             <Button 
                               onClick={() => updateStatus(r.id, "checked-in")} 
                               disabled={r.status === "checked-in"}
                               variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-green-500/10 hover:text-green-400"
                               title="Check-in Attendance"
                             >
                                <CheckCircle2 className="h-4 w-4" />
                             </Button>
                             <Button 
                               onClick={() => updateStatus(r.id, "cancelled")} 
                               disabled={r.status === "cancelled"}
                               variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-red-500/10 hover:text-red-400"
                               title="Cancel Entry"
                             >
                                <XCircle className="h-4 w-4" />
                             </Button>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Card>
    </div>
  );
}

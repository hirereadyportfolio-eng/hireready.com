"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, orderBy, query, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { 
  Bell, 
  Send, 
  Trash2, 
  Globe, 
  ShieldAlert, 
  Megaphone,
  Mail,
  Users,
  Clock,
  Plus
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "global" | "hackathon" | "important";
  createdAt: any;
  author: string;
}

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Announcement[];
      setAnnouncements(data);
    } catch (error) {
      console.error("Error fetching announcements", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this notice?")) return;
    try {
      await deleteDoc(doc(db, "announcements", id));
      setAnnouncements(announcements.filter(a => a.id !== id));
      toast.success("Notice deleted");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold italic tracking-tight">Platform Broadcasts</h2>
          <p className="text-white/60 text-sm">Send real-time notices and bulk notifications.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2 h-12 px-6 rounded-2xl shadow-xl shadow-blue-500/10 font-bold italic">
          <Megaphone className="h-5 w-5" />
          New Announcement
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
         {/* Operations Control */}
         <div className="lg:col-span-4 space-y-6">
            <Card className="p-8 space-y-8">
               <h3 className="font-bold italic tracking-tight uppercase text-xs text-white/40 mb-2">Operations Center</h3>
               
               <div className="space-y-4">
                  <div className="text-[10px] font-black tracking-widest text-white/30 uppercase">Communication Hub</div>
                  <Button variant="secondary" className="w-full justify-start gap-4 rounded-2xl h-12 text-xs border-white/5 opacity-50 cursor-not-allowed">
                     <Mail className="h-4 w-4 text-blue-400" />
                     Bulk Email Participants
                  </Button>
                  <Button variant="secondary" className="w-full justify-start gap-4 rounded-2xl h-12 text-xs border-white/5 opacity-50 cursor-not-allowed">
                     <ShieldAlert className="h-4 w-4 text-purple-400" />
                     Emergency Lockdown
                  </Button>
               </div>
               
               <div className="pt-8 border-t border-white/5 space-y-4">
                  <div className="text-[10px] font-black tracking-widest text-white/30 uppercase">External Sync</div>
                  <Button variant="ghost" className="w-full justify-start gap-4 rounded-2xl h-12 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5">
                     <Users className="h-4 w-4 text-emerald-400" />
                     Export User Database (CSV)
                  </Button>
               </div>
            </Card>
            
            <Card className="p-10 bg-gradient-to-tr from-blue-600/10 to-transparent border-blue-500/10 text-center">
               <Globe className="h-10 w-10 mx-auto text-blue-400 mb-6 animate-pulse" />
               <h4 className="font-bold mb-2 italic">Real-time Echo</h4>
               <p className="text-[11px] text-white/40 leading-relaxed">
                  Announcements are published instantly to the global activity feed on the participant dashboard.
               </p>
            </Card>
         </div>

         {/* Announcement Feed */}
         <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-white/20 ml-2">
               <Clock className="h-4 w-4" />
               Broadcast History
            </div>
            
            <div className="space-y-4">
               {loading ? (
                 [1,2,3].map(i => <div key={i} className="h-32 bg-white/5 rounded-3xl animate-pulse" />)
               ) : announcements.length === 0 ? (
                 <Card className="p-20 text-center border-dashed opacity-50">
                    <Megaphone className="h-10 w-10 mx-auto text-white/10 mb-4" />
                    <p className="italic text-white/30">The airwaves are quiet. No broadcast history.</p>
                 </Card>
               ) : announcements.map((a) => (
                 <Card key={a.id} className="p-6 group hover:border-white/10 transition-all border-white/5 bg-white/[0.01]">
                    <div className="flex justify-between items-start mb-4">
                       <div className="flex items-center gap-4">
                          <div className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center border border-white/10 transition-transform group-hover:rotate-12",
                            a.type === "global" ? "bg-blue-500/10 text-blue-400" : a.type === "important" ? "bg-red-500/10 text-red-400" : "bg-purple-500/10 text-purple-400"
                          )}>
                             <Megaphone className="h-5 w-5" />
                          </div>
                          <div>
                             <h4 className="font-bold italic tracking-tight flex items-center gap-2">
                                {a.title}
                                <Badge variant={a.type === "important" ? "danger" : "accent"} className="h-4 px-1 text-[8px]">{a.type}</Badge>
                             </h4>
                             <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-0.5">
                                Broadcasted on {new Date(a.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}
                             </p>
                          </div>
                       </div>
                       <button onClick={() => handleDelete(a.id)} className="p-2 text-white/10 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 className="h-4 w-4" />
                       </button>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed pl-14">
                       {a.content}
                    </p>
                 </Card>
               ))}
            </div>
         </div>
      </div>

      {showModal && (
        <AnnouncementModal 
          onClose={() => setShowModal(false)} 
          onSuccess={() => {
            setShowModal(false);
            fetchAnnouncements();
          }} 
        />
      )}
    </div>
  );
}

function AnnouncementModal({ onClose, onSuccess }: any) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "global"
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, "announcements"), {
        ...formData,
        createdAt: serverTimestamp(),
        author: "Admin"
      });
      toast.success("Broadcast successful!");
      onSuccess();
    } catch (error) {
      toast.error("Broadcast failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 overflow-y-auto">
      <Card className="w-full max-w-xl p-8 relative shadow-2xl">
         <div className="flex justify-between items-start mb-8">
            <h3 className="text-2xl font-bold italic tracking-tight">New Broadcast</h3>
            <button onClick={onClose} className="p-2 text-white/20 hover:text-white"><Plus className="h-6 w-6 rotate-45" /></button>
         </div>

         <form onSubmit={handleSubmit} className="space-y-6">
            <div>
               <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 mb-2 block">Broadcast Title</label>
               <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Phase 2 Submission Update" className="bg-white/5" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 mb-2 block">Channel Type</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as any})}
                    className="w-full h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                     <option value="global">Global Echo</option>
                     <option value="hackathon">Hackathon Only</option>
                     <option value="important">Critical Update</option>
                  </select>
               </div>
            </div>

            <div>
               <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 mb-2 block">Message Content</label>
               <textarea 
                 required
                 className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                 rows={4}
                 value={formData.content}
                 onChange={e => setFormData({...formData, content: e.target.value})}
                 placeholder="Message for all builders..."
               />
            </div>

            <div className="flex gap-4 pt-4">
               <Button type="button" variant="secondary" onClick={onClose} className="flex-1 h-12 rounded-2xl border-white/10">Abort</Button>
               <Button type="submit" disabled={submitting} className="flex-1 h-12 rounded-2xl gap-2 shadow-xl shadow-blue-500/20 font-bold italic">
                  <Send className="h-4 w-4" />
                  {submitting ? "Transmitting..." : "Send Broadcast"}
               </Button>
            </div>
         </form>
      </Card>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
